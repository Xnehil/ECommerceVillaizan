import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface CheckboxWithLabelProps {
  id: string;
  label: string;
  disabled?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const InputWithLabel: React.FC<CheckboxWithLabelProps> = ({
  id,
  label,
  disabled = false,
  checked = false,
  onChange,
}) => {
  return (
    <div className="items-top flex space-x-2">
      <Checkbox
        id={id}
        disabled={disabled}
        checked={checked}
        onCheckedChange={onChange}
      />
      <div className="grid gap-1.5 leading-none">
        <Label
          className={`text-sm font-normal ${
            disabled ? "text-muted-foreground" : ""
          }`}
        >
          {label}
        </Label>
      </div>
    </div>
  );
};

export default InputWithLabel;
