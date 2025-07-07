/**
 * Graph Component - Main orchestrator for the form workflow system
 * 
 * This component manages form dependencies, prefill mappings, and form submissions
 * in a visual graph interface using ReactFlow.
 * 
 * Key Features:
 * - Visual form workflow with interactive graph
 * - Form field prefilling from upstream forms or global data
 * - Form submission tracking and value propagation
 * - Real-time updates to form states and mappings
 * 
 * Data Flow:
 * 1. User selects a form node → triggers panel display
 * 2. User configures prefill mappings → opens modal for source selection
 * 3. User submits form → values become available to downstream forms
 * 4. Downstream forms automatically receive prefilled values
 * 
 * State Management:
 * - selectedNodeId: Currently selected form node
 * - modalField: Field being mapped in the modal
 * - submittedValues: Completed form values by node ID
 * 
 * @requires ReactFlowProvider wrapper for ReactFlow functionality
 * @requires useGraphData hook for fetching graph data from API
 */

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
    
    // State for tracking selected node and modal interactions
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [modalField, setModalField] = useState<string | null>(null);
    
    // Store submitted form values by nodeId - enables downstream form prefilling
    const [submittedValues, setSubmittedValues] = useState<Record<string, Record<string, any>>>({});

    // Fetch graph data, nodes, edges from API
    const {
        nodes,
        setNodes,
        onNodesChange,
        edges,
        onEdgesChange,
        graphData,
    } = useGraphData();

    // Resolve currently selected node and its form schema
    const selectedNode = nodes.find(n => n.id === selectedNodeId);
    const selectedFormData = selectedNode?.data;
    const selectedFormSchema = graphData?.forms?.find(
        (form: any) => form.id === selectedFormData?.component_id
    );

    // Calculate upstream form IDs using graph traversal
    const upstreamFormIds = selectedNodeId ? getUpstreamFormIds(selectedNodeId, edges) : [];

    /**
     * Global data values - always available for prefilling
     * These values are system-wide and don't depend on form submissions
     */
    const globalDataValues = {
        user_id: 'user_12345',
        session_id: 'session_67890',
        timestamp: new Date().toISOString(),
        tenant_id: '1',
        current_date: new Date().toLocaleDateString()
    };

    /**
     * Global data form schema - defines the structure of global data fields
     * This appears as "Global Data" in the prefill modal
     */
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

    /**
     * Calculate available upstream forms for prefilling
     * Includes global data + submitted upstream forms only
     * 
     * Filtering logic:
     * 1. Must be upstream in dependency chain (getUpstreamFormIds)
     * 2. Must have been submitted (has values in submittedValues)
     * 3. Global data is always included
     */
    const upstreamForms = graphData
        ? [
            globalDataForm, // Always include global data first
            ...graphData.nodes
                ?.filter((node: any) => upstreamFormIds.includes(node.id))
                .filter((node: any) => {
                    // Only include forms that have been submitted (have submittedValues)
                    return submittedValues[node.id] && Object.keys(submittedValues[node.id]).length > 0;
                })
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
                        dynamic_field_config: form?.dynamic_field_config,
                        // Include submitted values if available
                        submittedValues: submittedValues[node.id] || {}
                    };
                })
        ]
        : [globalDataForm]; // If no graphData, still show global data

    /**
     * Calculate prefilled values for the currently selected form
     * 
     * @returns Object with field keys mapped to their prefilled values
     * 
     * Logic:
     * - For global data mappings: retrieve from globalDataValues
     * - For form mappings: retrieve from submittedValues
     * - User input takes priority over prefilled values
     */
    const getPrefillValues = () => {
        if (!selectedFormData?.input_mapping) return {};

        const prefillValues: Record<string, any> = {};

        Object.entries(selectedFormData.input_mapping).forEach(([fieldKey, mapping]: [string, any]) => {
            if (mapping.node_id === 'global-data') {
                // Use global data - safely access with bracket notation
                const fieldKeyStr = String(mapping.field_key);
                if (fieldKeyStr in globalDataValues) {
                    prefillValues[fieldKey] = (globalDataValues as any)[fieldKeyStr];
                }
            } else {
                // Use submitted values from upstream forms
                const upstreamValues = submittedValues[mapping.node_id];
                if (upstreamValues && mapping.field_key) {
                    prefillValues[fieldKey] = upstreamValues[mapping.field_key];
                }
            }
        });

        return prefillValues;
    };

    /**
     * Handle form submission - store values and mark node as completed
     * 
     * @param nodeId - ID of the form node being submitted
     * @param formValues - Object containing the form field values
     * 
     * Effects:
     * - Stores values in submittedValues state
     * - Marks node as completed in the graph
     * - Makes values available to downstream forms
     */
    const handleFormSubmit = (nodeId: string, formValues: Record<string, any>) => {
        setSubmittedValues(prev => ({
            ...prev,
            [nodeId]: formValues
        }));

        // Mark the node as completed
        setNodes(prevNodes =>
            prevNodes.map(node =>
                node.id === nodeId
                    ? { ...node, data: { ...node.data, isCompleted: true, submittedValues: formValues } }
                    : node
            )
        );
    };

    /**
     * Update field mapping configuration
     * 
     * @param fieldKey - The field being mapped (target field)
     * @param value - Mapping configuration object or null to delete
     * 
     * Value format: { node_id: string, field_key: string }
     * - node_id: Source form node ID (or 'global-data')
     * - field_key: Source field name
     */
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

    /**
     * Handle node click - select form and show configuration panel
     * 
     * @param event - React event object
     * @param node - The clicked node object
     */
    const handleNodeClick = (event: any, node: any) => {
        setModalField(null); // Close any open modal
        setSelectedNodeId(node.id);
    };

    return (
        <ReactFlowProvider>
            <div className="graph-container">
                {/* Main graph visualization */}
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

                {/* Configuration panel - only shown when node is selected with valid schema */}
                {selectedNode && selectedFormSchema?.field_schema?.properties && (
                    <FormPrefillPanel
                        key={selectedNodeId} // Force re-render when node changes
                        selectedNode={selectedNode}
                        formSchema={selectedFormSchema.field_schema}
                        inputMapping={selectedFormData?.input_mapping || {}}
                        prefillValues={getPrefillValues()}
                        onFieldClick={setModalField}
                        onClearMapping={(field) => updateMapping(field, null)}
                        onFormSubmit={(values) => handleFormSubmit(selectedNodeId!, values)}
                        graphData={graphData}
                        upstreamForms={upstreamForms}
                    />
                )}

                {/* Mapping selection modal - shown when user clicks "Set Prefill" */}
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
        </ReactFlowProvider>
    )
}