import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

interface SaveScenarioDialogProps {
  toolType: string;
  inputData: any;
  outputData: any;
  disabled?: boolean;
}

export function SaveScenarioDialog({ 
  toolType, 
  inputData, 
  outputData, 
  disabled = false 
}: SaveScenarioDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save scenarios.",
        variant: "destructive",
      });
      return;
    }

    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your scenario.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await authService.saveScenario({
        name: name.trim(),
        tool_type: toolType,
        input_json: inputData,
        output_json: outputData,
        is_private: isPrivate,
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to save scenario. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Scenario saved successfully!",
        });
        setOpen(false);
        setName('');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Button variant="outline" disabled>
        <Save className="w-4 h-4 mr-2" />
        Sign in to Save
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          <Save className="w-4 h-4 mr-2" />
          Save Scenario
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Calculation Scenario</DialogTitle>
          <DialogDescription>
            Save your calculation inputs and results for future reference.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Scenario Name</Label>
            <Input
              id="name"
              placeholder="Enter a descriptive name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="private"
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
            />
            <Label htmlFor="private">
              Keep this scenario private
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Scenario'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}