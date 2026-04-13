"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";

export default function Page() {
  const { t } = useTranslation("translations");
  const navigate = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prevSeconds) => {
        if (prevSeconds === 0) {
          clearInterval(interval);
          navigate.push("/blog");
        }
        return prevSeconds - 1;
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="container h-screen flex flex-col items-center justify-center gap-8 p-16 text-center pb-32">
      <h3 className="text-3xl lg:text-5xl font-bold">
        {t("newsletterSuccessTitle")}
      </h3>
      <p className="max-w-3xl">{t("newsletterSuccessSubtitle")}</p>
      <Button
        onClick={() => {
          navigate.push("/blog");
        }}
      >
        {t("newsletterSuccessButton")}
      </Button>

      <div className="mt-16 text-center bg-neutral-100 rounded-md px-4 py-2 flex gap-2 items-center border-[1px] border-solid border-neutral-200">
        <Icon icon="heroicons-solid:clock" width="20" />
        {t("newsletterSuccessRedirect", {
          seconds: secondsLeft.toString().padStart(2, "0"),
        })}
      </div>
    </div>
  );
}
