"use client";
import { useState } from "react";
import { ComplaintsForm } from "@/components/CustomerService/ComplaintsForm";
import { CustomerServiceNavBar } from "@/components/CustomerService/NavBar";
import { CustomerServiceMenu } from "@/components/CustomerServiceDashboard/Menu";
import { MessageBox } from "@/components/CustomerServiceDashboard/MessageBox";
import { CustomerServiceReceipt } from "@/components/CustomerServiceDashboard/Receipt";
import { Icon } from "@iconify/react";

export default function Page() {
  const items = [
    { title: "Notificaciones", notifications: 9, Section: ComplaintsForm },
    { title: "Reportes", notifications: 1, Section: ComplaintsForm },
    { title: "Recibos", notifications: 0, Section: CustomerServiceReceipt },
    { title: "Mensajes", Section: MessageBox },
  ];

  const [open, setOpen] = useState(true);
  const [section, setSection] = useState("Recibos");
  return (
    <div>
      <CustomerServiceNavBar dashboard />
      <div className="p-4 flex gap-5">
        {items.map(
          (v) =>
            v.title !== "Mensajes" && (
              <div
                key={v.title}
                className={`flex items-center gap-2 pb-4 ${
                  section === v.title && "border-b-4 border-primary"
                } `}
              >
                <span
                  className={`text-left text-neutral-400 font-bold pl-2  ${
                    section === v.title && "text-primary "
                  }`}
                >
                  {v.title}
                </span>
                <div className="h-6 w-6 text-sm rounded-full bg-neutral-400  font-bold text-center">
                  {v.notifications}
                </div>
              </div>
            )
        )}
      </div>
      <div className="flex border-t-2 h-full -mt-4 z-50 relative">
        <button
          onClick={() => {
            setOpen(!open);
          }}
          className="text-5xl md:hidden absolute  m-4"
        >
          <Icon icon="ion:menu" width="24" />
        </button>
        {open && (
          <div
            className={`w-2/6 absolute h-full md:relative bg-white-A700  overflow-hidden md:w-1/6 ${
              !open && "w-0  overflow-hidden"
            }`}
          >
            <button
              onClick={() => {
                setOpen(!open);
              }}
              className="text-5xl md:hidden absolute  m-4"
            >
              <Icon icon="ion:menu" width="24" />
            </button>
            <CustomerServiceMenu section={section} setSection={setSection} />
          </div>
        )}

        <div className="w-0 overflow-hidden md:w-2/6">
          <MessageBox mobile={null} />
        </div>
        <div className="w-full">
          {items.map(
            ({ title, Section }) =>
              section === title && <Section mobile key={title} />
          )}
        </div>
      </div>
    </div>
  );
}
