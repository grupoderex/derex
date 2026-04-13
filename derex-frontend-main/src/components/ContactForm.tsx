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
import { BACKEND_URL, RECAPTCHA_SITE_KEY } from "@/constants";
import { Project } from "@/models/project";
import {
    EMAIL_REGEX,
    MESSAGE_REGEX,
    NAME_REGEX,
    PHONE_REGEX,
} from "@/utils/regex";
import { subYears } from "date-fns";
import { enUS, es } from "date-fns/locale";
import { Form, Formik } from "formik";
import { i18n } from "i18next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";
import * as yup from "yup";

interface ContactFormProps {
  className?: string;
  projects: Project[];
  translation: {
    t: any;
    i18n: i18n;
  };
}

export const ContactForm = ({
  className,
  projects,
  translation,
}: ContactFormProps) => {
  const { t, i18n } = translation;
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
      .matches(EMAIL_REGEX, "Correo inválido"),
    phone: yup
      .string()
      .max(10, t("invalidPhone"))
      .matches(PHONE_REGEX, t("invalidPhone"))
      .required(t("fieldRequired")),
    birthDate: yup.date().required(t("fieldRequired")),
    development: yup.string().required(t("fieldRequired")),
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

  const inputBase =
    "mt-1 w-full bg-[color:var(--lightest-grey)] text-[color:var(--main-black)] " +
    "border-0 focus-visible:ring-0 focus-visible:ring-offset-0";

  const errorText = "mt-1 text-xs text-red-600";

  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        birthDate: subYears(new Date(), 16),
        development: undefined as string | undefined,
        typeOfCredit: undefined as string | undefined,
        message: "",
        recaptcha: undefined as string | undefined,
        acceptPolicy: false,
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm }) => {
        await fetch(`${BACKEND_URL}/contact/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recaptcha: values.recaptcha,
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            birthDate: values.birthDate,
            phone: values.phone,
            development: values.development,
            typeOfCredit: values.typeOfCredit,
            message: values.message,
          }),
        })
          .then(() => {
            resetForm();

            if (typeof window !== "undefined" && (window as any).dataLayer) {
              const pathWithParams =
                window.location.pathname + window.location.search;
              (window as any).dataLayer.push({
                event: "envio-form-javer",
                page_path: pathWithParams,
                gclid: getGclidFromUrl(),
              });
            }

            const searchParams = new URLSearchParams(
              location.search
            ).toString();
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
          className={[
            // Layout general (equivale al “form” del CSS)
            "w-full",
            "grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-4",
            "text-[color:var(--main-grey)]",
            // animación tipo .contacto-form (opcional)
            "opacity-0 animate-[cform-in_0.5s_ease_0.5s_forwards]",
            className ?? "",
          ].join(" ")}
        >
          {/* FIRST / LAST */}
          <div>
            <Label className="uppercase" htmlFor="firstName">
              {t("names")}
            </Label>
            <Input
              {...getFieldProps("firstName")}
              className={[
                inputBase,
                touched.firstName && errors.firstName
                  ? "ring-1 ring-red-500"
                  : "",
              ].join(" ")}
            />
            {touched.firstName && errors.firstName && (
              <div className={errorText}>{errors.firstName as any}</div>
            )}
          </div>

          <div>
            <Label className="uppercase" htmlFor="lastName">
              {t("lastNames")}
            </Label>
            <Input
              {...getFieldProps("lastName")}
              className={[
                inputBase,
                touched.lastName && errors.lastName
                  ? "ring-1 ring-red-500"
                  : "",
              ].join(" ")}
            />
            {touched.lastName && errors.lastName && (
              <div className={errorText}>{errors.lastName as any}</div>
            )}
          </div>

          {/* EMAIL */}
          <div className="col-span-1 sm:col-span-2">
            <Label className="uppercase" htmlFor="email">
              {t("email")}
            </Label>
            <Input
              {...getFieldProps("email")}
              className={[
                inputBase,
                touched.email && errors.email ? "ring-1 ring-red-500" : "",
              ].join(" ")}
            />
            {touched.email && errors.email && (
              <div className={errorText}>{errors.email as any}</div>
            )}
          </div>

          {/* DOB */}
          <div>
            <Label className="uppercase" htmlFor="birthDate">
              {t("dob")}
            </Label>
            <div className="mt-1">
              <SingleDatePicker
                locale={i18n.language === "es" ? es : enUS}
                fromYear={new Date().getFullYear() - 100}
                toYear={new Date().getFullYear() - 16}
                selected={values.birthDate}
                onSelect={async (date) =>
                  await setFieldValue("birthDate", date)
                }
              />
            </div>
            {touched.birthDate && errors.birthDate && (
              <div className={errorText}>{errors.birthDate as any}</div>
            )}
          </div>

          {/* PHONE */}
          <div>
            <Label className="uppercase" htmlFor="phone">
              {t("phone")}
            </Label>
            <Input
              {...getFieldProps("phone")}
              className={[
                inputBase,
                touched.phone && errors.phone ? "ring-1 ring-red-500" : "",
              ].join(" ")}
            />
            {touched.phone && errors.phone && (
              <div className={errorText}>{errors.phone as any}</div>
            )}
          </div>

          {/* DEVELOPMENT */}
          <div>
            <Label className="uppercase" htmlFor="development">
              {t("fractioning")}
            </Label>
            <Select
              name="development"
              onValueChange={(value) => setFieldValue("development", value)}
            >
              <SelectTrigger
                id="development"
                className="mt-1 bg-[color:var(--lightest-grey)] border-0 focus:ring-0"
              >
                <SelectValue placeholder={t("selectOption")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-">--Ninguno--</SelectItem>
                {projects?.map((project) => (
                  <SelectItem
                    key={project.id}
                    value={project.short_name?.toUpperCase() ?? project.name}
                  >
                    {project.short_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {touched.development && errors.development && (
              <div className={errorText}>{errors.development as any}</div>
            )}
          </div>

          {/* CREDIT TYPE */}
          <div>
            <Label className="uppercase" htmlFor="typeOfCredit">
              {t("creditType")}
            </Label>
            <Select
              name="typeOfCredit"
              onValueChange={(value) => setFieldValue("typeOfCredit", value)}
            >
              <SelectTrigger className="mt-1 bg-[color:var(--lightest-grey)] border-0 focus:ring-0">
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
            {touched.typeOfCredit && errors.typeOfCredit && (
              <div className={errorText}>{errors.typeOfCredit as any}</div>
            )}
          </div>

          {/* MESSAGE */}
          <div className="col-span-1 sm:col-span-2">
            <Label className="uppercase" htmlFor="message">
              {t("message")}
            </Label>
            <Textarea
              placeholder={t("messageExample")}
              {...getFieldProps("message")}
              className={[
                "mt-1 w-full min-h-40 resize-none",
                "bg-[color:var(--lightest-grey)] text-[color:var(--main-black)]",
                "border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                touched.message && errors.message ? "ring-1 ring-red-500" : "",
              ].join(" ")}
            />
            {touched.message && errors.message && (
              <div className={errorText}>{errors.message as any}</div>
            )}
          </div>

          {/* POLICY */}
          <div className="col-span-1 sm:col-span-2 flex items-center gap-2 py-2">
            <Checkbox
              id="terms"
              checked={values.acceptPolicy}
              onCheckedChange={() =>
                setFieldValue("acceptPolicy", !values.acceptPolicy)
              }
            />
            <label htmlFor="terms" className="text-sm">
              <Link
                href="/avisos-de-privacidad"
                className="underline font-semibold"
              >
                {t("acceptPolicies")}
              </Link>
            </label>
            {touched.acceptPolicy && errors.acceptPolicy && (
              <div className={errorText}>{errors.acceptPolicy as any}</div>
            )}
          </div>

          {/* CAPTCHA */}
          <div className="col-span-1 sm:col-span-2">
            <ReCAPTCHA
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={async (e) => await setFieldValue("recaptcha", e)}
            />
            {touched.recaptcha && errors.recaptcha && (
              <div className={errorText}>{errors.recaptcha as any}</div>
            )}
          </div>

          {/* SUBMIT */}
          <div className="col-span-1 sm:col-span-2">
            <Button
              size="lg"
              type="submit"
              className="w-full bg-[color:var(--main-red)] text-white hover:opacity-90"
              disabled={!isValid}
              isLoading={isSubmitting}
            >
              {t("submit")}
            </Button>
          </div>

          {/* Animación (sin CSS file) */}
          <style jsx global>{`
            @keyframes cform-in {
              0% {
                opacity: 0;
              }
              100% {
                opacity: 1;
              }
            }
          `}</style>
        </Form>
      )}
    </Formik>
  );
};
