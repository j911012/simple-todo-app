import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("zustand");

// ResizeObserver のダミー実装（Radix UI 用）
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
