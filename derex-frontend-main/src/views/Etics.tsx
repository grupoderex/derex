"use client";

import "@/i18n";
import Link from "next/link";
import { Title } from "@/components/shared/Title";
import { useTranslation } from "react-i18next";
import { DecalogueSection } from "@/models/decalogues";

interface EticsPageProps {
  homeTitles: any;
  notices: DecalogueSection[];
}

export default function EticsPage({ homeTitles, notices }: EticsPageProps) {
  const { i18n } = useTranslation("translations");

  return (
    <div className=" my-10 mx-2 md:mx-40 min-h-[70vh] ">
      <div className="grid place-items-center">
        <Title
          className={`!font-extrabold ${homeTitles?.others_privacyNotice?.className}`}
        >
          {i18n.language === "en"
            ? homeTitles?.others_privacyNotice?.value_en
            : homeTitles?.others_privacyNotice?.value}
        </Title>
        <span className=" p-6 border-y-2 border-neutral-400 flex gap-10 justify-center w-full ">
          <div className="text-neutral-400 font-bold font-roboto">
            PARA CLIENTES
          </div>
          <div className="text-neutral-400 font-bold font-roboto">
            PARA EMPLEADOS
          </div>
          <div className="text-neutral-400 font-bold font-roboto">
            PARA PROVEEDORES
          </div>
        </span>
        <div className="mt-8 grid   w-2/3">
          {notices.map((v) => (
            <div key={v.id} className="p-5">
              <div className="text-primary font-bold my-5 font-roboto">
                {i18n.language === "en" ? v.name_en : v.name_es}
              </div>
              {v.decalogue.map((i) => (
                <div key={i.id}>
                  <p className="font-roboto">
                    {i18n.language === "en" ? i.title_en : i.title_es}[{" "}
                    <Link
                      href={"/avisos-de-privacidad/" + i.id}
                      className="underline text-primary font-roboto"
                    >
                      Leer aquí
                    </Link>{" "}
                    ]
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
