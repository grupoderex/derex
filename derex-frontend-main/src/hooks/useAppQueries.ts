import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  getAllFavoritesUser,
  setFavoritesUserAPI,
  getWebsiteMedia,
} from "@/utils/api";

// Hook para Favoritos
export function useFavorites() {
  const token = useAuthStore((state) => state.user?.token);

  return useQuery({
    queryKey: ["favorites"],
    queryFn: () => getAllFavoritesUser(token!),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });
}

// Hook para Mutar Favoritos
export function useToggleFavorite() {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.user?.token);

  return useMutation({
    mutationFn: (id: number) => setFavoritesUserAPI(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

// Hook para Media (Video home, etc)
export function useWebsiteMedia(initialData?: any) {
  return useQuery({
    queryKey: ["websiteMedia"],
    queryFn: getWebsiteMedia,
    initialData: initialData ?? undefined,
    staleTime: Infinity,
  });
}
