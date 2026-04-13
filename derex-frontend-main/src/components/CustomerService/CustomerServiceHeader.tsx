
import { Title } from "@/components/shared/Title";
import { Img } from "@/views/Img";
import { CustomerServiceNavBar } from "./NavBar";
import { LinkButton } from "@/components/shared/LinkButton";

export const CustomerServiceHeader = () => {
  return (
    <div className="text-gray-50 -mx-6">
      <div className="relative m-5">
        <Img
          className="brightness-50 object-cover  h-[640px] rounded-lg w-full"
          src="/images/certificaciones/familia.png"
          alt="imageTwentySix"
        />

        <div className="absolute right-0 left-0  bottom-1/2 md:bottom-full md:top-0">
          <CustomerServiceNavBar />
        </div>
        <div className="absolute top-1/2 w-full md:w-2/3 flex justify-center md:justify-start items-center flex-wrap md:left-5 p-3  md:top-1/2 ">
          <Title className="md:!text-left !text-gray-50 md:text-2xl max-w-full ">
            Estamos para ayudarte y cuidar de tu patrimonio.
          </Title>
          <LinkButton to="/servicio-a-clientes-dashboard">
            ACCEDE A LA INFORMACIÓN DE TU HOGAR
          </LinkButton>
        </div>
      </div>
    </div>
  );
};
