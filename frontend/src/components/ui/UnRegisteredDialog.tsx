

import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./alert-dialog";

interface UnregisterDialogProps {
  onConfirm: () => void;
  trigger: React.ReactNode;
}

export default function UnregisterDialog({ onConfirm, trigger }: UnregisterDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md bg-neutral-900 border-none">
        <AlertDialogHeader>
          <AlertDialogTitle >Leave the Contest?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to unregister? You’ll lose access to the contest problems.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
           <AlertDialogCancel className="bg-transparent border-neutral-400">Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={onConfirm}>
           Leave
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
