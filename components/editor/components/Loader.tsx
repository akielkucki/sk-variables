"use client";

type Props = {
  hidden: boolean;
  message: string;
  sub: string;
  progressPct: number;
};

export function Loader({ hidden, message, sub, progressPct }: Props) {
  return (
    <div id="loader" className={hidden ? "hidden" : ""}>
      <span className="loader-brand">{"{-sk::variables}."}</span>
      <div id="spin" />
      <div id="load-msg">{message}</div>
      <div id="load-sub">{sub}</div>
      <div id="load-bar-wrap">
        <div id="load-bar" style={{ width: `${progressPct}%` }} />
      </div>
    </div>
  );
}
