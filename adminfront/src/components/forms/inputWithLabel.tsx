import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InputWithLabelProps {
  // id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  required?: boolean;
  disabled?: boolean;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

const InputWithLabel: React.FC<InputWithLabelProps> = ({
  label,
  type = "text",
  placeholder,
  onChange,
  accept,
  required = false,
  disabled = false,
  value,
  onBlur,
}) => {
  return (
    <div className="grid w-full max-w-sm items-center space-y-2">
      <Label>
        {label} {required && <span className="text-red-500"> *</span>}
      </Label>
      <Input
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        accept={accept}
        disabled={disabled}
        value={value}
        onBlur={onBlur}
      />
    </div>
  );
};

export default InputWithLabel;
