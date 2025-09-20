import { Button } from "@/components/ui/button";

export function ButtonDemo() {
  return (
    <div className="p-8 space-y-6">
      <h3 className="text-2xl font-bold text-white mb-4">Glassmorphism Button Variants</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white/80">Glass</h4>
          <Button variant="glass" className="w-full">
            Glass Button
          </Button>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white/80">Glass Primary</h4>
          <Button variant="glass-primary" className="w-full">
            Glass Primary
          </Button>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white/80">Glass Secondary</h4>
          <Button variant="glass-secondary" className="w-full">
            Glass Secondary
          </Button>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white/80">Outline Neon</h4>
          <Button variant="outline-neon" className="w-full">
            Outline Neon
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button variant="glass" size="sm">
          Small Glass
        </Button>
        <Button variant="glass-primary" size="lg">
          Large Glass Primary
        </Button>
        <Button variant="glass-secondary" disabled>
          Disabled Glass
        </Button>
        <Button variant="outline-neon" size="icon">
          ✨
        </Button>
      </div>
    </div>
  );
}