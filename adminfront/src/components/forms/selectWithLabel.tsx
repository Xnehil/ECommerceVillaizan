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
}

const SelectWithLabel: React.FC<SelectWithLabelProps> = ({
  label,
  options,
  onChange,
  value,
}) => {
  return (
    <div className="grid w-full max-w-sm items-center space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
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
