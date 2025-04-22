import React from "react";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { Plus } from "lucide-react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function GroupImage({ group, fileInputRef, groups, setGroups }) {
  // Remove an image from a group
  const removeImage = (groupId, imageId) => {
    const updatedGroups = groups.map((group) => {
      if (group.id === groupId) {
        return {
          ...group,
          images: group.images.filter((img) => img.id !== imageId),
        };
      }
      return group;
    });
    setGroups(updatedGroups);
  };

  // Handle file selection
  const handleFileSelect = (e, groupId) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const targetGroup = groups.find((g) => g.id === groupId);
    if (!targetGroup) return;

    // Process files and convert to data URLs for storage
    const processFiles = async () => {
      try {
        const newImages = await Promise.all(
          Array.from(files).map(async (file) => {
            // Convert file to base64
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => {
                resolve({
                  id: Date.now() + Math.random().toString(),
                  url: reader.result,
                  name: file.name,
                });
              };
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });
          })
        );

        const updatedGroups = groups.map((group) => {
          if (group.id === groupId) {
            return {
              ...group,
              images: [...group.images, ...newImages],
            };
          }
          return group;
        });

        setGroups(updatedGroups);
        toast.success(
          `Added ${newImages.length} images to "${targetGroup.name}"`
        );
      } catch (error) {
        console.error("Error processing files:", error);
        toast.error("Failed to process image files.");
      }
    };

    processFiles();

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Images ({group.images.length})</Label>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFileSelect(e, group.id)}
            id={`file-input-${group.id}`}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              document.getElementById(`file-input-${group.id}`).click()
            }
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Images
          </Button>
        </div>
      </div>

      {group.images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {group.images.map((image) => (
            <div
              key={image.id}
              className="relative group aspect-square bg-muted rounded-md overflow-hidden"
            >
              <img
                src={image.url || "/placeholder.svg"}
                alt={image.name || "Thumbnail"}
                className="w-full h-full object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(group.id, image.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-muted-foreground bg-muted/50 rounded-md">
          <p>No images in this group</p>
        </div>
      )}
    </div>
  );
}
