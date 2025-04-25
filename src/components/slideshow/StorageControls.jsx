import React from "react";
import { Button } from "../ui/button";
import { RefreshCw, Save } from "lucide-react";
import { toast } from "sonner";

export default function StorageControls({
  groups,
  useScheduling,
  setGroups,
  setCurrentGroupIndex,
  setCurrentImageIndex,
  setIsPlaying,
  setUseScheduling,
}) {
  // Force save current state
  const forceSave = () => {
    try {
      const storableGroups = groups.map((group) => ({
        ...group,
        images: group.images.map((image) => ({
          id: image.id,
          url: image.url,
          name: image.name,
        })),
      }));

      localStorage.setItem("slideshowGroups", JSON.stringify(storableGroups));
      localStorage.setItem(
        "slideshowScheduling",
        JSON.stringify(useScheduling)
      );

      toast.success(`Successfully saved ${groups.length} groups.`);
    } catch (error) {
      console.error("Error occurred while saving:", error);
      toast.error("Could not save slideshow data.");
    }
  };

  // Clear all saved data
  const clearSavedData = () => {
    try {
      localStorage.removeItem("slideshowGroups");
      localStorage.removeItem("slideshowScheduling");
      setGroups([]);
      setCurrentGroupIndex(0);
      setCurrentImageIndex(0);
      setIsPlaying(false);
      setUseScheduling(false);

      toast.success("All slideshow data has been cleared from local storage.", {
        duration: 3000,
      });
    } catch (error) {
      console.error("Error clearing localStorage:", error);
      toast.error("Failed to clear saved slideshow data.");
    }
  };
  return (
    <div className="flex flex-wrap gap-2 justify-end">
      <Button
        variant="outline"
        size="sm"
        onClick={forceSave}
        className="flex items-center gap-1"
      >
        <Save className="h-4 w-4" />
        Save to Storage
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={clearSavedData}
        className="flex items-center gap-1 text-destructive hover:text-destructive"
      >
        <RefreshCw className="h-4 w-4" />
        Clear Saved Data
      </Button>
    </div>
  );
}
