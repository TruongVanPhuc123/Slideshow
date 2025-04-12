import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableImage({ id, src, setImages }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleRemove = () => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="rounded-xl shadow-md p-1 bg-white relative mb-5"
    >
      {/* Chỉ vùng này có thể kéo */}
      <img
        src={src}
        alt=""
        {...listeners} // ✅ Chỉ drag khi bấm vào ảnh
        className="h-40 w-auto rounded-lg cursor-grab active:cursor-grabbing"
      />

      {/* Nút xoá không bị ảnh hưởng bởi drag */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // ✅ Ngăn drag khi bấm nút
          handleRemove();
        }}
        className="absolute cursor-pointer top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
      >
        X
      </button>
    </div>
  );
}
