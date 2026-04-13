export function Chip({ ...props }) {
  return (
    <div
      className={`flex flex-row items-center rounded-full py-2 px-4 ${props.className}`}
    >
      <span className="text-xs w-max">{props.name}</span>
    </div>
  );
}
