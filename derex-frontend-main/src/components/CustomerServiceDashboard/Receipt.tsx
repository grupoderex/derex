export const CustomerServiceReceipt = () => {
  const charges = [
    { title: "CARGO", description: "Descripción del cargo", amount: 10 },
    { title: "CARGO B", description: "Descripción del cargo", amount: 20 },
    { title: "CARGO C", description: "Descripción del cargo", amount: 30 },
  ];
  return (
    <div className="md:m-20 mx-10 my-20">
      <div className="flex justify-between">
        <span>
          <p className="font-bold">Nombre</p>
          <p>MANUEL MANUALES</p>
        </span>

        <p>JAVER.COM</p>
        <div>
          <p>manual@correo.com</p>
          <p>(124) 567 812</p>
        </div>
      </div>
      <h4 className="uppercase font-bold my-20">recibo mes en curso</h4>
      <div className="flex text-xs md:text-lg justify-between flex-wrap gap-5 border-b pb-4 border-black-900">
        <div>
          <div>Recibo número:</div>
          <div>{100}</div>
        </div>
        <div>
          <div>Date issued:</div>
          <div>{"21 Diciembre, 2023"}</div>
        </div>

        <div>JAVER</div>
        <div>
          <div>Monterrey, NL, México</div>
          <div>contacto@javer.com.mx</div>
        </div>
      </div>
      <div>
        {charges.map((v) => (
          <div key={v.title} className="flex justify-between py-5 border-b">
            <p className="w-1/3">{v.title}</p>
            <p className="md:mr-64 w-2/3">{v.description}</p>
            <p>${v.amount}</p>
          </div>
        ))}
        <div className="mt-5 flex justify-between">
          <p className="uppercase font-bold">Total</p>
          <p>
            $
            {charges
              .map((v) => v.amount)
              .reduce((partial, a) => partial + a, 0)}
          </p>
        </div>
      </div>
    </div>
  );
};
