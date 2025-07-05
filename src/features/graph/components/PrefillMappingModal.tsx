import React, { useState } from 'react';

interface PrefillMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  upstreamForms: any[];
  onConfirm: (sourceFormId: string, sourceField: string) => void;
}

export const PrefillMappingModal: React.FC<PrefillMappingModalProps> = ({
  isOpen,
  onClose,
  upstreamForms,
  onConfirm,
}) => {
  const [formId, setFormId] = useState('');
  const [fieldKey, setFieldKey] = useState('');

  if (!isOpen) return null;

  const selectedForm = upstreamForms.find(f => f.id === formId);
  const fields = Object.keys(selectedForm?.field_schema?.properties || {});

  return (
    <div style={{ position: 'fixed', top: 100, left: '30%', padding: 24, background: 'white', border: '1px solid #ccc' }}>
      <h3>Select Prefill Source</h3>
      <select value={formId} onChange={e => setFormId(e.target.value)}>
        <option value="">Select Form</option>
        {upstreamForms.map(form => (
          <option key={form.id} value={form.id}>{form.name}</option>
        ))}
      </select>

      {formId && (
        <select value={fieldKey} onChange={e => setFieldKey(e.target.value)}>
          <option value="">Select Field</option>
          {fields.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      )}

      <button onClick={() => onConfirm(formId, fieldKey)} disabled={!formId || !fieldKey}>Confirm</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};
