import { Button } from "@/components/shared/Button";
import { Mark } from "@/components/shared/Mark";
import { Title } from "@/components/shared/Title";

export const CustomerServiceNavBar = ({ dashboard }:any) => {
  return (
    <nav className="border-b-2 border-neutral-400 px-8 w-full  flex flex-wrap">
      <span className="w-full md:w-1/3">
        <Title
          className={`${
            !dashboard ? "!text-gray-50" : "!text-neutral-400"
          } !text-4xl md:!text-3xl lg:text-3xl`}
        >
          Servicio a clientes <Mark>Derex</Mark>
        </Title>
      </span>
      <span className="px-2 w-full md:w-2/3 text-sm flex flex-wrap lg:flex-nowrap gap-3  items-center justify-center text-center">
        <div className="w-3/4 justify-center uppercase font-bold lg:whitespace-nowrap flex flex-col md:flex-row gap-8">
          <a >Información</a>
          <a>Realizar reporte</a>
          <a>Documento de mantenimiento</a>
        </div>

        <div className="w-full md:w-1/4 pb-2 md:pb-0">
          <Button className="uppercase">
            {dashboard ? "Cerrar " : "Inicia"} sesión
          </Button>
        </div>
      </span>
    </nav>
  );
};
