import { Input } from "components/input";
import { Label } from "components/label";

function InputWithLabel({ label, ...props }: { label: string } & React.ComponentProps<typeof Input>) {
  return (
    <div className="flex flex-col gap-0">
      <Label>{label}</Label>
      <Input {...props} />
    </div>
  );
}

export default InputWithLabel;
