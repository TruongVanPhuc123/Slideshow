import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Slideshow from "@/components/Slideshow";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableImage from "@/components/SorttableImage";

function App() {
  const [images, setImages] = useState([]);
  const [showSlideshow, setShowSlideshow] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file, index) => ({
      id: `${file.name}-${index}`,
      url: URL.createObjectURL(file),
    }));
    setImages([...images, ...newImages]);
  };

  const handleRemove = (id) => {
    console.log(id);
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);
      setImages((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleStartSlideshow = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
    setShowSlideshow(true);
  };

  return (
    <div className="min-h-screen bg-muted px-6 py-10">
      {showSlideshow ? (
        <Slideshow
          images={images.map((img) => img.url)}
          onExit={() => setShowSlideshow(false)}
        />
      ) : (
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">
            🖼️ Tải ảnh từ máy
          </h1>

          <div className="flex justify-center mb-6">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
            />
          </div>

          {images.length > 0 && (
            <>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={images.map((img) => img.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {images.map((img) => (
                      <SortableImage
                        key={img.id}
                        id={img.id}
                        src={img.url}
                        onRemove={handleRemove}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              <div className="flex justify-center">
                <Button
                  onClick={handleStartSlideshow}
                  size="lg"
                  className="text-lg px-8 py-4"
                >
                  🚀 Bắt đầu trình chiếu
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
