'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useBountyContract } from '@/hooks/use-bounty-contract'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

const bountySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  reward: z.number().positive('Reward must be a positive number'),
  deadline: z.date().min(new Date(), 'Deadline must be in the future'),
})

type BountyFormData = z.infer<typeof bountySchema>

interface BountyCreationFormProps {
  isOpen: boolean
  onClose: () => void
  onBountyCreated: () => void
}

export function BountyCreationForm({ isOpen, onClose, onBountyCreated }: BountyCreationFormProps) {
  const { createBounty, transactionState } = useBountyContract()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BountyFormData>({
    resolver: zodResolver(bountySchema),
  })

  const onSubmit = async (data: BountyFormData) => {
    setIsSubmitting(true)
    try {
      const deadlineTimestamp = Math.floor(data.deadline.getTime() / 1000)
      await createBounty(data.title, data.description, data.reward, deadlineTimestamp)
      
      // The hook now manages transaction state, we can monitor `isConfirmed`
      // and then close the modal and refetch.
      // For now, we'll close optimistically after sending.
      onBountyCreated()
      onClose()
      reset()
    } catch (error) {
      console.error('Failed to create bounty:', error)
      // You might want to show an error message to the user here
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/20 text-white">
        <DialogHeader>
          <DialogTitle>Create a New Bounty</DialogTitle>
          <DialogDescription>
            Fill out the details below to post a new bounty on the board.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register('title')} className="bg-gray-800/50 border-white/20" />
            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} className="bg-gray-800/50 border-white/20" />
            {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>}
          </div>
          <div>
            <Label htmlFor="reward">Reward (AVAX)</Label>
            <Input id="reward" type="number" step="0.01" {...register('reward', { valueAsNumber: true })} className="bg-gray-800/50 border-white/20" />
            {errors.reward && <p className="text-red-400 text-sm mt-1">{errors.reward.message}</p>}
          </div>
          <div>
            <Label htmlFor="deadline">Deadline</Label>
            <Input id="deadline" type="date" {...register('deadline', { valueAsDate: true })} className="bg-gray-800/50 border-white/20" />
            {errors.deadline && <p className="text-red-400 text-sm mt-1">{errors.deadline.message}</p>}
          </div>
          <Button type="submit" disabled={isSubmitting || transactionState.isPending} className="w-full bg-blue-600 hover:bg-blue-700">
            {isSubmitting || transactionState.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Bounty'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
