import { useState } from 'react'
import { FormNode } from './components/FormNode'
import { FormPrefillPanel } from './components/FormPrefillPanel';
import { PrefillMappingModal } from './components/PrefillMappingModal';
import { getUpstreamFormIds } from './utils/getUpstreamFormIds';
import {
    ReactFlow,
    ReactFlowProvider,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css';
import './graph.style.css'
import { useGraphData } from './hooks/useGraphData';

export const Graph = () => {
    const nodeTypes = { form: FormNode }
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [modalField, setModalField] = useState<string | null>(null);
    const {
        nodes,
        setNodes,
        onNodesChange,
        edges,
        onEdgesChange,
        graphData,
    } = useGraphData();

    const selectedNode = nodes.find(n => n.id === selectedNodeId);
    const selectedFormData = selectedNode?.data;
    const selectedFormSchema = graphData?.forms?.find(
        (form: any) => form.id === selectedFormData?.component_id
    );

    // Debug logging
    console.log('Selected Node ID:', selectedNodeId);
    console.log('Selected Node Data:', selectedFormData);
    console.log('Input Mapping:', selectedFormData?.input_mapping);
    console.log('Selected Form Schema:', selectedFormSchema);
    console.log('Should render panel:', !!(selectedNode && selectedFormSchema?.field_schema?.properties));
    
    // Let's also log the individual mappings to see what's in them
    if (selectedFormData?.input_mapping) {
        Object.entries(selectedFormData.input_mapping).forEach(([key, mapping]) => {
            console.log(`Mapping for ${key}:`, mapping);
        });
    }

    const upstreamFormIds = selectedNodeId ? getUpstreamFormIds(selectedNodeId, edges) : [];

    const upstreamForms = graphData
        ? graphData.nodes
            ?.filter((node: any) => upstreamFormIds.includes(node.id))
            .map((node: any) => {
                const form = graphData.forms.find((f: any) => f.id === node.data.component_id);
                return {
                    nodeId: node.id, // The unique node ID 
                    formId: form?.id, // The form definition ID (can be duplicate)
                    name: node.data.name, // The node's display name (Form A, Form B, etc.) - IMPORTANT: This should come AFTER spreading form
                    field_schema: form?.field_schema, // The form's field schema
                    // Include other form properties we might need, but don't override our custom name
                    description: form?.description,
                    is_reusable: form?.is_reusable,
                    ui_schema: form?.ui_schema,
                    dynamic_field_config: form?.dynamic_field_config
                };
            })
        : [];

    // Debug upstream forms
    console.log('Upstream Form IDs:', upstreamFormIds);
    console.log('Upstream Forms:', upstreamForms);

    const updateMapping = (fieldKey: string | null, value: any) => {
        console.log('updateMapping called:', { selectedNodeId, fieldKey, value });
        if (!selectedNodeId || !fieldKey) return;

        setNodes((prevNodes) => {
            const updatedNodes = prevNodes.map((node) => {
                if (node.id !== selectedNodeId) return node;

                const oldMapping = node.data.input_mapping as Record<string, any> || {};
                const input_mapping = {
                    ...oldMapping,
                    [fieldKey]: value,
                };

                if (value === null) delete input_mapping[fieldKey];

                console.log('Updating node:', node.id, 'with mapping:', input_mapping);
                console.log('New mapping value for', fieldKey, ':', value);

                return {
                    ...node,
                    data: {
                        ...node.data,
                        input_mapping,
                    },
                };
            });
            console.log('Updated nodes:', updatedNodes);
            return updatedNodes;
        });
    };

    const handleNodeClick = (event: any, node: any) => {
        setModalField(null); // Close the modal when a node is clicked
        setSelectedNodeId(node.id);
    };

    return (
        <div className="graph-container">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    fitView
                    nodeTypes={nodeTypes}
                    onNodeClick={handleNodeClick}
                >
                </ReactFlow>


            {selectedNode && selectedFormSchema?.field_schema?.properties && (
                <FormPrefillPanel
                    key={selectedNodeId} // Add key to force re-render when node changes
                    selectedNode={selectedNode}
                    formSchema={selectedFormSchema.field_schema}
                    inputMapping={selectedFormData?.input_mapping || {}}
                    onFieldClick={setModalField}
                    onClearMapping={(field) => updateMapping(field, null)}
                    graphData={graphData}
                    upstreamForms={upstreamForms} // Pass the already calculated upstreamForms
                />
            )}


            <PrefillMappingModal
                isOpen={!!modalField}
                onClose={() => setModalField(null)}
                upstreamForms={upstreamForms}
                onConfirm={(sourceNodeId, fieldKey) => {
                    console.log('Modal onConfirm called with:', { sourceNodeId, fieldKey, modalField });
                    // Store the nodeId instead of formId to distinguish between different instances
                    updateMapping(modalField, { node_id: sourceNodeId, field_key: fieldKey });
                    setModalField(null);
                }}
            />
        </div>
    )
}