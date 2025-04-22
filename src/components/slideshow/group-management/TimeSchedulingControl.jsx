import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import React from "react";

export default function TimeSchedulingControl({ group, groups, setGroups }) {
  // Update group scheduling times
  const updateGroupSchedulingTime = (groupId, timeType, value) => {
    const updatedGroups = groups.map((group) => {
      if (group.id === groupId) {
        return {
          ...group,
          scheduling: {
            ...group.scheduling,
            [timeType]: value,
          },
        };
      }
      return group;
    });
    setGroups(updatedGroups);
  };

  // Toggle scheduling for a group
  const toggleGroupScheduling = (groupId, enabled) => {
    const updatedGroups = groups.map((group) => {
      if (group.id === groupId) {
        return {
          ...group,
          scheduling: {
            ...group.scheduling,
            enabled,
          },
        };
      }
      return group;
    });
    setGroups(updatedGroups);
  };
  return (
    <div className="p-3 border rounded-md bg-muted/20">
      <div className="flex items-center justify-between mb-3">
        <Label htmlFor={`scheduling-${group.id}`} className="font-medium">
          Time Schedule
        </Label>
        <Switch
          id={`scheduling-${group.id}`}
          checked={group.scheduling?.enabled || false}
          onCheckedChange={(checked) =>
            toggleGroupScheduling(group.id, checked)
          }
        />
      </div>

      {group.scheduling?.enabled && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          <div className="space-y-2">
            <Label htmlFor={`start-time-${group.id}`}>Start Time</Label>
            <Input
              id={`start-time-${group.id}`}
              type="time"
              value={group.scheduling.startTime}
              onChange={(e) =>
                updateGroupSchedulingTime(group.id, "startTime", e.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`end-time-${group.id}`}>End Time</Label>
            <Input
              id={`end-time-${group.id}`}
              type="time"
              value={group.scheduling.endTime}
              onChange={(e) =>
                updateGroupSchedulingTime(group.id, "endTime", e.target.value)
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
