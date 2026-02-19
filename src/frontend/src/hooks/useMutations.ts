import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useSetAvailability() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vin, isForSale }: { vin: string; isForSale: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setAvailability(vin, isForSale);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vin: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOrder(vin);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}
