"use client";

"@/i18n";
import { useTranslation } from "react-i18next";
import { ContactForm } from "@/components/ContactForm";
import "@/assets/styles/Contacto.css";
import { Project } from "@/models/project";

interface ContactPageProps {
  homeTitles: any;
  projects: Project[];
}

export default function ContactPage({
  homeTitles,
  projects,
}: ContactPageProps) {
  const { t, i18n } = useTranslation("translations");

  return (
    <div className="container max-w-3xl mb-16">
      <div className="my-8">
        <h3
          className={`text-center text-3xl  lg:text-5xl ${homeTitles?.others_globalContact?.className}`}
        >
          {i18n.language === "en"
            ? homeTitles?.others_globalContact?.value_en
            : homeTitles?.others_globalContact?.value}
        </h3>
        <p className="text-neutral-400 text-center mt-6 uppercase text-base font-roboto">
          {t("provideDetails")}
        </p>
      </div>
      <ContactForm projects={projects} translation={{ t, i18n }} />
    </div>
  );
}
