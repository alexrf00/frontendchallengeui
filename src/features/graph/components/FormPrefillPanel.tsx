/**
 * FormPrefillPanel Component - Configuration panel for form prefill mappings
 * 
 * This panel appears on the right side when a form node is selected. It allows users to:
 * - Configure which upstream form fields should prefill current form fields
 * - View current mapping configurations
 * - Submit forms to make their values available to downstream forms
 * 
 * Features:
 * - Visual mapping display showing source → target relationships
 * - One-click mapping setup via "Set Prefill" buttons
 * - Mapping removal with clear buttons
 * - Form submission to propagate values downstream
 * - Completion status tracking
 * 
 * Integration:
 * - Works with PrefillMappingModal for source selection
 * - Updates parent Graph component state via callbacks
 * - Receives calculated prefill values from parent
 * 
 * State Management:
 * - formValues: User input values (currently used for submission)
 * - Form completion state managed by parent component
 * 
 * @param selectedNode - The currently selected form node
 * @param formSchema - JSON schema defining the form's fields
 * @param inputMapping - Current field mapping configuration
 * @param prefillValues - Calculated prefill values for display
 * @param onFieldClick - Called when user wants to set up a mapping
 * @param onClearMapping - Called when user wants to remove a mapping
 * @param onFormSubmit - Called when form is submitted
 * @param graphData - Complete graph data (for context)
 * @param upstreamForms - Available upstream forms for mapping
 */

import React, { useState } from 'react';

interface PrefillPanelProps {
  selectedNode: any;
  formSchema: any;
  inputMapping: Record<string, any>;
  prefillValues: Record<string, any>;
  onFieldClick: (fieldKey: string) => void;
  onClearMapping: (fieldKey: string) => void;
  onFormSubmit: (values: Record<string, any>) => void;
  graphData: any;
  upstreamForms: any[];
}

export const FormPrefillPanel: React.FC<PrefillPanelProps> = ({
  selectedNode,
  formSchema,
  inputMapping,
  prefillValues,
  onFieldClick,
  onClearMapping,
  onFormSubmit,
  graphData,
  upstreamForms,
}) => {
  // Track user input values for form submission
  // Note: Currently used for submission, could be expanded for actual form inputs
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  // Don't render if no node selected or no schema available
  if (!selectedNode || !formSchema?.properties) return null;

  // Extract field definitions from the form schema
  const fields = Object.entries(formSchema.properties);

  /**
   * Resolve the display name for a mapping source
   * 
   * @param mapping - The mapping configuration object
   * @returns Human-readable name of the source form
   * 
   * Lookup priority:
   * 1. Try to find by node_id (preferred - handles multiple instances)
   * 2. Fallback to form_id (legacy - may have duplicates)
   * 3. Return the raw ID or 'Unknown'
   */
  const getFormName = (mapping: any) => {
    if (!mapping) return 'Unknown';
    
    // Primary lookup by node ID (unique per instance)
    if (mapping.node_id) {
      const foundForm = upstreamForms?.find((f: any) => f.nodeId === mapping.node_id);
      if (foundForm) return foundForm.name;
    }
    
    // Fallback lookup by form ID (may have duplicates)
    if (mapping.form_id) {
      const foundForm = upstreamForms?.find((f: any) => f.formId === mapping.form_id);
      if (foundForm) return foundForm.name;
    }
    
    // Final fallback to raw ID
    return mapping.node_id || mapping.form_id || 'Unknown';
  };

  /**
   * Handle user input changes (for potential form functionality)
   * Currently used for form submission, could be expanded for live form editing
   * 
   * @param fieldKey - The field being updated
   * @param value - The new value
   */
  const handleInputChange = (fieldKey: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [fieldKey]: value
    }));
  };

  /**
   * Handle form submission
   * Combines prefilled values with any user input and submits to parent
   * 
   * Priority: User input > Prefilled values
   * This allows users to override prefilled values if needed
   */
  const handleSubmit = () => {
    // Combine prefilled values with user input (user input takes priority)
    const finalValues = {
      ...prefillValues,
      ...formValues
    };
    onFormSubmit(finalValues);
  };

  /**
   * Get the current value for a field
   * 
   * @param fieldKey - The field to get the value for
   * @returns Current value with priority: user input > prefill > empty
   */
  const getCurrentValue = (fieldKey: string) => {
    // User input takes priority over prefilled values
    return formValues[fieldKey] ?? prefillValues[fieldKey] ?? '';
  };

  // Check if the form has been completed
  const isFormCompleted = selectedNode.data.isCompleted;

  return (
    <div style={{ padding: 16, borderLeft: '1px solid #ccc' }}>
      {/* Form header with completion status */}
      <h2>
        {isFormCompleted ? '✅ ' : ''} 
        {selectedNode.data.name}
        {isFormCompleted ? ' (Completed)' : ''}
      </h2>
      
      {/* Main configuration section */}
      <div style={{ borderTop: '1px solid #ddd', paddingTop: 20 }}>
        <h3>Prefill Mapping Configuration:</h3>
        
        {/* Field mapping list */}
        <ul>
          {fields.map(([key, field]) => {
            const typedField = field as { title?: string };
            const mapping = inputMapping?.[key];
            
            return (
              <li key={key} style={{ marginBottom: 12 }}>
                {/* Field name */}
                <strong>{typedField.title || key}</strong>
                <div>
                  {mapping ? (
                    /* Show current mapping with clear option */
                    <>
                      {getFormName(mapping)}.{mapping.field_key}
                      <button onClick={() => onClearMapping(key)}>❌</button>
                    </>
                  ) : (
                    /* Show setup button for unmapped fields */
                    <button onClick={() => onFieldClick(key)}>Set Prefill</button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        
        {/* Form submission button - only shown for incomplete forms */}
        {!isFormCompleted && (
          <button 
            onClick={() => {
              // Submit form with current prefill values
              // Note: This uses prefillValues - could be expanded to include user form input
              const formData = prefillValues;
              onFormSubmit(formData);
            }}
            style={{ 
              backgroundColor: '#4CAF50', 
              color: 'white', 
              padding: '10px 20px', 
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Submit Form
          </button>
        )}
      </div>
    </div>
  );
};