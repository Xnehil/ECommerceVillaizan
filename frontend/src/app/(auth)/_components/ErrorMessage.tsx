import { TriangleAlert } from "lucide-react";

function ErrorMessage({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <div className="bg-destructive/15 text-red-500 flex items-center justify-center gap-x-2 rounded-md p-3 text-sm">
      <TriangleAlert className="h-4 w-4" />
      <span className="text-red-500">{message}</span>
    </div>
  );
}
export default ErrorMessage;
