import React from 'react';

interface PrefillPanelProps {
  selectedNode: any;
  formSchema: any;
  inputMapping: Record<string, any>;
  onFieldClick: (fieldKey: string) => void;
  onClearMapping: (fieldKey: string) => void;
  upstreamForms: any[];
}

export const FormPrefillPanel: React.FC<PrefillPanelProps> = ({
  selectedNode,
  formSchema,
  inputMapping,
  onFieldClick,
  onClearMapping,
  upstreamForms,
}) => {
  if (!selectedNode || !formSchema?.properties) return null;

  const fields = Object.entries(formSchema.properties);

  const getFormName = (mapping: any) => {
    if (!mapping) return 'Unknown';
    
    if (mapping.node_id) {
      const foundForm = upstreamForms?.find((f: any) => f.nodeId === mapping.node_id);
      if (foundForm) return foundForm.name;
    }
    
    if (mapping.form_id) {
      const foundForm = upstreamForms?.find((f: any) => f.formId === mapping.form_id);
      if (foundForm) return foundForm.name;
    }
    
    return mapping.node_id || mapping.form_id || 'Unknown';
  };

  return (
    <div style={{ padding: 16, borderLeft: '1px solid #ccc' }}>
      <h2>Prefill Mapping for {selectedNode.data.name}</h2>
      <ul>
        {fields.map(([key, field]) => {
          const typedField = field as { title?: string };
          const mapping = inputMapping?.[key];
          
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