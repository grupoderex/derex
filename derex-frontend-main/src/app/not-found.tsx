"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center text-center p-8">
      <p className="text-[64px] font-roboto font-extrabold leading-normal text-black">
        ¡Lo siento!
      </p>
      <p className="text-2xl font-roboto font-extrabold leading-normal text-black">
        Creo que hemos perdido señal
      </p>
      <Image
        className="w-[80vw] max-w-[600px] h-auto my-20 mx-auto"
        src="/images/error/400.png"
        alt="http 500 error"
        width={1000}
        height={1000}
      />
      <Link
        href="/"
        className="cursor-pointer border-b-2 border-[var(--main-black)] mx-auto flex justify-center items-center py-[0.15rem] px-2"
      >
        <Icon icon="ri:arrow-go-back-line" width="24" height="24" />
        <p className="text-2xl font-roboto font-normal capitalize text-black">
          Regresar
        </p>
      </Link>
    </div>
  );
}
