import { createLocalStorageStore } from "./store-factory";
import type { TripPlan } from "./trip-engine";

const store = createLocalStorageStore<TripPlan | null>("yatrigo.plan", null);

export const getPlan = store.get;
export const setPlan = store.set;
export const usePlan = store.useStore;
