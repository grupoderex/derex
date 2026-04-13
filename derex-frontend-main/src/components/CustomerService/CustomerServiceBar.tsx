export const CustomerServiceBar = () => {
  return (
    <div className="bg-primary flex flex-col md:flex-row  gap-4 text-center md:text-left items-center justify-between -mx-20 px-14 py-20 text-gray-50">
      <div>
        <div className="w-full text-2xl font-bold">
          TIPS DE MANTENIMIENTO PARA TU VIVIENDA
        </div>
        <p className="text-sm">
          Aquí podrás descargar una guía en PDF para el cuidado y mantenimiento
          de tu nuevo hogar.
        </p>
      </div>
      <button className="bg-neutral-400 underline p-3 rounded-s">
        DESCARGAR GUÍA
      </button>
    </div>
  );
};
