// src/__mocks__/zustand.ts
import { act } from "@testing-library/react";
import type * as ZustandTypes from "zustand";
import { vi, afterEach } from "vitest";

export * from "zustand";

const { create: actualCreate, createStore: actualCreateStore } =
  await vi.importActual<typeof ZustandTypes>("zustand");

export const storeResetFns = new Set<() => void>();

const createUncurried = <T>(fn: ZustandTypes.StateCreator<T>) => {
  const store = actualCreate(fn);
  const initial = store.getState();
  storeResetFns.add(() => store.setState(initial, true));
  return store;
};

export const create = ((fn: any) => {
  return typeof fn === "function" ? createUncurried(fn) : createUncurried;
}) as typeof actualCreate;

const createStoreUncurried = <T>(fn: ZustandTypes.StateCreator<T>) => {
  const store = actualCreateStore(fn);
  const initial = store.getState();
  storeResetFns.add(() => store.setState(initial, true));
  return store;
};

export const createStore = ((fn: any) => {
  return typeof fn === "function"
    ? createStoreUncurried(fn)
    : createStoreUncurried;
}) as typeof actualCreateStore;

afterEach(() => {
  act(() => {
    storeResetFns.forEach((reset) => reset());
  });
});
