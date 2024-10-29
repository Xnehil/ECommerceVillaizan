import { TriangleAlert } from "lucide-react";

function ErrorMessage({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <div className="bg-destructive/15 text-destructive flex items-center gap-x-2 rounded-md p-3 text-sm">
      <TriangleAlert className="h-4 w-4" />
      {message}
    </div>
  );
}
export default ErrorMessage;
