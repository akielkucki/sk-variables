"use client";

import { useEffect, useRef, useState } from "react";
import type { Variable } from "../lib/types";

const DROPDOWN_OPTS: Record<string, string[]> = {
  boolean: ["true", "false"],
  gamemode: ["survival", "creative", "adventure", "spectator"],
  difficulty: ["peaceful", "easy", "normal", "hard"],
};

type Props = {
  v: Variable;
  displayVal: string;
  onCommit: (newVal: string) => void;
  onCancel: () => void;
};

export function ValueEditor({ v, displayVal, onCommit, onCancel }: Props) {
  const tl = (v.t || "").toLowerCase();
  const opts = DROPDOWN_OPTS[tl];
  const [value, setValue] = useState(displayVal);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const selectRef = useRef<HTMLSelectElement | null>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    else if (selectRef.current) selectRef.current.focus();
  }, []);

  if (opts) {
    return (
      <select
        ref={selectRef}
        className="val-select"
        value={opts.find((o) => value.toLowerCase().includes(o)) ?? opts[0]}
        onChange={(e) => onCommit(e.target.value)}
      >
        {opts.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    );
  }

  return (
    <input
      ref={inputRef}
      className="val-input"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onCommit(value);
        else if (e.key === "Escape") onCancel();
      }}
      onBlur={() => onCommit(value)}
    />
  );
}
