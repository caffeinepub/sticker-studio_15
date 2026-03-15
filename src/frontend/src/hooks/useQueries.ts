import { useMutation, useQuery } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useListStickerPacks() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["stickerPacks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllStickerPacks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetStickerPack(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["stickerPack", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getStickerPackById(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["stripeConfigured"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStripeSessionStatus(sessionId: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["stripeSession", sessionId],
    queryFn: async () => {
      if (!actor || !sessionId) return null;
      return actor.getStripeSessionStatus(sessionId);
    },
    enabled: !!actor && !isFetching && !!sessionId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return 2000;
      if (data.__kind__ === "completed" || data.__kind__ === "failed")
        return false;
      return 2000;
    },
  });
}

export function useSubmitContact() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      name,
      email,
      message,
    }: {
      name: string;
      email: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitContactMessage(name, email, message);
    },
  });
}
