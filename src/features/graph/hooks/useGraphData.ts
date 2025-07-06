import { useEffect, useState } from "react";
import { useNodesState, useEdgesState } from "@xyflow/react";
import type { Node, Edge } from "@xyflow/react";

export const useGraphData = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [graphData, setGraphData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/1/actions/blueprints/bp_01jk766tckfwx84xjcxazggzyc/graph"
        );
        const data = await response.json();
        const updatedEdges = data.edges.map((edge: any) => ({
          ...edge,
          id: `e-${edge.source}-${edge.target}`,
        }));

        setNodes(data.nodes);
        setEdges(updatedEdges);
        setGraphData(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGraphData();
  }, [setNodes, setEdges]);

  return {
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    graphData,
    loading,
    error,
  };
};
