import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FormNode } from '../components/FormNode'
import type { NodeProps } from '@xyflow/react'

vi.mock('@xyflow/react', () => ({
  Handle: ({ children, onClick, ...props }: any) => (
    <div data-testid={`handle-${props.type}-${props.position}`} onClick={onClick}>
      {children}
    </div>
  ),
  Position: {
    Top: 'top',
    Bottom: 'bottom',
    Left: 'left',
    Right: 'right',
  },
}))

describe('FormNode', () => {
const mockNodeProps: NodeProps = {
  id: 'test-node',
  type: 'form',
  data: { name: 'Test Form' },
  selected: false,
  isConnectable: true,
  zIndex: 1,
  dragging: false,
  selectable: true,
  deletable: true,
  draggable: true,
  positionAbsoluteX: 0,
  positionAbsoluteY: 0,
}
  it('renders form name correctly', () => {
    render(<FormNode {...mockNodeProps} />)
    expect(screen.getByText('Test Form')).toBeInTheDocument()
  })

  it('renders "Unnamed Form" when name is not provided', () => {
    const propsWithoutName = {
      ...mockNodeProps,
      data: {}
    }
    render(<FormNode {...propsWithoutName} />)
    expect(screen.getByText('Unnamed Form')).toBeInTheDocument()
  })

  it('renders "Unnamed Form" when name is empty string', () => {
    const propsWithEmptyName = {
      ...mockNodeProps,
      data: { name: '' }
    }
    render(<FormNode {...propsWithEmptyName} />)
    expect(screen.getByText('Unnamed Form')).toBeInTheDocument()
  })

  it('renders "Unnamed Form" when name is undefined', () => {
    const propsWithUndefinedName = {
      ...mockNodeProps,
      data: { name: undefined }
    }
    render(<FormNode {...propsWithUndefinedName} />)
    expect(screen.getByText('Unnamed Form')).toBeInTheDocument()
  })

})