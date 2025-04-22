import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Helper from "@/utils/Helper";
import { Clock, Trash2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export default function GroupHeader({
  index,
  group,
  useScheduling,
  activeScheduledGroup,
  groups,
  setGroups,
  currentGroupIndex,
  setCurrentGroupIndex,
  setCurrentImageIndex,
}) {
  // Remove a group
  const removeGroup = (groupId) => {
    const groupToRemove = groups.find((group) => group.id === groupId);
    const updatedGroups = groups.filter((group) => group.id !== groupId);
    setGroups(updatedGroups);

    // Reset current indices if needed
    if (currentGroupIndex >= updatedGroups.length) {
      setCurrentGroupIndex(Math.max(0, updatedGroups.length - 1));
      setCurrentImageIndex(0);
    }

    toast.success(
      groupToRemove ? `Removed group "${groupToRemove.name}"` : "Group removed"
    );
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h3 className="font-medium text-lg">
          Group {index + 1}: {group.name}
        </h3>
        {useScheduling && group.scheduling?.enabled && (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {Helper.formatTime(group.scheduling.startTime)} -{" "}
            {Helper.formatTime(group.scheduling.endTime)}
          </Badge>
        )}
        {useScheduling && activeScheduledGroup.includes(index) ? (
          <Badge className="bg-green-500 text-white">Clock Up</Badge>
        ) : (
          <Badge className="ml-1 text-white bg-red-500">Clock Over</Badge>
        )}
      </div>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => removeGroup(group.id)}
      >
        <Trash2 className="h-4 w-4 mr-1" />
        Remove Group
      </Button>
    </div>
  );
}
