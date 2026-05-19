"use client";

import { useEditor } from "../EditorContext";
import { ApplyModal } from "./ApplyModal";
import { BatchEditModal } from "./BatchEditModal";
import { BoundModal } from "./BoundModal";
import { DateModal } from "./DateModal";
import { ItemModal } from "./ItemModal";
import { LocationModal } from "./LocationModal";
import { NbtModal } from "./NbtModal";
import { RenameModal } from "./RenameModal";
import { StructModal } from "./StructModal";
import { TimespanModal } from "./TimespanModal";
import { VectorModal } from "./VectorModal";

export function ModalRoot() {
  const { state } = useEditor();
  const m = state.modal;
  if (!m) return null;
  switch (m.kind) {
    case "loc":    return <LocationModal v={m.v} />;
    case "vec":    return <VectorModal v={m.v} />;
    case "struct": return <StructModal v={m.v} />;
    case "item":   return <ItemModal v={m.v} />;
    case "rename": return <RenameModal v={m.v} copy={m.copy} />;
    case "batch":  return <BatchEditModal />;
    case "bound":  return <BoundModal v={m.v} />;
    case "ts":     return <TimespanModal v={m.v} />;
    case "date":   return <DateModal v={m.v} />;
    case "nbt":    return <NbtModal v={m.v} />;
    case "apply":  return <ApplyModal code={m.code} />;
    default:       return null;
  }
}
