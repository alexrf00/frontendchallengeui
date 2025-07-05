import React from 'react';

interface PrefillPanelProps {
  selectedNode: any;
  formSchema: any;
  inputMapping: Record<string, any>;
  onFieldClick: (fieldKey: string) => void;
  onClearMapping: (fieldKey: string) => void;
}

export const FormPrefillPanel: React.FC<PrefillPanelProps> = ({
  selectedNode,
  formSchema,
  inputMapping,
  onFieldClick,
  onClearMapping,
}) => {
  if (!selectedNode || !formSchema?.properties) return null;

  const fields = Object.entries(formSchema.properties);

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
                    <span>
                      Prefilled from: {mapping.form_id} → {mapping.field_key}
                    </span>
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