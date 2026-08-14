import type { ReactNode } from "react";

export type ContainerProps = {
  readonly children: ReactNode;
};

/**
 * Shared content-width wrapper. This is a structural layout primitive,
 * not a product design decision -- learner-facing components belong in
 * later CC packages once an approved flow needs them.
 */
export function Container({ children }: ContainerProps) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">{children}</div>
  );
}
