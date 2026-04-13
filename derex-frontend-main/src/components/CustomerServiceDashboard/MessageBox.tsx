import { Icon } from "@iconify/react";

export const MessageBox = ({ mobile }: any) => {
  const msgs = [
    {
      title: "RECIBO ENERO",
      subject: "PRÓXIMO PAGO",
      body: "Este es su recibo de mes en curso, solicitamos su pago en lo...",
      date: "01/21 @ 11:23 AM",
    },
    {
      title: "RECIBO DICIEMBRE",
      subject: "PRÓXIMO PAGO",
      body: "Este es su recibo de mes en curso, solicitamos su pago en lo...",
      date: "01/20 @ 10:23 AM",
    },
    {
      title: "RECIBO NOVIEMBRE",
      subject: "SE REQUIRE PAGO",
      body: "Este es su recibo del mes en curso, solicitamos su pago en lo...",
      date: "01/19 @ 01:43 AM",
    },
  ];
  return (
    <div className={`h-full border-l-2  w-full ${mobile && " mt-16"}`}>
      <div className="flex justify-between p-4 border-b-2 border-r-2 mt-2 border-gray-100 b">
        <div className="flex items-center gap-2">
          <input type="checkbox" />
          <p>Seleccionar</p>
          <Icon icon="grommet-icons:power-cycle" className="text-gray-300" />
        </div>
        <div className="flex items-center text-gray-300">
          <p>1-50 of 200</p>
          <span className="flex font-bold text-xl">
            <Icon icon="radix-icons:caret-left" width="24" />
            <Icon icon="radix-icons:caret-right" width="24" />
          </span>
        </div>
      </div>
      <div className="border-r-2 border-gray-100 h-full">
        {msgs.map((v) => (
          <div
            key={v.title}
            className="flex flex-col gap-2 group p-5 border-b-2 border-gray-100 hover:bg-red-50"
          >
            <div className="flex justify-between ">
              <div className="flex gap-2 items-center">
                <input className="group-hover:border-red-500" type="checkbox" />
                <h4 className="font-bold">{v.title}</h4>
              </div>
              <p className="text-gray-300 group-hover:text-red-500">{v.date}</p>
            </div>
            <div className="flex">
              <div>
                <h5>{v.subject}</h5>
                <p>{v.body}</p>
              </div>
              <Icon
                icon="ion:ios-star-outline"
                className="text-4xl mt-2 group-hover:text-red-500"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
