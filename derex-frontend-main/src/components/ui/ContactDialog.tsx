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
import { type State } from "@/models/state";
import { getEstados, sendContactFormNextLaunches } from "@/utils/api";
import {
    EMAIL_REGEX,
    MESSAGE_REGEX,
    NAME_REGEX,
    PHONE_REGEX,
} from "@/utils/regex";
import { Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import * as yup from "yup";

export function ContactDialog({
  idFutureProject,
  uniqueUrl,
}: {
  idFutureProject: number;
  uniqueUrl: string;
}) {
  const [states, setStates] = useState<State[]>([]);
  const { t } = useTranslation("translations");

  const navigate = useRouter();

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

    gender: yup
      .string()
      .oneOf(["Male", "Female", "other"], "Selecciona una opción válida")
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
    state: yup.string().required(t("fieldRequired")),
    message: yup
      .string()
      .required(t("fieldRequired"))
      .test("sin-caracteres-peligrosos", t("messageInvalidChars"), (value) =>
        value ? !MESSAGE_REGEX.test(value) : true
      )
      .min(10, t("messageMinLength"))
      .max(500, t("messageMaxLength")),
    recaptcha: yup.string().required(t("fieldRequired")),
    acceptPolicy: yup
      .boolean()
      .required(t("fieldRequired"))
      .isTrue(t("fieldRequired")),
  });

  useEffect(() => {
    async function getStates() {
      const state = await getEstados();
      setStates(state);
    }
    getStates();
  }, []);

  return (
    <>
      {/* <h4 className="text-3xl font-display font-bold">{t("knowMoreBoutIt")}</h4> */}

      <hr className="my-6 border-primary max-w-[300px] overflow-scroll" />

      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          gender: "",
          email: "",
          phone: "",
          state: "",
          message: "",
          recaptcha: undefined as string | undefined,
          acceptPolicy: false,
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          await sendContactFormNextLaunches(idFutureProject, {
            first_name: values.firstName,
            last_name: values.lastName,
            email: values.email,
            gender: values.gender,
            state: values.state,
            phone: values.phone,
            message: values.message,
            recaptcha: values.recaptcha ?? "",
          })
            .then(() => {
              resetForm();
              setSubmitting(false);
              navigate.push(`/gracias?${uniqueUrl}`);
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
          setFieldValue,
          values,
          isValid,
          isSubmitting,
          errors,
          touched,
        }) => (
          <Form
            className={`grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-4 w-full`}
          >
            <div>
              <Label htmlFor="firstName">{t("names")}</Label>
              <Input
                {...getFieldProps("firstName")}
                className={`mt-1 block w-full ${
                  touched.firstName && errors.firstName ? "border-red-500" : ""
                }`}
              />
              {errors.firstName && touched.firstName && (
                <p className="text-red-500 text-sm">{errors.firstName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName">{t("lastNames")}</Label>
              <Input
                {...getFieldProps("lastName")}
                className={`mt-1 block w-full ${
                  touched.lastName && errors.lastName ? "border-red-500" : ""
                }`}
              />
              {errors.lastName && touched.lastName && (
                <p className="text-red-500 text-sm">{errors.lastName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="phone">{t("phone")}</Label>
              <Input
                {...getFieldProps("phone")}
                className={`mt-1 block w-full ${
                  touched.phone && errors.phone ? "border-red-500" : ""
                }`}
              />
              {errors.phone && touched.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                {...getFieldProps("email")}
                className={`mt-1 block w-full ${
                  touched.email && errors.email ? "border-red-500" : ""
                }`}
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div className="col-span-1 sm:col-span-2">
              <Label htmlFor="gender">{t("gender")}</Label>
              <Select
                name="gender"
                onValueChange={(value) => {
                  setFieldValue("gender", value);
                }}
              >
                <SelectTrigger
                  className={
                    touched.gender && errors.gender ? "border-red-500" : ""
                  }
                >
                  <SelectValue placeholder={t("selectGender")} />
                </SelectTrigger>

                <SelectContent>
                  {[
                    { value: "Male", name: "Masculino" },
                    { value: "Female", name: "Femenino" },
                    { value: "other", name: "Prefiero no decir" },
                  ].map((gender: any) => (
                    <SelectItem value={gender.value} key={gender.name}>
                      {gender.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {touched.gender && errors.gender && (
                <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
              )}
            </div>

            <div className="col-span-1 sm:col-span-2">
              <Label htmlFor="states">{t("stateOfResidence")}</Label>
              <Select
                name="state"
                onValueChange={(value) => {
                  setFieldValue("state", value);
                }}
              >
                <SelectTrigger
                  className={
                    touched.gender && errors.gender ? "border-red-500" : ""
                  }
                >
                  <SelectValue placeholder={t("selectOption")} />
                </SelectTrigger>

                <SelectContent>
                  {states.map((state: State) => (
                    <SelectItem value={state.name} key={state.name}>
                      {state.name}
                    </SelectItem>
                  ))}
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
                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
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
    </>
  );
}
