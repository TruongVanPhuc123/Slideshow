import React from "react";
import { Button } from "../ui/button";
import { Play, Pause, SkipBack, SkipForward, Maximize2 } from "lucide-react";
import { toast } from "sonner";

export default function PlaybackControls({
  isPlaying,
  groups,
  useScheduling,
  activeScheduledGroup,
  setCurrentGroupIndex,
  setCurrentImageIndex,
  setIsPlaying,
  currentGroupIndex,
  currentImageIndex,
  toggleFullscreen,
}) {
  const handlePlayPause = () => {
    if (useScheduling && activeScheduledGroup === null) {
      toast.error("Không có nhóm nào được lên lịch cho thởi điểm hiện tại");
      return;
    }

    if (useScheduling && activeScheduledGroup !== null && !isPlaying) {
      setCurrentGroupIndex(activeScheduledGroup);
      setCurrentImageIndex(0);
    }

    setIsPlaying(!isPlaying);
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else if (currentGroupIndex > 0) {
      const prevGroupIndex = currentGroupIndex - 1;
      setCurrentGroupIndex(prevGroupIndex);
      setCurrentImageIndex(groups[prevGroupIndex].images.length - 1);
    }
  };

  const nextImage = () => {
    if (currentImageIndex < groups[currentGroupIndex]?.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else if (currentGroupIndex < groups.length - 1) {
      setCurrentGroupIndex(currentGroupIndex + 1);
      setCurrentImageIndex(0);
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 p-4 border rounded-lg bg-background/95 backdrop-blur">
      <Button
        variant="outline"
        size="icon"
        onClick={prevImage}
        disabled={currentGroupIndex === 0 && currentImageIndex === 0}
      >
        <SkipBack className="h-4 w-4" />
      </Button>

      <Button
        variant="default"
        size="icon"
        className="h-12 w-12"
        onClick={handlePlayPause}
        disabled={groups.length === 0 || groups.every((g) => g.images.length === 0)}
      >
        {isPlaying ? (
          <Pause className="h-6 w-6" />
        ) : (
          <Play className="h-6 w-6 ml-1" />
        )}
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={nextImage}
        disabled={
          currentGroupIndex === groups.length - 1 &&
          currentImageIndex === groups[currentGroupIndex]?.images.length - 1
        }
      >
        <SkipForward className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="ml-2"
        onClick={toggleFullscreen}
      >
        <Maximize2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
