"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { getFAQs, getTitlesBySection } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { Interweave } from "interweave";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export function LazyFAQSection() {
  const { ref, isIntersecting } = useIntersectionObserver();
  const { i18n } = useTranslation();

  const { data: faqs } = useQuery({
    queryKey: ["getFaqs"],
    queryFn: async () => await getFAQs(),
    enabled: isIntersecting,
  });

  const { data: homeFaq } = useQuery({
    queryKey: ["getHomeFaq"],
    queryFn: async () => await getTitlesBySection("faq"),
    enabled: isIntersecting,
  });

  const faqItems = Array.isArray(faqs?.data) ? faqs.data : [];

  return (
    <section ref={ref} className="bg-neutral-300/20 my-8">
      {isIntersecting ? (
        <div className="container py-6 flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            <h4
              className={`!font-bold text-4xl ${homeFaq?.home_faqTitle?.className}`}
            >
              {i18n.language === "en"
                ? homeFaq?.home_faqTitle?.value_en
                : homeFaq?.home_faqTitle?.value}
            </h4>
            <hr className="my-6 border-primary" />
            <p className="border-l pl-2 py-4 border-foreground font-roboto">
              {i18n.language === "en"
                ? homeFaq?.home_faqDescription?.value_en
                : homeFaq?.home_faqDescription?.value}
            </p>
          </div>
          <div className="lg:w-1/2">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem
                  value={`item-${index}`}
                  key={index}
                  className="bg-white rounded-lg mb-4 border-none px-4"
                >
                  <AccordionTrigger className="font-bold">
                    {i18n.language === "en"
                      ? item.question_en
                      : item.question_es}
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 font-roboto">
                    <Interweave
                      content={
                        i18n.language === "en" ? item.answer_en : item.answer_es
                      }
                    />
                    <br />
                    {item.url_link && (
                      <Link
                        className="underline"
                        href={item.url_link}
                        target={item.open_in_new_tab ? "_blank" : "_self"}
                        rel="noreferrer"
                      >
                        {item.url_link}
                      </Link>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      ) : (
        <div className="container py-6 flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2 h-48 animate-pulse bg-gray-200 rounded-lg" />
          <div className="lg:w-1/2 h-48 animate-pulse bg-gray-200 rounded-lg" />
        </div>
      )}
    </section>
  );
}
