import React, { useEffect, useState } from 'react'
import { FormNode } from './FormNode'

const nodeTypes = {
  form: FormNode,
}
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
  Background,
  ReactFlowProvider,
} from '@xyflow/react'
import type { Node, Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css';
import './graph.style.css'

const fetchGraphData = async (): Promise<{ nodes: Node[]; edges: Edge[] }> => {
  const response = await fetch('http://localhost:3000/api/v1/1/actions/blueprints/bp_01jk766tckfwx84xjcxazggzyc/graph')
  return response.json()
}

export const Graph = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

useEffect(() => {
  fetchGraphData().then(({ nodes, edges }) => {
    // Auto-generate missing edge IDs
    const updatedEdges = edges.map((edge, index) => ({
      ...edge,
      id: `e-${edge.source}-${edge.target}`,
    }));

    setNodes(nodes);
    setEdges(updatedEdges);
  }).catch((error) => {
      console.error('Failed to fetch graph data:', error)
      // optionally set an error UI state here
    });
}, []);

console.log('Graph nodes:', nodes)
  console.log('Graph edges:', edges)
  return (
    <div className="graph-container">
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          nodeTypes={nodeTypes} 
        >
          <MiniMap
  nodeStrokeColor={() => '#999'}
  nodeColor={() => '#fff'}
  nodeBorderRadius={4}
/>

          <Controls />
          <Background />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  )
}
