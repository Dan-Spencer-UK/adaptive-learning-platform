// @alp/ui is the web client's DOM/Tailwind component package (see
// docs/architecture/MOBILE-ARCHITECTURE.md). It is not consumed by the
// native mobile client, which has its own UI package.
export const packageId = "ui" as const;

export type PackageId = typeof packageId;

export { Container } from "./container";
export type { ContainerProps } from "./container";
