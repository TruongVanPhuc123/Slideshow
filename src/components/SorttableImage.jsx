import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableImage({ id, src, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="rounded-xl shadow-md p-1 bg-white relative mb-5"
    >
      <img src={src} alt="" className="h-40 w-auto rounded-lg" />
      <button
        onClick={() => onRemove(id)}
        className="absolute cursor-pointer top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
      >
        X
      </button>
    </div>
  );
}
