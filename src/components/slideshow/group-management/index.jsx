import { Clock, Plus, Trash2 } from "lucide-react";
import React from "react";
import { Card, CardContent } from "../../ui/card";
import { Input } from "../../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Button } from "../../ui/button";
import { toast } from "sonner";
import SlideSpeed from "./SlideSpeed";
import GroupImage from "./GroupImage";
import GroupHeader from "./GroupHeader";
import TimeSchedulingControl from "./TimeSchedulingControl";

export default function GroupManagement({
  groups,
  activeScheduledGroup,
  newGroupName,
  setNewGroupName,
  isLoading,
  useScheduling,
  fileInputRef,
  setGroups,
  setCurrentGroupIndex,
  setCurrentImageIndex,
  currentGroupIndex,
  speed,
  setSpeed,
  timeUnit,
  setTimeUnit,
}) {
  // Create a new group
  const createGroup = () => {
    if (!newGroupName.trim()) return;

    const newGroup = {
      id: Date.now().toString(),
      name: newGroupName,
      images: [],
      scheduling: {
        enabled: false,
        startTime: "09:00",
        endTime: "17:00",
      },
    };

    setGroups([...groups, newGroup]);
    setNewGroupName("");

    toast.success(`Created group "${newGroupName}"`);
  };
  return (
    <Tabs defaultValue="manage" className="w-full">
      <TabsList className="grid grid-cols-2">
        <TabsTrigger value="manage">Manage Groups</TabsTrigger>
        <TabsTrigger value="create">Create Group</TabsTrigger>
      </TabsList>

      <TabsContent value="create" className="space-y-4 pt-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter group name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <Button onClick={createGroup}>
            <Plus className="mr-2 h-4 w-4" />
            Create Group
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="manage" className="space-y-6 pt-4">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Loading saved groups...</p>
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No groups created yet</p>
            <p className="text-sm">Create a group to add images</p>
          </div>
        ) : (
          groups.map((group, index) => (
            <Card key={group.id} className="overflow-hidden">
              <CardContent className="p-4 space-y-4">
                <GroupHeader
                  index={index}
                  group={group}
                  useScheduling={useScheduling}
                  activeScheduledGroup={activeScheduledGroup}
                  groups={groups}
                  setGroups={setGroups}
                  currentGroupIndex={currentGroupIndex}
                  setCurrentGroupIndex={setCurrentGroupIndex}
                  setCurrentImageIndex={setCurrentImageIndex}
                />

                {/* Time Scheduling Controls */}
                {useScheduling && (
                  <TimeSchedulingControl
                    group={group}
                    groups={groups}
                    setGroups={setGroups}
                  />
                )}

                {/*Change Slide Speed*/}
                <SlideSpeed
                  speed={speed}
                  setSpeed={setSpeed}
                  timeUnit={timeUnit}
                  setTimeUnit={setTimeUnit}
                />

                <GroupImage
                  group={group}
                  fileInputRef={fileInputRef}
                  groups={groups}
                  setGroups={setGroups}
                />
              </CardContent>
            </Card>
          ))
        )}
      </TabsContent>
    </Tabs>
  );
}
