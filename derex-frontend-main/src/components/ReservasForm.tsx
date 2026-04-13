import { Label } from "@/components/shared/Label";
import { Button } from "@/components/ui/button";
import { RECAPTCHA_SITE_KEY } from "@/constants";
import { postTerritorialReservationsForm } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { TFunction } from "i18next";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface ReservationFormData {
  Nombre: string;
  Apellido: string;
  Correo: string;
  Telefono: string;
  Estado: string;
  MetrosCuadrados: string;
  CodigoPostal: string;
  Hectareas: string;
  PrecioPorMetroCuadrado: string;
  Descripcion: string;
  accept?: boolean;
  InfoTerreno: string;
  recaptchaToken: string;
}

export const ReservasForm = ({ t }: { t: TFunction<"translations"> }) => {
  const { register, handleSubmit, reset, setValue, watch } =
    useForm<ReservationFormData>();

  const isAccepted = watch("accept", false);

  const { mutate, isPending } = useMutation({
    mutationKey: ["sendReservation"],
    mutationFn: postTerritorialReservationsForm,
    onSuccess: () => {
      toast.success("Reporte enviado correctamente");
      reset();
    },
    onError: () => {
      toast.error("Ocurrió un error al enviar el reporte");
    },
  });

  return (
    <form
      className="md:w-[800px] mt-5 flex gap-1 justify-center items-center flex-col"
      onSubmit={handleSubmit((data) => {
        const formData = {
          ...data,
          accept: undefined,
        };
        delete formData.accept;
        mutate(formData);
      })}
    >
      <div className="flex mb-1 w-full">
        <Label className="font-bold">{t("personalData")}</Label>
      </div>

      <div className="flex flex-wrap md:flex-nowrap gap-2 w-full">
        <div className="flex flex-col w-full md:w-1/2">
          <Label>{t("names")}</Label>
          <input
            className="border-gray-100 bg-gray-100 rounded-md px-4 py-2"
            {...register("Nombre")}
          />
        </div>
        <div className="flex flex-col w-full md:w-1/2">
          <Label>{t("lastNames")}</Label>
          <input
            className="border-gray-100 bg-gray-100 rounded-md px-4 py-2"
            {...register("Apellido")}
          />
        </div>
      </div>

      <div className="flex flex-wrap md:flex-nowrap gap-2 w-full">
        <div className="flex flex-col w-full md:w-1/2">
          <Label>{t("email")}</Label>
          <input
            type="email"
            className="border-gray-100 bg-gray-100 rounded-md px-4 py-2"
            {...register("Correo")}
          />
        </div>
        <div className="flex flex-col w-full md:w-1/2">
          <Label>{t("phone")}</Label>
          <input
            type="tel"
            className="border-gray-100 bg-gray-100 rounded-md px-4 py-2"
            {...register("Telefono")}
          />
        </div>
      </div>

      <div className="flex mt-6 mb-1 w-full">
        <Label className="font-bold">{t("landData")}</Label>
      </div>

      <div className="flex flex-wrap md:flex-nowrap gap-2 w-full">
        <div className="flex flex-col w-full md:w-1/2">
          <Label>{t("state")}</Label>
          <input
            className="border-gray-100 bg-gray-100 rounded-md px-4 py-2"
            {...register("Estado")}
          />
        </div>
        <div className="flex flex-col w-full md:w-1/2">
          <Label>{t("squareMeters")}</Label>
          <input
            type="number"
            className="border-gray-100 bg-gray-100 rounded-md px-4 py-2"
            {...register("MetrosCuadrados")}
          />
        </div>
      </div>

      <div className="flex flex-wrap md:flex-nowrap gap-2 w-full mt-2">
        <div className="flex flex-col w-full md:w-1/3">
          <Label>{t("postalCode")}</Label>
          <input
            type="text"
            className="border-gray-100 bg-gray-100 rounded-md px-4 py-2"
            {...register("CodigoPostal")}
          />
        </div>
        <div className="flex flex-col w-full md:w-1/3">
          <Label>{t("hectare")}</Label>
          <input
            type="number"
            className="border-gray-100 bg-gray-100 rounded-md px-4 py-2"
            {...register("Hectareas")}
          />
        </div>
        <div className="flex flex-col w-full md:w-1/3">
          <Label>{t("squareMeterPriceLabel")}</Label>
          <input
            type="number"
            className="border-gray-100 bg-gray-100 rounded-md px-4 py-2"
            {...register("PrecioPorMetroCuadrado")}
          />
        </div>
      </div>

      <div className="flex flex-col w-full mt-2">
        <Label>{t("description")}</Label>
        <textarea
          rows={10}
          minLength={200}
          className="border-gray-100 bg-gray-100 rounded-md px-4 py-2"
          {...register("Descripcion")}
        />
      </div>

      <div className="flex justify-between mt-5 items-center w-full">
        <div className="flex gap-2 justify-center items-center">
          <input
            type="checkbox"
            className="border-gray-100 bg-gray-100 rounded-md px-4 py-2"
            {...register("accept")}
          />
          <Label className="!mb-0">{t("acceptPolicies")}</Label>
        </div>
        <Link
          className="underline text-neutral-400 text-sm"
          href="/avisos-de-privacidad"
          target="_blank"
          rel="noreferrer"
        >
          {t("checkPrivacyNotices")}
        </Link>
      </div>

      <div className="flex w-full mt-4">
        <ReCAPTCHA
          sitekey={RECAPTCHA_SITE_KEY}
          onChange={(token) => {
            setValue("recaptchaToken", token ?? "", {
              shouldDirty: true,
              shouldTouch: true,
              shouldValidate: true,
            });
          }}
        />
      </div>

      <div className="w-full mt-2">
        <Button
          type="submit"
          className="w-full"
          isLoading={isPending}
          disabled={!isAccepted || !watch("recaptchaToken")}
        >
          {t("submit")}
        </Button>
      </div>
    </form>
  );
};
