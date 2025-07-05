import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';



export const FormNode = ({ data }: NodeProps) => {
  const typedData = data as { name?: string };

  return (
    <div className="form-node">
      <strong>{typedData.name || 'Unnamed Form'}</strong>
      <Handle
        type="target"
        position={Position.Top}
        onClick={(e) => e.stopPropagation()} // prevents blocking parent click
      />
      <Handle
        type="source"
        position={Position.Bottom}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};
