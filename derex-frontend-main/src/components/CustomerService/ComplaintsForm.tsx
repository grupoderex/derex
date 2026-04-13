import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { postCustomerServiceReport } from "@/utils/api";
import { EMAIL_REGEX, NAME_REGEX, PHONE_REGEX } from "@/utils/regex";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import * as yup from "yup";

export const ComplaintsForm = () => {
  const { t } = useTranslation("translations");

  const validationSchema = yup.object().shape({
    first_name: yup
      .string()
      .max(100, "Máximo 100 caracteres")
      .matches(
        NAME_REGEX,
        "El nombre solo puede contener letras y el carácter Ñ"
      )
      .required("Este campo es requerido"),
    last_name: yup
      .string()
      .max(100, "Máximo 100 caracteres")
      .matches(
        NAME_REGEX,
        "El nombre solo puede contener letras y el carácter Ñ"
      )
      .required("Este campo es requerido"),
    email: yup
      .string()
      .email("Correo inválido")
      .required("Este campo es requerido")
      .matches(EMAIL_REGEX, "Correo inválido"),
    phone: yup
      .string()
      .max(10, "Máximo 10 caracteres")
      .matches(PHONE_REGEX, "Teléfono inválido, debe tener 10 dígitos")
      .required("Este campo es requerido"),
    acquired_subdivision: yup.string().required("Campo requerido"),
    street_address: yup.string().required("Campo requerido"),
    block: yup.string().required("Campo requerido"),
    lot: yup.string().required("Campo requerido"),
    subject: yup.string().required("Campo requerido"),
    message: yup
      .string()
      .min(200, "Mensaje muy corto")
      .required("Campo requerido"),
    accept: yup
      .boolean()
      .oneOf([true], "Debes aceptar las políticas de privacidad"),
  });

  const {
    getFieldProps,
    errors,
    touched,
    handleSubmit,
    isValid,
    values,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      acquired_subdivision: "",
      street_address: "",
      block: "",
      lot: "",
      subject: "",
      message: "",
      accept: false,
    },
    validationSchema,
    onSubmit: (values) => {
      const { accept, ...rest } = values;
      mutate(rest);
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: postCustomerServiceReport,
    onSuccess: () => {
      toast.success("Reporte enviado correctamente");
      resetForm();
    },
    onError: () => {
      toast.error("Ocurrió un error al enviar el reporte");
    },
  });

  return (
    <div className="container max-w-4xl my-16">
      <h4 className="text-primary self-start">{t("makeReport")}</h4>
      <p>{t("makeReportDescription")}</p>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 md:mx-16"
        onSubmit={handleSubmit}
      >
        <div>
          <Label>{t("names")}</Label>
          <Input
            {...getFieldProps("first_name")}
            className={`mt-1 block w-full ${
              touched.first_name && errors.first_name ? "border-red-500" : ""
            }`}
          />
          {touched.first_name && errors.first_name && (
            <div className="text-red-600 text-xs">{errors.first_name}</div>
          )}
        </div>
        <div>
          <Label>{t("lastNames")}</Label>
          <Input
            {...getFieldProps("last_name")}
            className={`mt-1 block w-full ${
              touched.last_name && errors.last_name ? "border-red-500" : ""
            }`}
          />
          {touched.last_name && errors.last_name && (
            <div className="text-red-600 text-xs">{errors.last_name}</div>
          )}
        </div>
        <div>
          <Label>{t("email")}</Label>
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
        <div>
          <Label>{t("phone")}</Label>
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
        <div>
          <Label>{t("fractioning")}</Label>
          {/* <Input
            {...getFieldProps("acquired_subdivision")}
            error={errors.acquired_subdivision}
          /> */}

          <Input
            {...getFieldProps("acquired_subdivision")}
            className={`mt-1 block w-full ${
              touched.acquired_subdivision && errors.acquired_subdivision
                ? "border-red-500"
                : ""
            }`}
          />
          {touched.acquired_subdivision && errors.acquired_subdivision && (
            <div className="text-red-600 text-xs">
              {errors.acquired_subdivision}
            </div>
          )}
        </div>
        <div>
          <Label>{t("streetAndNumber")}</Label>
          {/* <Input
            {...getFieldProps("street_address")}
            error={errors.street_address}
          /> */}

          <Input
            {...getFieldProps("street_address")}
            className={`mt-1 block w-full ${
              touched.street_address && errors.street_address
                ? "border-red-500"
                : ""
            }`}
          />
          {touched.street_address && errors.street_address && (
            <div className="text-red-600 text-xs">{errors.street_address}</div>
          )}
        </div>
        <div>
          <Label>{t("block")}</Label>

          <Input
            {...getFieldProps("block")}
            className={`mt-1 block w-full ${
              touched.block && errors.block ? "border-red-500" : ""
            }`}
          />
          {touched.block && errors.block && (
            <div className="text-red-600 text-xs">{errors.block}</div>
          )}
        </div>
        <div>
          <Label>{t("lot")}</Label>
          <Input
            {...getFieldProps("lot")}
            className={`mt-1 block w-full ${
              touched.lot && errors.lot ? "border-red-500" : ""
            }`}
          />
          {touched.lot && errors.lot && (
            <div className="text-red-600 text-xs">{errors.lot}</div>
          )}
        </div>
        <div className="md:col-span-2">
          <Label>{t("subject")}</Label>
          <Input
            {...getFieldProps("subject")}
            className={`mt-1 block w-full ${
              touched.subject && errors.subject ? "border-red-500" : ""
            }`}
          />
          {touched.subject && errors.subject && (
            <div className="text-red-600 text-xs">{errors.subject}</div>
          )}
        </div>
        <div className="md:col-span-2">
          <Label>{t("message")}</Label>
          <Textarea rows={10} minLength={200} {...getFieldProps("message")} />
          <p className={`text-sm ${errors.message ? "text-red-500" : ""}`}>
            {errors.message
              ? errors.message
              : `${values.message.length} caracteres`}
          </p>
        </div>

        <div className="flex justify-between mt-5 items-center w-full md:col-span-2">
          <div className="flex gap-2 justify-center items-center">
            <Checkbox
              checked={values.accept}
              onCheckedChange={(e) => {
                setFieldValue("accept", e);
              }}
            />
            <p>
              {t("accept")}{" "}
              <a
                href="/avisos-de-privacidad"
                className="text-primary"
                target="_blank"
                rel="noreferrer"
              >
                {t("privacyNotices")}
              </a>
            </p>
          </div>
        </div>

        <div className="flex w-full md:col-span-2">
          <Button
            className="w-full"
            type="submit"
            disabled={!isValid}
            isLoading={isPending}
          >
            {t("submit")}
          </Button>
        </div>
      </form>
    </div>
  );
};
