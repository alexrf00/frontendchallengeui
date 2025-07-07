import type { Edge } from "@xyflow/react";


export function getUpstreamFormIds(formId: string, edges: Edge[]): string[] {
  const visited = new Set<string>();
  const stack = [formId];
  while (stack.length > 0) {
    const current = stack.pop()!;
    for (const edge of edges) {
      if (edge.target === current && !visited.has(edge.source)) {
        visited.add(edge.source);
        stack.push(edge.source);
      }
    }
  }
  return [...visited];
}