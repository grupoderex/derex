interface GridListProps {
  items: string[];
}

export const GridList = ({ items }: GridListProps) => {
  return (
    <div className="grid gap-x-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div
          key={item}
          className="px-4 py-3 border-b border-gray-300 flex flex-row items-center gap-4 text-foreground-soft"
        >
          <div>•</div>
          <div>{item}</div>
        </div>
      ))}
    </div>
  );
};
