import { useState } from 'react'
import { FormNode } from './components/FormNode'
import { FormPrefillPanel } from './components/FormPrefillPanel';
import { PrefillMappingModal } from './components/PrefillMappingModal';
import { getUpstreamFormIds } from './utils/getUpstreamFormIds';
import { ReactFlow } from '@xyflow/react'
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

    const upstreamFormIds = selectedNodeId ? getUpstreamFormIds(selectedNodeId, edges) : [];

    const globalDataForm = {
        nodeId: 'global-data',
        formId: 'global-data',
        name: 'Global Data',
        field_schema: {
            properties: {
                user_id: { title: 'User ID', type: 'string', avantos_type: 'short-text' },
                session_id: { title: 'Session ID', type: 'string', avantos_type: 'short-text' },
                timestamp: { title: 'Current Timestamp', type: 'string', avantos_type: 'short-text' },
                tenant_id: { title: 'Tenant ID', type: 'string', avantos_type: 'short-text' },
                current_date: { title: 'Current Date', type: 'string', avantos_type: 'short-text' }
            }
        }
    };

    const upstreamForms = graphData
        ? [
            globalDataForm, // Always include global data first
            ...graphData.nodes
                ?.filter((node: any) => upstreamFormIds.includes(node.id))
                .map((node: any) => {
                    const form = graphData.forms.find((f: any) => f.id === node.data.component_id);
                    return {
                        nodeId: node.id,
                        formId: form?.id,
                        name: node.data.name,
                        field_schema: form?.field_schema,
                        description: form?.description,
                        is_reusable: form?.is_reusable,
                        ui_schema: form?.ui_schema,
                        dynamic_field_config: form?.dynamic_field_config
                    };
                })
        ]
        : [globalDataForm]; 

    const updateMapping = (fieldKey: string | null, value: any) => {
        if (!selectedNodeId || !fieldKey) return;

        setNodes((prevNodes) => {
            return prevNodes.map((node) => {
                if (node.id !== selectedNodeId) return node;

                const oldMapping = node.data.input_mapping as Record<string, any> || {};
                const input_mapping = {
                    ...oldMapping,
                    [fieldKey]: value,
                };

                if (value === null) delete input_mapping[fieldKey];

                return {
                    ...node,
                    data: {
                        ...node.data,
                        input_mapping,
                    },
                };
            });
        });
    };

    const handleNodeClick = (event: any, node: any) => {
        setModalField(null);
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
                    key={selectedNodeId}
                    selectedNode={selectedNode}
                    formSchema={selectedFormSchema.field_schema}
                    inputMapping={selectedFormData?.input_mapping || {}}
                    onFieldClick={setModalField}
                    onClearMapping={(field) => updateMapping(field, null)}
                    upstreamForms={upstreamForms}
                />
            )}

            <PrefillMappingModal
                isOpen={!!modalField}
                onClose={() => setModalField(null)}
                upstreamForms={upstreamForms}
                onConfirm={(sourceNodeId, fieldKey) => {
                    updateMapping(modalField, { node_id: sourceNodeId, field_key: fieldKey });
                    setModalField(null);
                }}
            />
        </div>
    )
}