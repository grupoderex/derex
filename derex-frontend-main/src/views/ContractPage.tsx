"use client";

"@/i18n";
import { Title } from "@/components/shared/Title";
import { ContratoDeAdhesion } from "@/models/contratos_de_adhesion";
import { useTranslation } from "react-i18next";

interface ContractPageProps {
  data: ContratoDeAdhesion[];
  homeTitles: any;
}

export default function ContractPage({ data, homeTitles }: ContractPageProps) {
  const { i18n } = useTranslation("translations");

  return (
    <div className="my-10 mx-2 md:mx-40 min-h-[70vh] ">
      <div className="grid place-items-center">
        <Title
          className={`!font-extrabold ${homeTitles?.others_adhesionContracts?.className}`}
        >
          {i18n.language === "en"
            ? homeTitles?.others_adhesionContracts?.value_en
            : homeTitles?.others_adhesionContracts?.value}
        </Title>
        <>
          <span className=" p-6 border-y-2 border-neutral-400 flex gap-10 justify-center w-full ">
            {data?.map((v: any) => (
              <div
                key={v.section}
                className="text-neutral-400 uppercase font-bold font-roboto"
              >
                {v.section.split(",")[0]}
              </div>
            ))}
          </span>
          <div className="mt-8 grid place-items-center w-2/3">
            {data?.map((v: any) => (
              <div key={v.section} className="p-5">
                <div className="text-primary font-bold my-5 font-roboto">
                  {v.section}
                </div>
                {v.documents.map((i: any) => (
                  <div key={i.id}>
                    <p className="font-roboto">
                      {i.name} [{" "}
                      <a
                        href={i.url}
                        target="_blank"
                        className="underline text-primary"
                        rel="noreferrer"
                      >
                        Leer aquí
                      </a>{" "}
                      ]
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      </div>
    </div>
  );
}
