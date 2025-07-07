/**
 * FormNode Component - Individual form node in the ReactFlow graph
 * 
 * This component represents a single form in the workflow graph. Each node displays
 * the form name and provides connection handles for creating dependencies between forms.
 * 
 * Features:
 * - Displays form name with fallback for unnamed forms
 * - Provides connection handles for graph relationships
 * - Prevents handle clicks from interfering with node selection
 * - Integrates with ReactFlow's node system
 * 
 * Graph Integration:
 * - Target handle (top): Receives connections from upstream forms
 * - Source handle (bottom): Creates connections to downstream forms
 * - Click handling: Allows node selection without handle interference
 * 
 * Styling:
 * - Uses 'form-node' CSS class for custom styling
 * - ReactFlow handles positioning and dragging automatically
 * 
 * Data Flow:
 * - Receives node data through ReactFlow's NodeProps
 * - Form name comes from data.name property
 * - Node selection handled by parent Graph component
 * 
 * @param data - Node data object containing form information
 * @param data.name - Display name for the form (optional)
 */

import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';

export const FormNode = ({ data }: NodeProps) => {
  // Type the data object to access form-specific properties
  const typedData = data as { name?: string };

  return (
    <div className="form-node">
      {/* Form name display with fallback for missing names */}
      <strong>{typedData.name || 'Unnamed Form'}</strong>
      
      {/* 
        Target handle - allows incoming connections from upstream forms
        Position: Top of the node
        Click prevention: Stops event bubbling to prevent interference with node clicks
      */}
      <Handle
        type="target"
        position={Position.Top}
        onClick={(e) => e.stopPropagation()} // prevents blocking parent click
      />
      
      {/* 
        Source handle - allows outgoing connections to downstream forms
        Position: Bottom of the node
        Click prevention: Stops event bubbling to prevent interference with node clicks
      */}
      <Handle
        type="source"
        position={Position.Bottom}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};