import { createLocalStorageStore } from "./store-factory";

export type StoredBooking = {
  id: string;
  service: string;
  date: string;
  time: string;
  guests: number;
  amount: number;
  status: "Confirmed" | "Pending" | "Completed" | "Cancelled";
  location?: string;
};

const store = createLocalStorageStore<StoredBooking[]>("yatrigo.bookings", []);

export const getBookings = store.get;
export const useBookings = store.useStore;

export function addBooking(booking: StoredBooking) {
  store.set([booking, ...store.get()]);
}

export function cancelBooking(id: string) {
  store.set(store.get().map((b) => (b.id === id ? { ...b, status: "Cancelled" } : b)));
}
