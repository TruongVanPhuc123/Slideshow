import React from "react";
import { Card, CardContent } from "../ui/card";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { Button } from "../ui/button";

export default function SlideshowDisplay({
  groups,
  currentGroupIndex,
  slideshowContainerRef,
  nextImage,
  currentImageIndex,
  setCurrentGroupIndex,
  setCurrentImageIndex,
}) {
  // Navigate to previous image
  const prevImage = () => {
    if (groups.length === 0) return;

    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else {
      // Move to previous group
      if (currentGroupIndex > 0) {
        const prevGroupIndex = currentGroupIndex - 1;
        setCurrentGroupIndex(prevGroupIndex);
        setCurrentImageIndex(
          Math.max(0, groups[prevGroupIndex].images.length - 1)
        );
      } else {
        // Loop to last group
        const lastGroupIndex = groups.length - 1;
        setCurrentGroupIndex(lastGroupIndex);
        setCurrentImageIndex(
          Math.max(0, groups[lastGroupIndex].images.length - 1)
        );
      }
    }
  };

  // Get current image to display
  const getCurrentImage = () => {
    if (
      groups.length === 0 ||
      !groups[currentGroupIndex] ||
      groups[currentGroupIndex].images.length === 0
    ) {
      return null;
    }

    return groups[currentGroupIndex].images[currentImageIndex];
  };

  const currentImage = getCurrentImage();

  return (
    <Card className="overflow-hidden p-0">
      <CardContent className="p-0 relative" ref={slideshowContainerRef}>
        {currentImage ? (
          <div className="relative aspect-video bg-muted flex items-center justify-center overflow-hidden">
            <img
              src={currentImage.url || "/placeholder.svg"}
              alt="Slideshow"
              className="max-h-full max-w-full object-contain"
            />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 text-xs">
              <span className="bg-black/70 text-white px-2 py-1 rounded">
                Group: {groups[currentGroupIndex]?.name || "None"} (
                {currentGroupIndex + 1}/{groups.length})
              </span>
              <span className="bg-black/70 text-white px-2 py-1 rounded">
                Image: {currentImageIndex + 1}/
                {groups[currentGroupIndex]?.images.length || 0}
              </span>
            </div>
          </div>
        ) : (
          <div className="aspect-video bg-muted  flex flex-col items-center justify-center text-muted-foreground">
            <ImageIcon size={48} className="mb-2 opacity-50" />
            <p>No images to display</p>
            <p className="text-sm">
              Add images to groups to start the slideshow
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full opacity-80 hover:opacity-100"
            onClick={prevImage}
            disabled={groups.length === 0}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full opacity-80 hover:opacity-100"
            onClick={nextImage}
            disabled={groups.length === 0}
          >
            <ChevronRight />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
