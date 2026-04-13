"use client";

import "@/assets/styles/Contacto.css";
import "@/assets/styles/Lotes.css";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RECAPTCHA_SITE_KEY } from "@/constants";
import "@/i18n";
import { useAuthStore } from "@/stores/useAuthStore";
import { getInitialDataDesarrollos, postLotesForm } from "@/utils/api";
import {
    EMAIL_REGEX,
    MESSAGE_REGEX,
    NAME_REGEX,
    PHONE_REGEX,
} from "@/utils/regex";
import { useQuery } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import * as yup from "yup";

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  state: "",
  squareMeters: "",
  message: "",
  acceptPolicy: false,
  recaptcha: "",
};

interface LotesPageProps {
  homeTitles: any;
  websiteMedia: any;
}

export default function LotesPage({
  homeTitles,
  websiteMedia,
}: LotesPageProps) {
  const navigate = useRouter();
  const titleRef = useRef<HTMLDivElement>(null);

  const { t, i18n } = useTranslation("translations");

  const user = useAuthStore((state) => state.user);

  const { data: dataDesarrollos } = useQuery({
    queryKey: ["desarrollos"],
    queryFn: getInitialDataDesarrollos,
    staleTime: 1000 * 60 * 60,
    initialData: [],
  });

  const metrosCuadrados = [
    "Desde 100 a 500 m2",
    "Desde 501 a 1000 m2",
    "Desde 1001 a 5000 m2",
    "Más de 1000 m2",
  ];

  useEffect(() => {
    if (websiteMedia && titleRef.current) {
      const styleMedia = titleRef.current as any;
      styleMedia.style.backgroundImage = `url(${websiteMedia.value}`;
      styleMedia.style.color = "#FFF";
    }
  }, [websiteMedia]);

  const validationSchema = yup.object().shape({
    firstName: yup
      .string()
      .min(3, t("nameMinLength"))
      .max(100, t("lastNameMaxLength"))
      .matches(NAME_REGEX, t("nameCharsField"))
      .required(t("fieldRequired")),
    lastName: yup
      .string()
      .min(3, t("nameMinLength"))
      .max(100, t("lastNameMaxLength"))
      .matches(NAME_REGEX, t("lastNameCharsField"))
      .required(t("fieldRequired")),
    email: yup
      .string()
      .email(t("invalidEmail"))
      .required(t("fieldRequired"))
      .matches(EMAIL_REGEX, t("invalidEmail")),
    phone: yup
      .string()
      .max(10, t("invalidPhone"))
      .matches(PHONE_REGEX, t("invalidPhone"))
      .required(t("fieldRequired")),
    company: yup
      .string()
      .min(3, t("companyFieldMinLength"))
      .max(100, t("companyFieldMaxLength"))
      .matches(NAME_REGEX, t("messageInvalidChars"))
      .required(t("fieldRequired")),
    state: yup.string(),
    square_meters: yup.string(),
    message: yup
      .string()
      .required(t("fieldRequired"))
      .matches(MESSAGE_REGEX, "El mensaje contiene caracteres no permitidos.")
      .min(10, t("messageMinLength"))
      .max(500, t("messageMaxLength")),
    recaptcha: yup.string().required(t("fieldRequired")),
    acceptPolicy: yup
      .boolean()
      .required(t("fieldRequired"))
      .isTrue(t("fieldRequired")),
  });

  return (
    <Formik
      initialValues={{
        ...initialFormData,
        firstName: user?.firstName ?? "",
        lastName: user?.lastName ?? "",
        email: user?.email ?? "",
        phone: user?.phone ?? "",
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm }) => {
        const dataParse = {
          first_name: values.firstName,
          last_name: values.lastName,
          email: values.email,
          phone: values.phone,
          company: values.company,
          state: values.state,
          square_meters: values.squareMeters,
          message: values.message,
          recaptchaToken: values.recaptcha,
        };

        postLotesForm(dataParse)
          .then(() => {
            resetForm();
            toast.success("Formulario enviado");
            navigate.push("/");
          })
          .catch(() => {
            toast.error("Error al enviar el formulario");
          });
      }}
      validateOnChange
      validateOnMount
    >
      {({
        getFieldProps,
        errors,
        touched,
        setFieldValue,
        values,
        isValid,
        isSubmitting,
      }) => (
        <Form className="contacto-outer">
          <div ref={titleRef} className="lotes-title-image mb-4">
            <div className="lotes-title-text text-4xl text-white py-16">
              <h4
                className={`!text-white ${homeTitles?.commercialLots_mainTitle?.className ?? ""}`}
              >
                {i18n.language === "en"
                  ? homeTitles?.commercialLots_mainTitle?.value_en
                  : homeTitles?.commercialLots_mainTitle?.value}
              </h4>
              <h6
                className={`mt-4 text-lg lg:text-2xl !text-white ${homeTitles?.commercialLots_subtitle?.className ?? ""}`}
              >
                {i18n.language === "en"
                  ? homeTitles?.commercialLots_subtitle?.value_en
                  : homeTitles?.commercialLots_subtitle?.value}
              </h6>
            </div>
          </div>

          <div className="contacto-form">
            <div className="contacto-row">
              <div className="contacto-input-col font-roboto">
                <Label htmlFor="firstName">{t("names")}</Label>
                <Input
                  {...getFieldProps("firstName")}
                  className={`mt-1 block w-full ${
                    touched.firstName && errors.firstName
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {touched.firstName && errors.firstName && (
                  <div className="text-red-600 text-xs">{errors.firstName}</div>
                )}
              </div>
              <div className="contacto-input-col font-roboto">
                <Label htmlFor="lastName">{t("lastNames")}</Label>
                <Input
                  {...getFieldProps("lastName")}
                  className={`mt-1 block w-full ${
                    touched.lastName && errors.lastName ? "border-red-500" : ""
                  }`}
                />
                {touched.lastName && errors.lastName && (
                  <div className="text-red-600 text-xs">{errors.lastName}</div>
                )}
              </div>
            </div>
            <div className="contacto-row">
              <div className="contacto-input-col font-roboto">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  {...getFieldProps("email")}
                  className={`mt-1 block w-full ${
                    touched.email && errors.email ? "border-red-500" : ""
                  }`}
                />
                {touched.email && errors.email && (
                  <div className="text-red-600 text-xs">{errors.email}</div>
                )}
              </div>
            </div>
            <div className="contacto-row">
              <div className="contacto-input-col font-roboto">
                <Label htmlFor="phone">{t("phone")}</Label>
                <Input
                  {...getFieldProps("phone")}
                  className={`mt-1 block w-full ${
                    touched.phone && errors.phone ? "border-red-500" : ""
                  }`}
                />
                {touched.phone && errors.phone && (
                  <div className="text-red-600 text-xs">{errors.phone}</div>
                )}
              </div>
              <div className="contacto-input-col font-roboto">
                <Label htmlFor="company">{t("company")}</Label>
                <Input
                  {...getFieldProps("company")}
                  className={`mt-1 block w-full ${
                    touched.company && errors.company ? "border-red-500" : ""
                  }`}
                />
                {touched.company && errors.company && (
                  <div className="text-red-600 text-xs">{errors.company}</div>
                )}
              </div>
            </div>
            <div className="contacto-row">
              <div className="contacto-input-col font-roboto">
                <Label htmlFor="state">{t("states")}</Label>
                <Select
                  name="state"
                  onValueChange={(value) => {
                    setFieldValue("state", value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectOption")} />
                  </SelectTrigger>
                  <SelectContent>
                    {dataDesarrollos?.map((state) => (
                      <SelectItem
                        key={state.id}
                        value={state.name.toUpperCase()}
                      >
                        {state.name}
                      </SelectItem>
                    )) ?? []}
                  </SelectContent>
                </Select>
              </div>
              <div className="contacto-input-col font-roboto">
                <Label htmlFor="squareMeters">{t("squareMeters")}</Label>
                <Select
                  name="squareMeters"
                  onValueChange={(value) => {
                    setFieldValue("state", value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectOption")} />
                  </SelectTrigger>
                  <SelectContent>
                    {metrosCuadrados?.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    )) ?? []}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="contacto-row">
              <div className="contacto-input-col font-roboto">
                <Label htmlFor="message">{t("message")}</Label>
                <Textarea
                  placeholder={t("messageExample")}
                  {...getFieldProps("message")}
                  className={`mt-1 block w-full ${
                    touched.message && errors.message ? "border-red-500" : ""
                  }`}
                />

                {touched.message && errors.message && (
                  <div className="text-red-600 text-xs">{errors.message}</div>
                )}
              </div>
            </div>
            <div className="contacto-row cor2">
              <Checkbox
                id="terms"
                checked={values.acceptPolicy}
                onCheckedChange={() => {
                  setFieldValue("acceptPolicy", !values.acceptPolicy);
                }}
              />
              <label htmlFor="terms">
                <Link href="/avisos-de-privacidad" className="underline">
                  {t("acceptPolicies")}
                </Link>
              </label>
            </div>
            <div className="contacto-row">
              <div className="flex flex-col gap-3 justify-between items-start w-full">
                <ReCAPTCHA
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={async (e) => {
                    await setFieldValue("recaptcha", e);
                  }}
                />

                <Button
                  size="lg"
                  type="submit"
                  className="w-full "
                  disabled={!isValid}
                  isLoading={isSubmitting}
                >
                  {t("submit")}
                </Button>
              </div>
            </div>
            <div className="lotes-row-info">
              <p>
                <span>JAVER</span> {t("plotSaleDetails")}
              </p>
              <p>
                {t("callUs")}: (81) 1133.6699 ext. 6871 {t("emailUs")}:
                lotescomerciales@javer.com.mx
                <br />
                {t("contactConsultant")}: (81) 1660.6967
              </p>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
