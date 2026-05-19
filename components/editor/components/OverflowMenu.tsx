"use client";

import { useEffect, useRef } from "react";

export type OverflowItem = {
  label: string;
  cls?: string;
  onClick: () => void;
};

type Props = {
  anchor: { x: number; y: number };
  items: OverflowItem[];
  onClose: () => void;
};

export function OverflowMenu({ anchor, items, onClose }: Props) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = () => onClose();
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [onClose]);

  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const mw = r.width || 130;
    const mh = r.height || 110;
    let left = anchor.x - mw;
    let top = anchor.y + 4;
    if (left < 4) left = 4;
    if (top + mh > window.innerHeight - 4) top = anchor.y - mh - 4;
    el.style.left = left + "px";
    el.style.top = top + "px";
  }, [anchor]);

  return (
    <div className="overflow-menu" ref={menuRef} onClick={(e) => e.stopPropagation()}>
      {items.map((it, i) => (
        <button
          key={i}
          className={"overflow-item" + (it.cls ? " " + it.cls : "")}
          onClick={() => { onClose(); it.onClick(); }}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}
