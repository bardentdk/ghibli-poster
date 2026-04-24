import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCheckoutStore = create(
  persist(
    (set) => ({
      posterId: null,
      format: 'A4',
      shippingAddress: null,

      setCheckoutData: (data) => set(data),
      setShippingAddress: (address) => set({ shippingAddress: address }),
      reset: () => set({
        posterId: null,
        format: 'A4',
        shippingAddress: null,
      }),
    }),
    {
      name: 'ghibli-checkout',
    }
  )
)