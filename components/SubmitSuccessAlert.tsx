import { CheckCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";


export function AlertSuccess({ className }: { className: string }) {
  return (
    <Alert
      variant="default"
      className={`bg-green-50 border border-green-200 text-green-800 ${className}`}
    >
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertTitle className="font-semibold">Success</AlertTitle>
      <AlertDescription>
        Form submitted successfully! Redirecting...
      </AlertDescription>
    </Alert>
  );
}
