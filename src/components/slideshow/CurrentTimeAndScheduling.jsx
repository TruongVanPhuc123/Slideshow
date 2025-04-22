import { Clock } from "lucide-react";
import React from "react";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import Helper from "@/utils/Helper";

export default function CurrentTimeAndScheduling({
  useScheduling,
  setUseScheduling,
  currentTime,
}) {
  // Get current time as a string
  const getCurrentTimeString = () => {
    const now = currentTime;
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <span className="font-medium">
          Current Time: {Helper.formatTime(getCurrentTimeString())}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Time Scheduling:</span>
        <Switch
          checked={useScheduling}
          onCheckedChange={(checked) => setUseScheduling(checked)}
          id="scheduling-mode"
        />
        <Label
          htmlFor="scheduling-mode"
          className={useScheduling ? "font-medium" : "text-muted-foreground"}
        >
          {useScheduling ? "Enabled" : "Disabled"}
        </Label>
      </div>
    </div>
  );
}
