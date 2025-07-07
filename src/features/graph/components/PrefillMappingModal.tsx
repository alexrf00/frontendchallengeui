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

  useEffect(() => {
    if (!isOpen) {
      setSelectedNodeId('');
      setSelectedFieldKey('');
      setExpandedNodeId('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFormClick = (nodeId: string) => {
    if (expandedNodeId === nodeId) {
      setExpandedNodeId('');
      setSelectedNodeId('');
      setSelectedFieldKey('');
    } else {
      setExpandedNodeId(nodeId);
      setSelectedNodeId(nodeId);
      setSelectedFieldKey('');
    }
  };

  const handleFieldClick = (fieldKey: string, nodeId: string) => {
    if (selectedNodeId === nodeId) {
      setSelectedFieldKey(fieldKey);
    }
  };

  const handleAdd = () => {
    if (selectedNodeId && selectedFieldKey) {
      onConfirm(selectedNodeId, selectedFieldKey);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div style={{ position: 'fixed', top: 0, right: 0, width: '300px', height: '100vh', backgroundColor: 'white', padding: '20px' }}>
        
        <h3>Select Prefill Source</h3>
        
        <div>
          {upstreamForms.length === 0 ? (
            <p>No upstream forms available</p>
          ) : (
            upstreamForms.map(form => {
              const isExpanded = expandedNodeId === form.nodeId;
              const isSelected = selectedNodeId === form.nodeId;
              const fields = Object.keys(form.field_schema?.properties || {});

              return (
                <div key={form.nodeId} style={{ marginBottom: '10px', border: '1px solid #ccc' }}>
                  
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
                            <div>{fieldSchema.title || fieldKey}</div>
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