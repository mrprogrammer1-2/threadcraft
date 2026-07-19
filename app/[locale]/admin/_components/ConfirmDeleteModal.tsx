"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ConfirmDeleteModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  itemCount?: number;
};

export function ConfirmDeleteModal({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
  itemCount = 1,
}: ConfirmDeleteModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-surface border-border rounded-none">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-cream tracking-tight">Are you sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-muted text-[11px]">
            This will permanently delete {itemCount} item
            {itemCount !== 1 ? "s" : ""}. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-2 justify-end">
          <AlertDialogCancel disabled={isLoading} className="rounded-none border-border text-dim hover:text-cream hover:bg-raised bg-transparent">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-none bg-[#8b4040] hover:bg-[#a05050] text-cream border-0"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
