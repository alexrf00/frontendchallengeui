import React, { useState, useEffect } from 'react';

interface PrefillPanelProps {
  selectedNode: any;
  formSchema: any;
  inputMapping: Record<string, any>;
  onFieldClick: (fieldKey: string) => void;
  onClearMapping: (fieldKey: string) => void;
  graphData: any;
  upstreamForms: any[];
}

export const FormPrefillPanel: React.FC<PrefillPanelProps> = ({
  selectedNode,
  formSchema,
  inputMapping,
  onFieldClick,
  onClearMapping,
  graphData,
  upstreamForms,
}) => {
  if (!selectedNode || !formSchema?.properties) return null;

  const fields = Object.entries(formSchema.properties);

  // Debug the display logic
  console.log('FormPrefillPanel - inputMapping:', inputMapping);
  console.log('FormPrefillPanel - upstreamForms:', upstreamForms);

  return (
    <div style={{ padding: 16, borderLeft: '1px solid #ccc' }}>
      <h2>Prefill Mapping for {selectedNode.data.name}</h2>
      <ul>
        {fields.map(([key, field]) => {
          const typedField = field as { title?: string };
          const mapping = inputMapping?.[key];
          
          if (mapping) {
            console.log(`Display logic for ${key}:`, {
              mapping,
              node_id: mapping.node_id,
              form_id: mapping.form_id,
              upstreamForms,
              foundByNodeId: upstreamForms?.find((f: any) => f.nodeId === mapping.node_id),
              foundByFormId: upstreamForms?.find((f: any) => f.formId === mapping.form_id)
            });
          }
          
          // Helper function to get the form name
          const getFormName = (mapping: any) => {
            if (!mapping) return 'Unknown';
            
            // Try to find by node_id first (new format)
            if (mapping.node_id) {
              const foundForm = upstreamForms?.find((f: any) => f.nodeId === mapping.node_id);
              if (foundForm) {
                return foundForm.name;
              }
            }
            
            // Fallback: try to find by form_id (old format)
            if (mapping.form_id) {
              const foundForm = upstreamForms?.find((f: any) => f.formId === mapping.form_id);
              if (foundForm) {
                return foundForm.name;
              }
            }
            
            // Final fallback
            return mapping.node_id || mapping.form_id || 'Unknown';
          };
          
          return (
            <li key={key} style={{ marginBottom: 12 }}>
              <strong>{typedField.title || key}</strong>
              <div>
                {mapping ? (
                  <>
                    {getFormName(mapping)}.{mapping.field_key}
                    <button onClick={() => onClearMapping(key)}>❌</button>
                  </>
                ) : (
                  <button onClick={() => onFieldClick(key)}>Set Prefill</button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};