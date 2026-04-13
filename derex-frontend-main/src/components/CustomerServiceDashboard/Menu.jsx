export const CustomerServiceMenu = ({ setSection, section }) => {
  const menuItems = [
    "Notificaciones",
    "Reportes",
    "Recibos",
    "Escrituras",
    "Información",
  ];
  return (
    <div className="flex h-full p-6 gap-4 border-r-2 md:border-0 mt-10 md:mt-2 border-gray-100 flex-col">
      {menuItems.map((v) => (
        <button
          className={`text-left text-neutral-400 font-bold pl-2 ${
            section === v && "text-primary border-l-4 border-primary"
          }`}
          onClick={() => setSection(v)}
          key={v}
        >
          {v}
        </button>
      ))}
      <button
        onClick={() => setSection("Mensajes")}
        className={`text-left text-neutral-400 font-bold pl-2 block md:hidden ${
          section === "Mensajes" && "text-primary border-l-4 border-primary"
        }`}
      >
        Mensajes
      </button>
    </div>
  );
};
