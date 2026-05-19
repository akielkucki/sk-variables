import type { FlatRow, SortMode, TreeNode, Variable } from "./types";

export function buildTree(vars: Variable[]): TreeNode {
  const root: TreeNode = { children: new Map(), selfVar: null };
  for (const v of vars) {
    const segs = v.n.split("::");
    let node = root;
    for (let i = 0; i < segs.length - 1; i++) {
      const seg = segs[i];
      if (!node.children.has(seg)) {
        node.children.set(seg, { children: new Map(), selfVar: null });
      }
      node = node.children.get(seg)!;
    }
    const last = segs[segs.length - 1];
    if (!node.children.has(last)) {
      node.children.set(last, { children: new Map(), selfVar: null });
    }
    node.children.get(last)!.selfVar = v;
  }
  return root;
}

export function countVars(node: TreeNode): number {
  let n = node.selfVar ? 1 : 0;
  for (const c of node.children.values()) n += countVars(c);
  return n;
}

function nodeMaxSize(node: TreeNode): number {
  let m = node.selfVar ? node.selfVar.byteSize : 0;
  for (const c of node.children.values()) m = Math.max(m, nodeMaxSize(c));
  return m;
}

function sortedChildren(node: TreeNode, sortMode: SortMode): Array<[string, TreeNode]> {
  const entries = [...node.children.entries()];
  switch (sortMode) {
    case "az":
      return entries.sort((a, b) => a[0].localeCompare(b[0]));
    case "za":
      return entries.sort((a, b) => b[0].localeCompare(a[0]));
    case "size-desc":
      return entries.sort((a, b) => nodeMaxSize(b[1]) - nodeMaxSize(a[1]));
    case "size-asc":
      return entries.sort((a, b) => nodeMaxSize(a[1]) - nodeMaxSize(b[1]));
    case "dirs-first":
      return entries.sort((a, b) => {
        const as = a[1].children.size > 0;
        const bs = b[1].children.size > 0;
        if (as !== bs) return as ? -1 : 1;
        return a[0].localeCompare(b[0]);
      });
    default:
      return entries;
  }
}

export function getNodeAtPath(tree: TreeNode, path: string): TreeNode | null {
  const segs = path.split("::");
  let node: TreeNode | undefined = tree;
  for (const seg of segs) {
    if (!node || !node.children.has(seg)) return null;
    node = node.children.get(seg);
  }
  return node ?? null;
}

export function collectVarNames(node: TreeNode, results: string[]): void {
  if (node.selfVar) results.push(node.selfVar.n);
  for (const child of node.children.values()) collectVarNames(child, results);
}

export type FlattenOpts = {
  tree: TreeNode;
  sortMode: SortMode;
  expanded: Set<string>;
  collapsed: Set<string>;
  isFiltering: boolean;
  showEphemeral: boolean;
};

export function flatten(opts: FlattenOpts): FlatRow[] {
  const out: FlatRow[] = [];
  const recurse = (node: TreeNode, depth: number, path: string) => {
    for (const [seg, child] of sortedChildren(node, opts.sortMode)) {
      if (!opts.showEphemeral && path === "" && seg.startsWith("-")) continue;
      const childPath = path ? path + "::" + seg : seg;
      if (child.children.size === 0) {
        if (child.selfVar) out.push({ kind: "leaf", v: child.selfVar, depth });
      } else {
        const isExp = opts.isFiltering
          ? !opts.collapsed.has(childPath)
          : opts.expanded.has(childPath);
        out.push({
          kind: "section",
          label: seg,
          path: childPath,
          depth,
          count: countVars(child),
          isExpanded: isExp,
        });
        if (isExp) {
          if (child.selfVar) {
            out.push({ kind: "leaf", v: child.selfVar, depth: depth + 1 });
          }
          recurse(child, depth + 1, childPath);
        }
      }
    }
  };
  recurse(opts.tree, 0, "");
  return out;
}
