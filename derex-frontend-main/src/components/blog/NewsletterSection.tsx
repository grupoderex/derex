import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerNewsletter } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { toast } from "react-toastify";
import * as yup from "yup";

export function NewsletterSection() {
  const { t } = useTranslation("translations");

  const navigate = useRouter();

  const { mutate: addNewsletter, isPaused } = useMutation({
    mutationKey: ["addNewsletter"],
    mutationFn: async (email: string) => {
      await registerNewsletter(email);
    },
    onSuccess: () => {
      navigate.push("/blog/newsletter");
    },
    onError: () => {
      toast.error(t("newsletterError"));
    },
  });

  return (
    <div className="py-20 bg-neutral-100">
      <section className="container max-w-3xl text-center">
        <h4>{t("newsLetterTitle")}</h4>
        <p className="font-display my-8">{t("newsLetterSubtitle")}</p>
        <Formik
          initialValues={{ email: "" }}
          validationSchema={yup.object().shape({
            email: yup
              .string()
              .email("El formato del correo electrónico es incorrecto")
              .required("El campo es requerido"),
          })}
          onSubmit={(values) => {
            addNewsletter(values.email);
          }}
        >
          {({
            handleSubmit,
            handleReset,
            getFieldProps,
            errors,
          }) => (
            <Form
              className="mt-4 mx-auto w-full max-w-xl flex flex-col sm:flex-row gap-3"
              onSubmit={handleSubmit}
              onReset={handleReset}
            >
              <Input
                placeholder={t("newsLetterPlaceholder")}
                className="bg-white"
                parentClassName="w-full sm:flex-1"
                type="email"
                error={errors?.email}
                {...getFieldProps("email")}
              />
              <Button
                type="submit"
                className="w-full sm:w-auto"
                isLoading={isPaused}
              >
                {t("newsLetterButton")}
              </Button>
            </Form>
          )}
        </Formik>
        <p className="text-sm text-neutral-400 text-center mt-4">
          {t("newsLetterPolicy")}
        </p>
      </section>
    </div>
  );
}
