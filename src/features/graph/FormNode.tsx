import { Handle, Position } from '@xyflow/react';

export const FormNode = ({ data }: any) => {
  return (
    <div className="form-node">
      <strong>{data?.name || 'Unnamed Form'}</strong>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};
