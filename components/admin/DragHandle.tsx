export default function DragHandle() {
  return (
    <div className="drag-handle">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="drag-dot" />
      ))}
    </div>
  );
}
