import React, { useEffect, useState } from 'react'
import { FormNode } from './components/FormNode'
// Import at top:
import { FormPrefillPanel } from './components/FormPrefillPanel';
import { PrefillMappingModal } from './components/PrefillMappingModal';
import { getUpstreamFormIds } from './utils/getUpstreamFormIds';
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
    const [graphData, setGraphData] = useState<any>(null);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [modalField, setModalField] = useState<string | null>(null);

    useEffect(() => {
        fetchGraphData().then((data) => {
            const updatedEdges = data.edges.map((edge: any) => ({
                ...edge,
                id: `e-${edge.source}-${edge.target}`,
            }));
            setNodes(data.nodes);
            setEdges(updatedEdges);
            setGraphData(data);
        })
            .catch((error) => {
                console.error('Failed to fetch graph data:', error)
                // optionally set an error UI state here
            });
    }, []);
    useEffect(() => {
        console.log('Selected node ID:', selectedNodeId);
    }, [selectedNodeId]);

    const selectedNode = nodes.find(n => n.id === selectedNodeId);
    const selectedFormData = selectedNode?.data;
    const selectedFormSchema = graphData?.forms.find(
        (form: any) => form.id === selectedFormData?.component_id
    );

    const upstreamFormIds = selectedNodeId ? getUpstreamFormIds(selectedNodeId, edges) : [];
    const upstreamForms = graphData
        ? graphData.forms.filter((f: any) => upstreamFormIds.includes(f.id))
        : [];



    const updateMapping = (fieldKey: string | null, value: any) => {
        if (!selectedNodeId || !fieldKey) return;

        setNodes((prevNodes) =>
            prevNodes.map((node) => {
                if (node.id !== selectedNodeId) return node;

                const oldMapping = node.data.input_mapping as Record<string, any> || {};
                const input_mapping = {
                    ...oldMapping,
                    [fieldKey]: value,
                };

                // Delete if value is null
                if (value === null) delete input_mapping[fieldKey];

                return {
                    ...node,
                    data: {
                        ...node.data,
                        input_mapping,
                    },
                };
            })
        );
    };


    console.log('Graph nodes:', nodes)
    console.log('Graph edges:', edges)
    console.log((selectedFormData))
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
                    onNodeClick={(event, node) => setSelectedNodeId(node.id)}
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
            {selectedNode && selectedFormSchema?.field_schema?.properties && (
                <FormPrefillPanel
                    selectedNode={selectedNode}
                    formSchema={selectedFormSchema.field_schema}
                    inputMapping={selectedFormData?.input_mapping || {}}
                    onFieldClick={setModalField}
                    onClearMapping={(field) => updateMapping(field, null)}
                />
            )}
            <PrefillMappingModal
                isOpen={!!modalField}
                onClose={() => setModalField(null)}
                upstreamForms={upstreamForms}
                onConfirm={(sourceFormId, fieldKey) => {
                    updateMapping(modalField, { form_id: sourceFormId, field_key: fieldKey });
                    setModalField(null);
                }}
            />
        </div>
    )
}
