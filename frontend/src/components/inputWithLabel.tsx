import React from "react";
import { Input } from "@components/input";
import { Label } from "@components/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@components/tooltip";

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
  tooltip?: string;
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
  tooltip,
}) => {
  return (
    <div className="grid w-full max-w-sm items-center space-y-2">
      <div className="flex space-x-2">
        <div className="h-full items-center">
          <Label>
            {label} {required && <span className="text-red-500"> *</span>}
          </Label>
        </div>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex items-center justify-center h-full px-2 py-1 text-xs bg-gray-200 rounded-full">
                i
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-full break-words">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
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
