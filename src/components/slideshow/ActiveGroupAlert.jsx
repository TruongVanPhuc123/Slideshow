import React from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Calendar } from "lucide-react";
import Helper from "@/utils/Helper";

export default function ActiveGroupAlert({ activeScheduledGroup, groups }) {
  // Lọc ra các group đang active
  const activeGroups = groups.filter((_, index) =>
    activeScheduledGroup.includes(index)
  );

  if (activeGroups.length === 0) {
    return (
      <Alert variant="destructive" className="mb-0">
        <Calendar className="h-4 w-4" />
        <AlertTitle>No Active Group</AlertTitle>
        <AlertDescription>
          No group is scheduled for the current time. Create a group and set a
          time schedule that includes the current time.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-h-[300px] overflow-y-auto space-y-2">
      {activeGroups.map((group) => (
        <Alert variant="default" className="mb-2" key={group.id}>
          <Calendar className="h-4 w-4" />
          <AlertTitle>Active Group: {group.name}</AlertTitle>
          <AlertDescription>
            Currently playing group "{group.name}" scheduled for{" "}
            {Helper.formatTime(group.scheduling.startTime)} -{" "}
            {Helper.formatTime(group.scheduling.endTime)}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
