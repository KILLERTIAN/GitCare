'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useBountyContract } from '@/lib/hooks/use-bounty-contract'

interface CreateBountyFormProps {
    onSuccess?: () => void
}

export function CreateBountyForm({ onSuccess }: CreateBountyFormProps) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [reward, setReward] = useState('')
    const [tags, setTags] = useState('')
    const [deadline, setDeadline] = useState('')

    const { createBounty, isPending } = useBountyContract()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!title || !description || !reward) {
            alert('Please fill in all required fields')
            return
        }

        try {
            const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean)
            const deadlineTimestamp = deadline ? Math.floor(new Date(deadline).getTime() / 1000) : 0

            await createBounty(title, description, tagArray, deadlineTimestamp, reward)

            // Reset form
            setTitle('')
            setDescription('')
            setReward('')
            setTags('')
            setDeadline('')

            onSuccess?.()
        } catch (error) {
            console.error('Error creating bounty:', error)
        }
    }

    return (
        <Card className="backdrop-blur-sm bg-white/10 border-white/20">
            <CardHeader>
                <CardTitle>Create New Bounty</CardTitle>
                <CardDescription className="text-white/70">
                    Post a bounty for developers to complete
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Brief description of the task"
                            className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Detailed description of what needs to be done"
                            className="bg-white/5 border-white/20 text-white placeholder:text-white/50 min-h-[100px]"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="reward">Reward (AVAX) *</Label>
                        <Input
                            id="reward"
                            type="number"
                            step="0.001"
                            value={reward}
                            onChange={(e) => setReward(e.target.value)}
                            placeholder="0.1"
                            className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input
                            id="tags"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="react, typescript, frontend"
                            className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                        />
                    </div>

                    <div>
                        <Label htmlFor="deadline">Deadline (optional)</Label>
                        <Input
                            id="deadline"
                            type="datetime-local"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="bg-white/5 border-white/20 text-white"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                        {isPending ? 'Creating...' : 'Create Bounty'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}