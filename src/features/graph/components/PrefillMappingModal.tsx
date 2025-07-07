/**
 * PrefillMappingModal Component - Modal interface for selecting prefill sources
 * 
 * This modal allows users to select which upstream form and field to use
 * as a prefill source for a target field. It displays available forms in
 * an expandable list with their fields.
 * 
 * Features:
 * - Expandable form list showing only submitted upstream forms + global data
 * - Field selection within each form
 * - Visual feedback for selected items
 * - Form validation before confirming mapping
 * 
 * Usage Flow:
 * 1. User clicks "Set Prefill" button → modal opens
 * 2. User clicks on a form → form expands to show fields
 * 3. User clicks on a field → field gets selected
 * 4. User clicks "Add Mapping" → onConfirm called with selection
 * 
 * State Management:
 * - selectedNodeId: The form node currently selected
 * - selectedFieldKey: The field within the selected form
 * - expandedNodeId: Which form is currently expanded
 * 
 * @param isOpen - Controls modal visibility
 * @param onClose - Called when modal should be closed
 * @param upstreamForms - Array of available forms (submitted upstream + global data)
 * @param onConfirm - Called when user confirms selection (sourceNodeId, sourceField)
 */

import React, { useState, useEffect } from 'react';

interface PrefillMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  upstreamForms: any[];
  onConfirm: (sourceNodeId: string, sourceField: string) => void;
}

export const PrefillMappingModal: React.FC<PrefillMappingModalProps> = ({
  isOpen,
  onClose,
  upstreamForms,
  onConfirm,
}) => {
  // Track which form node is selected for mapping
  const [selectedNodeId, setSelectedNodeId] = useState('');
  
  // Track which field within the selected form is chosen
  const [selectedFieldKey, setSelectedFieldKey] = useState('');
  
  // Track which form is currently expanded to show its fields
  const [expandedNodeId, setExpandedNodeId] = useState('');

  /**
   * Reset all selection state when modal closes
   * Ensures clean state for next modal opening
   */
  useEffect(() => {
    if (!isOpen) {
      setSelectedNodeId('');
      setSelectedFieldKey('');
      setExpandedNodeId('');
    }
  }, [isOpen]);

  // Don't render anything when modal is closed
  if (!isOpen) return null;

  /**
   * Handle form header click - expand/collapse and select form
   * 
   * @param nodeId - ID of the form node being clicked
   * 
   * Behavior:
   * - If form is already expanded: collapse it and clear selections
   * - If form is not expanded: expand it, select it, clear field selection
   */
  const handleFormClick = (nodeId: string) => {
    if (expandedNodeId === nodeId) {
      // Collapse if already expanded
      setExpandedNodeId('');
      setSelectedNodeId('');
      setSelectedFieldKey('');
    } else {
      // Expand and select this form
      setExpandedNodeId(nodeId);
      setSelectedNodeId(nodeId);
      setSelectedFieldKey(''); // Reset field selection when changing forms
    }
  };

  /**
   * Handle field click within an expanded form
   * 
   * @param fieldKey - Key of the field being selected
   * @param nodeId - ID of the form containing this field
   * 
   * Security: Only allows field selection if the form is currently selected
   */
  const handleFieldClick = (fieldKey: string, nodeId: string) => {
    if (selectedNodeId === nodeId) {
      setSelectedFieldKey(fieldKey);
    }
  };

  /**
   * Confirm the mapping selection and close modal
   * 
   * Validation: Only proceeds if both form and field are selected
   * Calls onConfirm with the selected source node ID and field key
   */
  const handleAdd = () => {
    if (selectedNodeId && selectedFieldKey) {
      onConfirm(selectedNodeId, selectedFieldKey);
    }
  };

  return (
    /* Modal backdrop - covers entire screen with semi-transparent overlay */
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}>
      
      {/* Modal content panel - slides in from right side */}
      <div style={{ position: 'fixed', top: 0, right: 0, width: '300px', height: '100vh', backgroundColor: 'white', padding: '20px' }}>
        
        <h3>Select Prefill Source</h3>
        
        <div>
          {upstreamForms.length === 0 ? (
            /* Empty state - shown when no upstream forms are available */
            <p>No upstream forms available</p>
          ) : (
            /* Render list of available forms */
            upstreamForms.map(form => {
              const isExpanded = expandedNodeId === form.nodeId;
              const isSelected = selectedNodeId === form.nodeId;
              const fields = Object.keys(form.field_schema?.properties || {});

              return (
                <div key={form.nodeId} style={{ marginBottom: '10px', border: '1px solid #ccc' }}>
                  
                  {/* Form header - clickable to expand/collapse */}
                  <div 
                    onClick={() => handleFormClick(form.nodeId)}
                    style={{ 
                      padding: '10px', 
                      backgroundColor: isSelected ? '#e0e0e0' : '#f5f5f5',
                      cursor: 'pointer'
                    }}
                  >
                    {form.name} {isExpanded ? '▼' : '▶'}
                  </div>

                  {/* Fields list - only shown when form is expanded */}
                  {isExpanded && (
                    <div style={{ border: '1px solid #ddd' }}>
                      {fields.map(fieldKey => {
                        const fieldSchema = form.field_schema.properties[fieldKey];
                        const isFieldSelected = selectedFieldKey === fieldKey && selectedNodeId === form.nodeId;
                        
                        return (
                          <div
                            key={fieldKey}
                            onClick={() => handleFieldClick(fieldKey, form.nodeId)}
                            style={{
                              padding: '8px',
                              backgroundColor: isFieldSelected ? '#d0d0d0' : 'white',
                              borderBottom: '1px solid #eee',
                              cursor: 'pointer'
                            }}
                          >
                            {/* Field display name */}
                            <div>{fieldSchema.title || fieldKey}</div>
                            {/* Field type information */}
                            <small>{fieldSchema.avantos_type || fieldSchema.type}</small>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal action buttons */}
        <div style={{ marginTop: '20px' }}>
          <button onClick={onClose}>Cancel</button>
          <button 
            onClick={handleAdd} 
            disabled={!selectedNodeId || !selectedFieldKey}
            style={{ marginLeft: '10px' }}
          >
            Add Mapping
          </button>
        </div>
        
      </div>
    </div>
  );
};