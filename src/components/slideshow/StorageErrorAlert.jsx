import React from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react";

export default function StorageErrorAlert({ storageError }) {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Storage Error</AlertTitle>
      <AlertDescription>{storageError}</AlertDescription>
    </Alert>
  );
}
