import { Typography } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NonAlphas } from "@/features/events/eventEmitter";
import { useShortcuts } from "@/features/shortcuts/hooks/useShortcuts";
import { cn } from "@/lib/utils";
import type { TFunction } from "i18next";
import { useRef } from "react";

interface HiveInputProps {
  t: TFunction;
  error: { message: string } | null;
  onConfirm: (value?: string) => void;
  onCancel?: () => void;
  className?: string;
}

export const HiveInput = ({
  t,
  error,
  onConfirm,
  onCancel,
  className,
}: HiveInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useShortcuts(NonAlphas.Escape, () => onCancel?.());

  return (
    <div className={cn("md:w-1/2 w-full", className)}>
      <Typography variant="p" weight="normal" className="mb-2">
        {t("hiveName", { ns: "common" })}
      </Typography>
      <Input className="w-full" ref={inputRef} />
      {error && (
        <Typography variant="p" textColor="destructive" className="!mt-2">
          {error.message}
        </Typography>
      )}
      <div className="flex mx-auto mt-4 gap-2">
        <Button
          type="button"
          onClick={() => onConfirm(inputRef.current?.value)}
        >
          {t("confirm", { ns: "common" })}
        </Button>
        {onCancel && (
          <Button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
          >
            {t("cancel", { ns: "common" })}
          </Button>
        )}
      </div>
    </div>
  );
};
