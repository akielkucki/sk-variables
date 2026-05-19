"use client";

import { useMemo, useState } from "react";
import type { ItemValue, Variable } from "../lib/types";
import { displayToLegacy, legacyToDisplay } from "../lib/decode";
import { useEditor } from "../EditorContext";
import { Modal } from "./Modal";

type EnchantRow = { key: string; level: number };

export function ItemModal({ v }: { v: Variable }) {
  const { state, actions } = useEditor();
  const initial = useMemo<ItemValue>(() => {
    const ch = state.changes.get(v.n);
    if (ch?.action === "edit") {
      try { return JSON.parse(ch.newV) as ItemValue; } catch { /* ignore */ }
    }
    return (v.s as ItemValue) ?? {};
  }, [v.n, v.s, state.changes]);

  const [material, setMaterial] = useState(initial.material ?? "");
  const [amount, setAmount] = useState(initial.amount ?? 1);
  const [name, setName] = useState(legacyToDisplay(initial.name ?? ""));
  const [lore, setLore] = useState((initial.lore ?? []).map(legacyToDisplay).join("\n"));
  const [enchants, setEnchants] = useState<EnchantRow[]>(
    Object.entries(initial.enchants ?? {}).map(([key, level]) => ({ key, level }))
  );
  const [damage, setDamage] = useState(initial.damage ?? "");
  const [cmd, setCmd] = useState(initial.customModelData ?? "");
  const [unbreakable, setUnbreakable] = useState(!!initial.unbreakable);
  const [rawOpen, setRawOpen] = useState(false);
  const [rawJson, setRawJson] = useState("");

  const buildItem = (): ItemValue => {
    const obj: ItemValue = {};
    if (material.trim()) obj.material = material.trim();
    obj.amount = amount > 0 ? amount : 1;
    const legacyName = displayToLegacy(name);
    if (legacyName) obj.name = legacyName;
    const loreLines = lore.split("\n").filter((l) => l !== "").map(displayToLegacy);
    if (loreLines.length) obj.lore = loreLines;
    const ench: Record<string, number> = {};
    for (const r of enchants) {
      if (r.key.trim()) ench[r.key.trim()] = r.level || 1;
    }
    if (Object.keys(ench).length) obj.enchants = ench;
    if (damage !== "" && Number(damage) > 0) obj.damage = Number(damage);
    if (unbreakable) obj.unbreakable = true;
    if (cmd !== "") obj.customModelData = Number(cmd);
    return obj;
  };

  const save = () => {
    let obj: ItemValue;
    if (rawOpen) {
      try {
        obj = JSON.parse(rawJson) as ItemValue;
      } catch {
        return;
      }
    } else {
      obj = buildItem();
    }
    actions.setChange(v.n, { action: "edit", type: v.t, newV: JSON.stringify(obj) });
    actions.setModal(null);
  };

  return (
    <Modal size="default" onClose={() => actions.setModal(null)}>
      <h2>Edit Item</h2>
      <div className="modal-subtitle">{v.n}</div>

      <div className="item-field-row">
        <div className="item-field">
          <label>Material</label>
          <input
            type="text"
            placeholder="minecraft:diamond_sword"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            autoFocus
          />
        </div>
        <div className="item-field item-field-sm">
          <label>Amount</label>
          <input type="number" min={1} max={64} value={amount}
                 onChange={(e) => setAmount(Number(e.target.value))} />
        </div>
      </div>

      <div className="item-field">
        <label>Display Name <span className="item-hint">(§6color codes supported)</span></label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="item-field">
        <label>Lore <span className="item-hint">(one line per row)</span></label>
        <textarea rows={3} value={lore} onChange={(e) => setLore(e.target.value)} />
      </div>

      <div className="item-field">
        <label>Enchantments</label>
        <div>
          {enchants.map((row, i) => (
            <div key={i} className="item-ench-row">
              <input
                type="text"
                placeholder="sharpness"
                value={row.key}
                onChange={(e) =>
                  setEnchants((prev) => prev.map((r, j) => (j === i ? { ...r, key: e.target.value } : r)))
                }
              />
              <input
                type="number"
                min={1}
                max={255}
                value={row.level}
                onChange={(e) =>
                  setEnchants((prev) =>
                    prev.map((r, j) => (j === i ? { ...r, level: Number(e.target.value) || 1 } : r))
                  )
                }
              />
              <button
                className="item-ench-del"
                onClick={() => setEnchants((prev) => prev.filter((_, j) => j !== i))}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          className="item-add-ench-btn"
          onClick={() => setEnchants((prev) => [...prev, { key: "", level: 1 }])}
        >
          + Add enchantment
        </button>
      </div>

      <div className="item-extras-row">
        <div className="item-field item-field-sm">
          <label>Damage</label>
          <input type="number" min={0} value={damage} onChange={(e) => setDamage(e.target.value)} />
        </div>
        <div className="item-field item-field-sm">
          <label>Custom Model Data</label>
          <input type="number" min={0} value={cmd} onChange={(e) => setCmd(e.target.value)} />
        </div>
        <div className="item-extras-check">
          <label>Unbreakable</label>
          <input type="checkbox" checked={unbreakable} onChange={(e) => setUnbreakable(e.target.checked)} />
        </div>
      </div>

      <details
        className="item-raw-details"
        open={rawOpen}
        onToggle={(e) => {
          const open = (e.currentTarget as HTMLDetailsElement).open;
          setRawOpen(open);
          if (open) setRawJson(JSON.stringify(buildItem(), null, 2));
        }}
      >
        <summary>Raw JSON</summary>
        <textarea
          className="item-raw-textarea"
          spellCheck={false}
          rows={6}
          value={rawJson}
          onChange={(e) => setRawJson(e.target.value)}
        />
      </details>

      <div className="modal-footer">
        <button className="btn-sm btn-cancel" onClick={() => actions.setModal(null)}>Cancel</button>
        <button className="btn-sm btn-save" onClick={save}>Save</button>
      </div>
    </Modal>
  );
}
