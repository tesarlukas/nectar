import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { TFunction } from "i18next";
import type { ReactNode } from "react";

export interface DeleteConfirmationProps {
  t: TFunction;
  icon: ReactNode;
  actionTitle: string;
  actionDescription: string;
  onConfirm: () => void;
}

export const DeleteConfirmation = ({
  t,
  icon,
  actionTitle,
  actionDescription,
  onConfirm,
}: DeleteConfirmationProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="h-full flex items-center justify-center aspect-square bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/70 transition-colors">
        {icon}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{actionTitle}</AlertDialogTitle>
          <AlertDialogDescription>{actionDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel", { ns: "common" })}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {t("confirm", { ns: "common" })}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
