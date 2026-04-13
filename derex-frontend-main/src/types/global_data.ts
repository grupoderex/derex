import { type Dispatch, type SetStateAction } from "react";
import { type LatLng } from "./lat_lon";
import { type Favorite } from "../models/user_all_favorites";
import { type FooterType, type Navbar } from "../models/section";
import { type LocationHierarchy } from "../models/location_hierarchy";

export interface GlobalData {
  dataAuth: {
    firstName?: string;
    lastName?: string;
    token?: string;
    email?: string;
    phone?: string;
  };
  setDataAuth: Dispatch<
    SetStateAction<{
      firstName?: string;
      lastName?: string;
      token?: string;
      email?: string;
      phone?: string;
    }>
  >;
  loginUser: (
    email: string,
    password: string
  ) => Promise<
    | {
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        token: string;
      }
    | {
        error: string;
      }
  >;

  registerUser: (
    firstName: string,
    lastName: string,
    password: string,
    primaryEmail: string,
    primaryPhone: string
  ) => Promise<
    | {
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        token: string;
      }
    | {
        error: string;
      }
  >;
  logoutUser: () => Promise<void>;
  setFavoriteProperty: (propertyId: number) => Promise<void>;
  favoritesData: {
    list: Favorite[];
    error?: string;
  };
  dataDesarrollos: LocationHierarchy[];
  websiteMedia: {
    home_video: string;
    lotes_image: string;
    reservas_image: string;
    nosotros_1_image: string;
    nosotros_2_image: string;
    nosotros_3_image: string;
    certs_image: string;
    decalogos_image: string;
    blog_image: string;
    lotes_alt: string;
    reservas_alt: string;
  };
  openLogin: boolean;
  setOpenLogin: Dispatch<SetStateAction<boolean>>;
  lonLat: LatLng | null;
  setLonLat: Dispatch<SetStateAction<LatLng | null>>;
  getDistance: (lat2: number, lon2: number) => number | null;
  requestGeoPosition: () => void;
}
