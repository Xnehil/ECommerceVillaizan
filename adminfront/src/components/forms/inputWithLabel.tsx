import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InputWithLabelProps {
  // id: string;
  label: string;
  type?: string;
  placeholder?: string;
  // value: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  required?: boolean;
}

const InputWithLabel: React.FC<InputWithLabelProps> = ({
  label,
  type = "text",
  placeholder,
  onChange,
  accept,
  required = false,
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
      />
    </div>
  );
};

export default InputWithLabel;
