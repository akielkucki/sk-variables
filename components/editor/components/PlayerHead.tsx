"use client";

import { useState } from "react";
import { hyphenUuid } from "../lib/decode";

export function PlayerHead({ raw }: { raw: string }) {
  const uuid = hyphenUuid(raw);
  const [src, setSrc] = useState(`https://crafatar.com/avatars/${uuid}?size=48&overlay`);

  return (
    <img
      className="uuid-head"
      alt=""
      src={src}
      onError={() => setSrc(`https://mc-heads.net/avatar/${uuid}/24`)}
    />
  );
}
