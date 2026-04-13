import { getUrgencyByPropertyId } from "@/utils/api";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import * as Toast from "@radix-ui/react-toast";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";

export function SnackbarUrgency({ idProperty }: { idProperty: number }) {
  const [urgencyChip, setUrgencyChip] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const hasBeenClosed = useRef(false);

  const { i18n } = useTranslation("translations");

  useEffect(() => {
    async function getUrgecyChip() {
      const chipData = await getUrgencyByPropertyId(idProperty);
      setUrgencyChip(chipData);
    }
    getUrgecyChip();
  }, [idProperty]);

  useEffect(() => {
    if (!open) {
      const handleScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        if (scrollTop > 500 && !open && !hasBeenClosed.current) {
          setOpen(true);
        }
      };

      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  function handlingClose() {
    setOpen(false);
    hasBeenClosed.current = true;
  }

  return (
    <>
      {urgencyChip && (
        <Toast.Provider swipeDirection="down">
          <Toast.Root
            open={open}
            onOpenChange={setOpen}
            className={clsx(
              "bg-red-100 border border-red-500  rounded-md shadow-lg p-4 relative",
              "data-[state=open]:animation-toast-in",
              "data-[state=closed]:animation-toast-out"
            )}
          >
            <button
              className="rounded-full  bg-red-500 absolute -top-[20px] -right-[10px] z-10 flex flex-col items-center justify-center w-8 h-8"
              onClick={() => {
                handlingClose();
              }}
            >
              <Icon icon="ion:md-close" width="24" className="text-white" />
            </button>

            <Toast.Description className="text-sm mt-1 text-red-500 text-center">
              {i18n.language === "es"
                ? urgencyChip?.notification_text_es
                : urgencyChip?.notification_text_en}
            </Toast.Description>
          </Toast.Root>

          <Toast.Viewport className="fixed bottom-4 left-1/2 transform -translate-x-1/2  z-50 w-2/4  lg:w-[912px]" />
        </Toast.Provider>
      )}
    </>
  );
}
