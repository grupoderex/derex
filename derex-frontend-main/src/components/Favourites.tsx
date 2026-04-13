"use client";
import PropTypes from "prop-types";

import { useState } from "react";
import Link from "next/link";
import { toUrlCase } from "../utils/common.utils";
import Image from "next/image";
import { Icon } from "@iconify/react";

// --- NUEVA ARQUITECTURA ---
import { useAuthStore } from "@/stores/useAuthStore";
import { useFavorites, useToggleFavorite } from "@/hooks/useAppQueries";

function FavoriteItem({
  name,
  city,
  state,
  img,
  status,
  id,
  short_name,
}: {
  name: string;
  city: string;
  state: string;
  img: string;
  status: string;
  id: number;
  short_name: string;
}) {
  const { mutate: toggleFavorite, isPending } = useToggleFavorite();

  const [isClickable, setIsClickable] = useState(true);

  const handleRemoveFavorite = () => {
    if (!isClickable || isPending) return;

    setIsClickable(false);

    toggleFavorite(id, {
      onSettled: () => setIsClickable(true), // Reactivamos si falla o termina
    });
  };

  return (
    <div
      className={`flex flex-col justify-center items-center min-w-[260px] mx-8 mt-4 pb-8 border-b border-neutral-200 shrink-0 grow-0 transition-all duration-1000 ease-in-out ${
        !isClickable || isPending
          ? "opacity-0 pointer-events-none"
          : "opacity-100"
      }`}
    >
      <Link
        href={
          "/desarrollos/" +
          toUrlCase(short_name) +
          "/propiedad/" +
          toUrlCase(name)
        }
        className="w-full flex flex-col items-center"
      >
        <div className="w-64 max-h-32 overflow-hidden flex justify-center items-center rounded transition-all duration-1000 h-auto">
          <Image
            src={img}
            alt={`Property ${name}`}
            width={256}
            height={128}
            className="w-full h-auto object-cover"
          />
        </div>

        <div className="flex items-center justify-center self-stretch">
          <div className="self-stretch my-4 grow">
            <h2 className="font-display text-lg font-normal m-0 mr-4 text-neutral-800">
              {name}
            </h2>
            <p className="m-0 text-[0.95rem] font-normal text-neutral-500">
              {`${city}, ${state}`}
            </p>
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-start self-stretch gap-4">
        <div className="bg-neutral-400 text-white rounded px-4 py-2 text-xs font-bold mr-4">
          {status ? "Disponible" : "Próximamente"}
        </div>

        <button
          disabled={!isClickable || isPending}
          onClick={handleRemoveFavorite}
          className="border-none bg-transparent cursor-pointer p-0 hover:scale-110 transition-transform"
          aria-label={`Eliminar ${name} de favoritos`}
        >
          <Icon
            icon="fa-solid:heart"
            className={`w-5 h-5 transition-colors duration-250 ${
              isClickable && !isPending ? "text-red-600" : "text-neutral-400"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

FavoriteItem.propTypes = {
  name: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
};

function Favorites({ onClose }: { onClose: () => void }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { data, isError, isLoading } = useFavorites();

  const favoritesList = data?.favorites || [];

  return (
    <div className="absolute top-12 right-6 bg-white max-h-[calc(100vh-4rem)] rounded-md shadow-[0px_3px_6px_0px_rgba(0,0,0,0.25)] text-neutral-600 text-xs font-bold flex flex-col overflow-hidden z-[99999] w-[320px]">
      <div className="flex w-full min-h-[40px]">
        <div className="grow pt-2.5 flex justify-center items-center pl-10 font-bold text-sm tracking-wide">
          FAVORITOS
        </div>

        <div
          className="w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-neutral-100 transition-colors"
          onClick={onClose}
          role="button"
          aria-label="Cerrar"
        >
          <Icon
            icon="heroicons:x-mark"
            width="24"
            className="text-neutral-400"
          />
        </div>
      </div>

      <div className="grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
        {!isAuthenticated ? (
          <p className="w-[260px] py-8 px-4 mx-auto text-base text-center font-normal">
            Inicie sesión para ver sus favoritos
          </p>
        ) : isLoading ? (
          <div className="flex justify-center p-8">
            <Icon
              icon="eos-icons:loading"
              width="32"
              className="text-primary"
            />
          </div>
        ) : isError ? (
          <p className="w-[260px] py-8 px-4 mx-auto text-base text-center text-red-500 font-normal">
            Error al obtener favoritos. Intente nuevamente.
          </p>
        ) : favoritesList.length === 0 ? (
          <p className="w-[260px] py-8 px-4 mx-auto text-base text-center font-normal">
            Su lista de favoritos está vacía
          </p>
        ) : (
          favoritesList.map((data) => (
            <FavoriteItem
              key={`id-fav-${data.id}`}
              name={data.name}
              city={data.city_name}
              state={data.state_name}
              status={data.delivery_status}
              img={data.main_image}
              id={data.id}
              short_name={data.project_short_name}
            />
          ))
        )}
      </div>
    </div>
  );
}

Favorites.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default Favorites;
