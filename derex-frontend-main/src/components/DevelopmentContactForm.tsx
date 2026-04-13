import { SingleDatePicker } from "@/components/DatePicker";
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
import { enUS, es } from "date-fns/locale";
import { Form, Formik } from "formik";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import * as yup from "yup";

import { BACKEND_URL, RECAPTCHA_SITE_KEY } from "@/constants";
import { type Project } from "@/models/project";
import {
    EMAIL_REGEX,
    MESSAGE_REGEX,
    NAME_REGEX,
    PHONE_REGEX,
} from "@/utils/regex";

interface DevelopmentContactFormProps {
  className?: string;
  development?: Project;
}

export const DevelopmentContactForm = ({
  className,
  development,
}: DevelopmentContactFormProps) => {
  const { t, i18n } = useTranslation("translations");

  const location = useSearchParams();
  const navigate = useRouter();

  const getGclidFromUrl = (): string | null => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("gclid");
  };

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
    birthDate: yup.date().required(t("fieldRequired")),
    typeOfCredit: yup.string().required(t("fieldRequired")),
    message: yup
      .string()
      .required(t("fieldRequired"))
      .matches(MESSAGE_REGEX, t("messageInvalidChars"))
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
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        birthDate: null,
        typeOfCredit: undefined as string | undefined,
        message: "",
        development: undefined as string | undefined,
        recaptcha: undefined as string | undefined,
        acceptPolicy: false,
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm, setSubmitting }) => {
        const dateString = values.birthDate
          ? new Date(values.birthDate).toISOString().split("T")[0]
          : null;

        await fetch(`${BACKEND_URL}/contact/project/submit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recaptcha: values.recaptcha,
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            birthDate: dateString,
            phone: values.phone,
            typeOfCredit: values.typeOfCredit,
            message: values.message,
            development: development?.short_name?.toUpperCase() ?? development?.name ?? "",
          }),
        })
          .then(() => {
            resetForm();
            setSubmitting(false);

            // Track the form submission
            if (typeof window !== "undefined" && window.dataLayer) {
              const pathWithParams =
                window.location.pathname + window.location.search;
              window.dataLayer.push({
                event: "envio-form-javer",
                page_path: pathWithParams,
                gclid: getGclidFromUrl(),
              });
            }

            const searchParams = location != null ? location.toString() : "";
            navigate.push(
              `/gracias${searchParams.length > 0 ? `?${searchParams}` : ""}`
            );
          })
          .catch(() => {
            toast.error("Error en el envío de la información");
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
        <Form
          className={`grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-4 w-full ${className}`}
        >
          <div>
            <Label htmlFor="firstName">{t("names")}</Label>
            <Input
              id="firstName"
              {...getFieldProps("firstName")}
              className={`mt-1 block w-full ${
                touched.firstName && errors.firstName ? "border-red-500" : ""
              }`}
            />
            {touched.firstName && errors.firstName && (
              <div className="text-red-600 text-xs">{errors.firstName}</div>
            )}
          </div>
          <div>
            <Label htmlFor="lastName">{t("lastNames")}</Label>
            <Input
              id="lastName"
              {...getFieldProps("lastName")}
              className={`mt-1 block w-full ${
                touched.lastName && errors.lastName ? "border-red-500" : ""
              }`}
            />
            {touched.lastName && errors.lastName && (
              <div className="text-red-600 text-xs">{errors.lastName}</div>
            )}
          </div>
          <div>
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              {...getFieldProps("email")}
              className={`mt-1 block w-full ${
                touched.email && errors.email ? "border-red-500" : ""
              }`}
            />
            {touched.email && errors.email && (
              <div className="text-red-600 text-xs">{errors.email}</div>
            )}
          </div>
          <div>
            <Label htmlFor="birthDate">{t("dob")}</Label>
            <SingleDatePicker
              locale={i18n.language === "es" ? es : enUS}
              fromYear={new Date().getFullYear() - 100}
              toYear={new Date().getFullYear() - 16}
              selected={values.birthDate ?? undefined}
              onSelect={async (date) => await setFieldValue("birthDate", date)}
            />
          </div>
          <div>
            <Label htmlFor="phone">{t("phone")}</Label>
            <Input
              id="phone"
              {...getFieldProps("phone")}
              className={`mt-1 block w-full ${
                touched.phone && errors.phone ? "border-red-500" : ""
              }`}
            />
            {touched.phone && errors.phone && (
              <div className="text-red-600 text-xs">{errors.phone}</div>
            )}
          </div>
          <div>
            <Label htmlFor="typeOfCredit">{t("creditType")}</Label>
            <Select
              name="typeOfCredit"
              onValueChange={(value) => {
                setFieldValue("typeOfCredit", value);
              }}
            >
              <SelectTrigger id="typeOfCredit" aria-label={t("creditType")}>
                <SelectValue placeholder={t("selectOption")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-">--Ninguno--</SelectItem>
                <SelectItem value="INFONAVIT">INFONAVIT</SelectItem>
                <SelectItem value="ISSSTELEON">ISSSTELEON</SelectItem>
                <SelectItem value="SHF/BANCO">SHF/BANCO</SelectItem>
                <SelectItem value="BANCO - SOFOL">BANCO - SOFOL</SelectItem>
                <SelectItem value="COFINAVIT">COFINAVIT</SelectItem>
                <SelectItem value="CONTADO">CONTADO</SelectItem>
                <SelectItem value="FOVISSSTE">FOVISSSTE</SelectItem>
                <SelectItem value="OTROS / NO SE">OTROS / NO SE</SelectItem>
                <SelectItem value="BANJERCITO">BANJERCITO</SelectItem>
                <SelectItem value="ISSFAM">ISSFAM</SelectItem>
                <SelectItem value="PENSIONES">PENSIONES</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-1 sm:col-span-2">
            <Label htmlFor="message">{t("message")}</Label>
            <Textarea
              id="message"
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
          <div className="col-span-1 sm:col-span-2 flex items-center gap-2">
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
          <div className="col-span-1 sm:col-span-2">
            <ReCAPTCHA
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={async (e) => {
                await setFieldValue("recaptcha", e);
              }}
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <Button
              size="lg"
              type="submit"
              className="w-full"
              disabled={!isValid}
              isLoading={isSubmitting}
            >
              {t("submit")}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
