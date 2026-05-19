"use client";

import { useMemo, useState } from "react";
import type { Variable } from "../lib/types";
import { useEditor } from "../EditorContext";
import { Modal } from "./Modal";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS_HDR = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function DateModal({ v }: { v: Variable }) {
  const { state, actions } = useEditor();
  const ch = state.changes.get(v.n);
  const raw = ch?.action === "edit" ? ch.newV : v.v;
  const initial = useMemo(() => {
    const ts = Number(raw);
    return !isNaN(ts) && ts > 0 ? new Date(ts) : new Date();
  }, [raw]);

  const [year, setYear] = useState(initial.getFullYear());
  const [month, setMonth] = useState(initial.getMonth());
  const [day, setDay] = useState(initial.getDate());
  const [hour, setHour] = useState(initial.getHours());
  const [minute, setMinute] = useState(initial.getMinutes());

  const nav = (dir: number) => {
    let m = month + dir;
    let y = year;
    if (m > 11) { m = 0; y++; }
    if (m < 0) { m = 11; y--; }
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    if (day > daysInMonth) setDay(daysInMonth);
    setMonth(m);
    setYear(y);
  };

  const save = () => {
    const h = Math.min(23, Math.max(0, isNaN(hour) ? 0 : hour));
    const mi = Math.min(59, Math.max(0, isNaN(minute) ? 0 : minute));
    const ts = new Date(year, month, day, h, mi, 0, 0).getTime();
    actions.setChange(v.n, { action: "edit", type: v.t, newV: String(ts) });
    actions.setModal(null);
  };

  const firstDOW = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const blanks = Array.from({ length: firstDOW }, (_, i) => <div key={`b${i}`} />);
  const dayCells = Array.from({ length: daysInMonth }, (_, i) => {
    const d = i + 1;
    const isSelected = d === day;
    const isToday =
      d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    return (
      <div
        key={d}
        className={
          "cal-day" + (isSelected ? " cal-selected" : isToday ? " cal-today" : "")
        }
        onClick={() => setDay(d)}
      >
        {d}
      </div>
    );
  });

  return (
    <Modal size="md" onClose={() => actions.setModal(null)}>
      <h2>Edit Date</h2>
      <div className="modal-subtitle">{v.n}</div>
      <div className="cal-header">
        <button className="cal-nav-btn" onClick={() => nav(-1)}>‹</button>
        <span className="cal-title">{MONTHS[month]} {year}</span>
        <button className="cal-nav-btn" onClick={() => nav(1)}>›</button>
      </div>
      <div className="cal-grid">
        {DAYS_HDR.map((d) => <div key={d} className="cal-hdr">{d}</div>)}
        {blanks}
        {dayCells}
      </div>
      <div className="cal-time-row">
        <label>Time</label>
        <input type="number" min={0} max={23} placeholder="HH"
          value={String(hour).padStart(2, "0")}
          onChange={(e) => setHour(Number(e.target.value))}
        />
        <span style={{ color: "var(--muted)", fontWeight: 700 }}>:</span>
        <input type="number" min={0} max={59} placeholder="MM"
          value={String(minute).padStart(2, "0")}
          onChange={(e) => setMinute(Number(e.target.value))}
        />
      </div>
      <div className="modal-footer">
        <button className="btn-sm btn-cancel" onClick={() => actions.setModal(null)}>Cancel</button>
        <button className="btn-sm btn-save" onClick={save}>Save</button>
      </div>
    </Modal>
  );
}
