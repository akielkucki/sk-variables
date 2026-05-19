export type RawVariable = {
  n: string;
  t: string;
  v?: string;
  s?: unknown;
};

export type Variable = RawVariable & {
  d: string;
  byteSize: number;
  _isNew?: boolean;
};

export type ChangeEdit = { action: "edit"; type: string; newV: string };
export type ChangeDelete = { action: "delete"; type: string };
export type ChangeRename = { action: "rename"; type: string; newName: string; newV: string };
export type Change = ChangeEdit | ChangeDelete | ChangeRename;

export type DiffChange = { n: string; t: string; v?: string };

export type TreeNode = {
  children: Map<string, TreeNode>;
  selfVar: Variable | null;
};

export type FlatLeaf = { kind: "leaf"; v: Variable; depth: number };
export type FlatSection = {
  kind: "section";
  label: string;
  path: string;
  depth: number;
  count: number;
  isExpanded: boolean;
};
export type FlatRow = FlatLeaf | FlatSection;

export type StructValue = {
  t: string;
  f: Array<{ n: string; kt: string; v: string; ro?: boolean }>;
};

export type ItemValue = {
  material?: string;
  amount?: number;
  name?: string;
  lore?: string[];
  enchants?: Record<string, number>;
  damage?: number;
  customModelData?: number;
  unbreakable?: boolean;
};

export type ViewMode = "list" | "grid";
export type SortMode = "default" | "az" | "za" | "size-desc" | "size-asc" | "dirs-first";
export type FilterChange = "" | "modified" | "deleted";
