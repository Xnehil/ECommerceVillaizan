"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectWithLabelProps {
  label: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  value?: string;
  disabled?: boolean;
  required?: boolean;
}

const SelectWithLabel: React.FC<SelectWithLabelProps> = ({
  label,
  options,
  onChange,
  value,
  disabled = false,
  required = false,
}) => {
  return (
    <div className="grid w-full max-w-sm items-center space-y-2">
      <div className="h-full items-center">
        <Label>
          {label} {required && <span className="text-red-500"> *</span>}
        </Label>
      </div>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectWithLabel;
