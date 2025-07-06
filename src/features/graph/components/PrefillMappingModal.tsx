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
  const [selectedNodeId, setSelectedNodeId] = useState('');
  const [selectedFieldKey, setSelectedFieldKey] = useState('');
  const [expandedNodeId, setExpandedNodeId] = useState('');

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedNodeId('');
      setSelectedFieldKey('');
      setExpandedNodeId('');
    }
  }, [isOpen]);

  // Debug logging
  useEffect(() => {
    if (isOpen) {
      console.log('Modal opened with upstream forms:', upstreamForms);
      upstreamForms.forEach((form, index) => {
        console.log(`Available form ${index}:`, {
          nodeId: form.nodeId,
          formId: form.formId,
          name: form.name
        });
      });
    }
  }, [isOpen, upstreamForms]);

  if (!isOpen) return null;

  const handleFormClick = (nodeId: string, nodeName: string) => {
    console.log('Node clicked:', { nodeId, nodeName });
    
    if (expandedNodeId === nodeId) {
      // Collapse if already expanded
      console.log('Collapsing node:', nodeName);
      setExpandedNodeId('');
      setSelectedNodeId('');
      setSelectedFieldKey('');
    } else {
      // Expand and select
      console.log('Expanding and selecting node:', nodeName);
      setExpandedNodeId(nodeId);
      setSelectedNodeId(nodeId);
      setSelectedFieldKey(''); // Reset field selection when changing nodes
    }
  };

  const handleFieldClick = (fieldKey: string, nodeId: string) => {
    console.log('Field clicked:', { fieldKey, nodeId });
    
    // Make sure we're selecting the field for the correct node
    if (selectedNodeId === nodeId) {
      setSelectedFieldKey(fieldKey);
      console.log('Field selected:', fieldKey);
    } else {
      console.log('Field click ignored - node not selected');
    }
  };

  const handleAdd = () => {
    if (selectedNodeId && selectedFieldKey) {
      const selectedForm = upstreamForms.find(f => f.nodeId === selectedNodeId);
      console.log('Adding mapping with detailed info:', { 
        selectedNodeId, 
        selectedFieldKey,
        selectedFormName: selectedForm?.name,
        selectedFormId: selectedForm?.formId,
        selectedFormObject: selectedForm
      });
      onConfirm(selectedNodeId, selectedFieldKey);
    }
  };

  const canAdd = selectedNodeId && selectedFieldKey;

  return (
    <>
      {/* Backdrop */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000
        }}
        onClick={onClose}
      />
      
      {/* Side Panel */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '400px',
          height: '100vh',
          backgroundColor: 'white',
          boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.1)',
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideIn 0.3s ease-out'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#f8f9fa'
        }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
            Select Prefill Source
          </h3>
          <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '14px' }}>
            Choose a form and field to prefill from
          </p>
          {/* Debug info */}
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>
            Selected: {selectedNodeId ? upstreamForms.find(f => f.nodeId === selectedNodeId)?.name : 'None'} 
            {selectedFieldKey && ` → ${selectedFieldKey}`}
          </div>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px'
        }}>
          {upstreamForms.length === 0 ? (
            <div style={{
              textAlign: 'center',
              color: '#666',
              fontSize: '14px',
              marginTop: '40px'
            }}>
              No upstream forms available
            </div>
          ) : (
            <div>
              {upstreamForms.map(form => {
                const isExpanded = expandedNodeId === form.nodeId;
                const isSelected = selectedNodeId === form.nodeId;
                const fields = Object.keys(form.field_schema?.properties || {});

                console.log('Rendering form:', { 
                  nodeId: form.nodeId, 
                  formName: form.name, 
                  isSelected, 
                  isExpanded,
                  selectedNodeId 
                });

                return (
                  <div key={form.nodeId} style={{ marginBottom: '8px' }}>
                    {/* Form Header */}
                    <div
                      onClick={() => handleFormClick(form.nodeId, form.name)}
                      style={{
                        padding: '12px 16px',
                        backgroundColor: isSelected ? '#e3f2fd' : '#f5f5f5',
                        border: `2px solid ${isSelected ? '#2196f3' : 'transparent'}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span style={{
                        fontWeight: '500',
                        color: isSelected ? '#1976d2' : '#333'
                      }}>
                        {form.name} (Node: {form.nodeId?.slice(-8)})
                      </span>
                      <span style={{
                        fontSize: '12px',
                        color: '#666',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease'
                      }}>
                        ▼
                      </span>
                    </div>

                    {/* Fields List */}
                    {isExpanded && (
                      <div style={{
                        marginTop: '4px',
                        backgroundColor: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}>
                        {fields.map(fieldKey => {
                          const fieldSchema = form.field_schema.properties[fieldKey];
                          const isFieldSelected = selectedFieldKey === fieldKey && selectedNodeId === form.nodeId;
                          
                          return (
                            <div
                              key={fieldKey}
                              onClick={() => handleFieldClick(fieldKey, form.nodeId)}
                              style={{
                                padding: '10px 16px',
                                backgroundColor: isFieldSelected ? '#e8f5e8' : 'white',
                                borderBottom: '1px solid #f0f0f0',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s ease'
                              }}
                            >
                              <div style={{
                                fontWeight: isFieldSelected ? '500' : '400',
                                color: isFieldSelected ? '#2e7d32' : '#333',
                                fontSize: '14px'
                              }}>
                                {fieldSchema.title || fieldKey}
                              </div>
                              <div style={{
                                fontSize: '12px',
                                color: '#666',
                                marginTop: '2px'
                              }}>
                                {fieldSchema.avantos_type || fieldSchema.type}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '20px',
          borderTop: '1px solid #e0e0e0',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          gap: '12px'
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid #ddd',
              backgroundColor: 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!canAdd}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              backgroundColor: canAdd ? '#2196f3' : '#ccc',
              color: 'white',
              borderRadius: '6px',
              cursor: canAdd ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s ease'
            }}
          >
            Add Mapping
          </button>
        </div>
      </div>

      {/* <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style> */}
    </>
  );
};