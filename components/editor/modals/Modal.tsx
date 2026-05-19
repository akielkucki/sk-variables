"use client";

import type { ReactNode } from "react";

type Props = {
  size?: "md" | "lg" | "default";
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ size = "default", onClose, children }: Props) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={
          "modal-box" + (size === "lg" ? " modal-lg" : size === "md" ? " modal-md" : "")
        }
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
