"use client";

import React, { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface TextAreaWithLabelProps {
  // id: string;
  label: string;
  placeholder?: string;
  maxLength?: number;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
}

const TextAreaWithLabel: React.FC<TextAreaWithLabelProps> = ({
  label,
  placeholder,
  maxLength = 300,
  onChange,
  disabled = false,
  value,
}) => {
  const [currentValue, setCurrentValue] = useState(value || "");

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentValue(event.target.value);
    if (onChange) {
      onChange(event);
    }
  };

  useEffect(() => {
    setCurrentValue(value || "");
  }, [value]);
  
  return (
    <div className="grid w-full max-w-sm items-center space-y-2">
      <Label>{label}</Label>
      <Textarea
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={handleChange}
        className="w-full max-h-64 overflow-y-auto"
        disabled={disabled}
        value={currentValue}
      />
      {!disabled && (
        <p className="text-sm text-muted-foreground text-right">
          {maxLength - currentValue.length} caracteres restantes
        </p>
      )}
    </div>
  );
};

export default TextAreaWithLabel;
