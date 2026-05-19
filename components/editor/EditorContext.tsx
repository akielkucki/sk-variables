"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  Change,
  FilterChange,
  SortMode,
  Variable,
  ViewMode,
} from "./lib/types";

export type ModalKind =
  | { kind: "loc"; v: Variable }
  | { kind: "vec"; v: Variable }
  | { kind: "struct"; v: Variable }
  | { kind: "item"; v: Variable }
  | { kind: "rename"; v: Variable; copy: boolean }
  | { kind: "batch" }
  | { kind: "bound"; v: Variable }
  | { kind: "ts"; v: Variable }
  | { kind: "date"; v: Variable }
  | { kind: "nbt"; v: Variable }
  | { kind: "apply"; code: string }
  | null;

export type EditorState = {
  sessionId: string | null;
  allVars: Variable[];
  changes: Map<string, Change>;
  selected: Set<string>;
  editingName: string | null;
  expanded: Set<string>;
  collapsed: Set<string>;
  searchQ: string;
  searchRegex: boolean;
  searchUUIDs: string[];
  filterType: string;
  filterChange: FilterChange;
  sortMode: SortMode;
  showEphemeral: boolean;
  viewMode: ViewMode;
  activeTab: "vars" | "warn";
  sidebarOpen: boolean;
  themeId: string;
  mutedLints: Set<string>;
  modal: ModalKind;
  status: string;
  // ephemeral player resolution caches
  playerNames: Map<string, string | null>;
  nameVerify: Map<string, boolean | null>;
};

type Setter<K extends keyof EditorState> = (value: EditorState[K]) => void;

export type EditorActions = {
  setSessionId: Setter<"sessionId">;
  setAllVars: (vars: Variable[]) => void;
  setStatus: Setter<"status">;
  setSearchQ: Setter<"searchQ">;
  setSearchRegex: Setter<"searchRegex">;
  setSearchUUIDs: Setter<"searchUUIDs">;
  setFilterType: Setter<"filterType">;
  setFilterChange: Setter<"filterChange">;
  setSortMode: Setter<"sortMode">;
  setShowEphemeral: Setter<"showEphemeral">;
  setViewMode: Setter<"viewMode">;
  setActiveTab: Setter<"activeTab">;
  setSidebarOpen: Setter<"sidebarOpen">;
  setThemeId: Setter<"themeId">;
  setModal: Setter<"modal">;
  setEditingName: Setter<"editingName">;
  toggleExpanded: (path: string) => void;
  toggleCollapsed: (path: string) => void;
  setSelected: (next: Set<string>) => void;
  toggleSelected: (name: string) => void;
  clearSelected: () => void;
  setChange: (name: string, change: Change) => void;
  deleteChange: (name: string) => void;
  bulkDelete: (names: string[]) => void;
  resetChanges: () => void;
  muteLint: (id: string) => void;
  resetMutedLints: () => void;
  setNameVerify: (name: string, status: boolean | null) => void;
  setPlayerName: (uuid: string, name: string | null) => void;
  pushNewVariable: (v: Variable) => void;
};

const Ctx = createContext<{ state: EditorState; actions: EditorActions } | null>(null);

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function readLocalRaw(key: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  try {
    return window.localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

export function EditorProvider({ children }: { children: ReactNode }) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [allVars, setAllVarsRaw] = useState<Variable[]>([]);
  const [changes, setChanges] = useState<Map<string, Change>>(new Map());
  const [selected, setSelectedRaw] = useState<Set<string>>(new Set());
  const [editingName, setEditingName] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [searchQ, setSearchQ] = useState("");
  const [searchRegex, setSearchRegex] = useState(false);
  const [searchUUIDs, setSearchUUIDs] = useState<string[]>([]);
  const [filterType, setFilterType] = useState("");
  const [filterChange, setFilterChange] = useState<FilterChange>("");
  const [sortMode, setSortMode] = useState<SortMode>("default");
  const [showEphemeral, setShowEphemeral] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>(() =>
    readLocalRaw("skv-view", "list") === "grid" ? "grid" : "list"
  );
  const [activeTab, setActiveTab] = useState<"vars" | "warn">("vars");
  const [sidebarOpen, setSidebarOpen] = useState(() => readLocalRaw("skv-sidebar", "open") !== "closed");
  const [themeId, setThemeIdState] = useState(() => readLocalRaw("skv-theme", "ocean"));
  const [mutedLints, setMutedLints] = useState<Set<string>>(
    () => new Set(readLocal<string[]>("skv-muted-lints", []))
  );
  const [modal, setModal] = useState<ModalKind>(null);
  const [status, setStatus] = useState("Loading…");
  const [playerNames, setPlayerNames] = useState<Map<string, string | null>>(new Map());
  const [nameVerify, setNameVerifyState] = useState<Map<string, boolean | null>>(new Map());

  const playerNamesRef = useRef(playerNames);
  playerNamesRef.current = playerNames;
  const nameVerifyRef = useRef(nameVerify);
  nameVerifyRef.current = nameVerify;

  const setViewModePersist = useCallback((m: ViewMode) => {
    setViewMode(m);
    try { window.localStorage.setItem("skv-view", m); } catch {}
  }, []);

  const setSidebarOpenPersist = useCallback((open: boolean) => {
    setSidebarOpen(open);
    try { window.localStorage.setItem("skv-sidebar", open ? "open" : "closed"); } catch {}
  }, []);

  const setThemeId = useCallback((id: string) => {
    setThemeIdState(id);
    try { window.localStorage.setItem("skv-theme", id); } catch {}
  }, []);

  const setAllVars = useCallback((vars: Variable[]) => setAllVarsRaw(vars), []);

  const toggleExpanded = useCallback((path: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path); else next.add(path);
      return next;
    });
  }, []);
  const toggleCollapsed = useCallback((path: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path); else next.add(path);
      return next;
    });
  }, []);
  const setSelected = useCallback((s: Set<string>) => setSelectedRaw(new Set(s)), []);
  const toggleSelected = useCallback((name: string) => {
    setSelectedRaw((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  }, []);
  const clearSelected = useCallback(() => setSelectedRaw(new Set()), []);

  const setChange = useCallback((name: string, change: Change) => {
    setChanges((prev) => {
      const next = new Map(prev);
      next.set(name, change);
      return next;
    });
  }, []);
  const deleteChange = useCallback((name: string) => {
    setChanges((prev) => {
      if (!prev.has(name)) return prev;
      const next = new Map(prev);
      next.delete(name);
      return next;
    });
  }, []);
  const bulkDelete = useCallback((names: string[]) => {
    setChanges((prev) => {
      const next = new Map(prev);
      // we need types — caller passes variable types via reading allVars
      // but we expose this only with delete intent
      for (const name of names) {
        // type filled in by caller via setChange wrapper; here just placeholder
        if (next.has(name)) continue;
        next.set(name, { action: "delete", type: "" });
      }
      return next;
    });
  }, []);
  const resetChanges = useCallback(() => setChanges(new Map()), []);

  const muteLint = useCallback((id: string) => {
    setMutedLints((prev) => {
      const next = new Set(prev);
      next.add(id);
      try { window.localStorage.setItem("skv-muted-lints", JSON.stringify([...next])); } catch {}
      return next;
    });
  }, []);

  const resetMutedLints = useCallback(() => {
    setMutedLints(new Set());
    try { window.localStorage.setItem("skv-muted-lints", "[]"); } catch {}
  }, []);

  const setNameVerify = useCallback((name: string, status: boolean | null) => {
    setNameVerifyState((prev) => {
      const next = new Map(prev);
      next.set(name.toLowerCase(), status);
      return next;
    });
  }, []);

  const setPlayerName = useCallback((uuid: string, name: string | null) => {
    setPlayerNames((prev) => {
      const next = new Map(prev);
      next.set(uuid.toLowerCase().replace(/-/g, ""), name);
      return next;
    });
  }, []);

  const pushNewVariable = useCallback((v: Variable) => {
    setAllVarsRaw((prev) => [...prev, v]);
  }, []);

  const state: EditorState = {
    sessionId,
    allVars,
    changes,
    selected,
    editingName,
    expanded,
    collapsed,
    searchQ,
    searchRegex,
    searchUUIDs,
    filterType,
    filterChange,
    sortMode,
    showEphemeral,
    viewMode,
    activeTab,
    sidebarOpen,
    themeId,
    mutedLints,
    modal,
    status,
    playerNames,
    nameVerify,
  };

  const actions: EditorActions = useMemo(
    () => ({
      setSessionId,
      setAllVars,
      setStatus,
      setSearchQ,
      setSearchRegex,
      setSearchUUIDs,
      setFilterType,
      setFilterChange,
      setSortMode,
      setShowEphemeral,
      setViewMode: setViewModePersist,
      setActiveTab,
      setSidebarOpen: setSidebarOpenPersist,
      setThemeId,
      setModal,
      setEditingName,
      toggleExpanded,
      toggleCollapsed,
      setSelected,
      toggleSelected,
      clearSelected,
      setChange,
      deleteChange,
      bulkDelete,
      resetChanges,
      muteLint,
      resetMutedLints,
      setNameVerify,
      setPlayerName,
      pushNewVariable,
    }),
    [
      setAllVars,
      setViewModePersist,
      setSidebarOpenPersist,
      setThemeId,
      toggleExpanded,
      toggleCollapsed,
      setSelected,
      toggleSelected,
      clearSelected,
      setChange,
      deleteChange,
      bulkDelete,
      resetChanges,
      muteLint,
      resetMutedLints,
      setNameVerify,
      setPlayerName,
      pushNewVariable,
    ]
  );

  return <Ctx.Provider value={{ state, actions }}>{children}</Ctx.Provider>;
}

export function useEditor() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useEditor must be used inside EditorProvider");
  return ctx;
}
