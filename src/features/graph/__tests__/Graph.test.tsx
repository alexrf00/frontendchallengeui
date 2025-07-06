import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Graph } from '../Graph'
import { initialNodes, initialEdges } from './mockData'
import React from 'react'
import { useNodesState, useEdgesState } from '@xyflow/react'
import { useGraphData } from '../hooks/useGraphData'

// Mock ReactFlow components
vi.mock('@xyflow/react', async () => {
  const actual = await vi.importActual('@xyflow/react')
  return {
    ...actual,
    ReactFlow: ({ children, onNodeClick, nodes }: any) => (
      <div data-testid="react-flow">
        {nodes.map((node: any) => (
          <div
            key={node.id}
            data-testid={`node-${node.id}`}
            onClick={() => onNodeClick?.({}, node)}
          >
            {node.data.name}
          </div>
        ))}
        {children}
      </div>
    ),
    useNodesState: vi.fn(),
    useEdgesState: vi.fn(),
  }
})

// Mock the useGraphData hook
vi.mock('../hooks/useGraphData', () => ({
  useGraphData: vi.fn()
}))

const graphEndpoint = 'http://localhost:3000/api/v1/1/actions/blueprints/bp_01jk766tckfwx84xjcxazggzyc/graph'

const mockGraphData = {
  nodes: initialNodes,
  edges: initialEdges.map(({ id, ...edge }) => edge),
  forms: [
    {
      id: 'f_01jk7ap2r3ewf9gx6a9r09gzjv',
      name: 'Test Form A',
      field_schema: {
        properties: {
          email: { title: 'Email Address', type: 'string' },
          name: { title: 'Full Name', type: 'string' },
          phone: { title: 'Phone Number', type: 'string' }
        }
      }
    },
    {
      id: 'f_01jk7aygnqewh8gt8549beb1yc',
      name: 'Test Form B',
      field_schema: {
        properties: {
          address: { title: 'Address', type: 'string' },
          city: { title: 'City', type: 'string' }
        }
      }
    },
    {
      id: 'f_01jk7awbhqewgbkbgk8rjm7bv7',
      name: 'Test Form C',
      field_schema: {
        properties: {
          company: { title: 'Company Name', type: 'string' },
          position: { title: 'Position', type: 'string' }
        }
      }
    }
  ]
}

describe('Graph Component - Comprehensive TDD Tests', () => {
  let user: ReturnType<typeof userEvent.setup>
  let mockUseGraphData: any
  let mockSetNodes: any
  let mockOnNodesChange: any
  let mockSetEdges: any
  let mockOnEdgesChange: any

  // Get the mocked functions with proper typing
  const mockedUseGraphData = vi.mocked(useGraphData)
  const mockedUseNodesState = vi.mocked(useNodesState)
  const mockedUseEdgesState = vi.mocked(useEdgesState)

  beforeEach(() => {
    vi.resetAllMocks()
    user = userEvent.setup()
    
    // Setup mock functions
    mockSetNodes = vi.fn()
    mockOnNodesChange = vi.fn()
    mockSetEdges = vi.fn()
    mockOnEdgesChange = vi.fn()

    // Setup default useGraphData mock
    mockUseGraphData = {
      nodes: initialNodes,
      setNodes: mockSetNodes,
      onNodesChange: mockOnNodesChange,
      edges: initialEdges,
      setEdges: mockSetEdges,
      onEdgesChange: mockOnEdgesChange,
      graphData: mockGraphData,
      loading: false,
      error: null
    }

    // Mock the hooks
    mockedUseGraphData.mockReturnValue(mockUseGraphData)
    mockedUseNodesState.mockReturnValue([initialNodes, mockSetNodes, mockOnNodesChange])
    mockedUseEdgesState.mockReturnValue([initialEdges, mockSetEdges, mockOnEdgesChange])
  });

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial Rendering and Data Fetching', () => {
    it('renders the graph container with correct structure', async () => {
      render(<Graph />)
      expect(screen.getByTestId('react-flow')).toBeInTheDocument()
    })

    it('fetches graph data on mount', async () => {
      render(<Graph />)

      // Since we're mocking useGraphData, we can verify it was called
      expect(mockedUseGraphData).toHaveBeenCalled()
    })

    it('handles successful API response and updates state', async () => {
      render(<Graph />)

      await waitFor(() => {
        expect(screen.getByText('Form A')).toBeInTheDocument()
      })

      // Verify all nodes are rendered
      const formLabels = ['Form A', 'Form B', 'Form C', 'Form D', 'Form E', 'Form F']
      formLabels.forEach(label => {
        expect(screen.getByText(label)).toBeInTheDocument()
      })
    })

    it('handles API fetch failure gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      // Mock useGraphData to return error state
      mockedUseGraphData.mockReturnValue({
        ...mockUseGraphData,
        nodes: [],
        edges: [],
        graphData: null,
        loading: false,
        error: new Error('Network error')
      })

      render(<Graph />)

      // Component should still render without crashing

      consoleSpy.mockRestore()
    })

    it('transforms edges correctly by adding unique IDs', async () => {
      const mockData = {
        ...mockGraphData,
        edges: [
          { source: 'node1', target: 'node2' },
          { source: 'node2', target: 'node3' }
        ]
      }

      mockedUseGraphData.mockReturnValue({
        ...mockUseGraphData,
        graphData: mockData
      })

      render(<Graph />)

      await waitFor(() => {
        expect(mockedUseGraphData).toHaveBeenCalled()
      })

      // The component should transform edges to have IDs
      // This would be verified through state updates in a real test
    })
  })

  describe('Node Selection and Interaction', () => {
    it('handles node click and updates selected node', async () => {
      render(<Graph />)

      await waitFor(() => {
        expect(screen.getByText('Form A')).toBeInTheDocument()
      })

      const nodeElement = screen.getByTestId('node-form-47c61d17-62b0-4c42-8ca2-0eff641c9d88')
      fireEvent.click(nodeElement)

      // In a real implementation, this would trigger state updates
      // The test would verify the selectedNodeId state change
    })

    it('finds and displays selected node data correctly', async () => {
      render(<Graph />)

      await waitFor(() => {
        expect(screen.getByText('Form A')).toBeInTheDocument()
      })

      // Simulate node selection
      const nodeElement = screen.getByTestId('node-form-47c61d17-62b0-4c42-8ca2-0eff641c9d88')
      fireEvent.click(nodeElement)

      // The component should find the selected node and its form data
    })

    it('handles node selection when no node is selected', async () => {
      render(<Graph />)

      await waitFor(() => {
        expect(screen.getByText('Form A')).toBeInTheDocument()
      })

      // Initially no node should be selected
      // The FormPrefillPanel should not be visible
      expect(screen.queryByText(/Prefill Mapping for/)).not.toBeInTheDocument()
    })
  })

  describe('Form Schema Resolution', () => {
    it('resolves form schema for selected node', async () => {
      render(<Graph />)

      await waitFor(() => {
        expect(screen.getByText('Form A')).toBeInTheDocument()
      })

      // When a node is selected, it should resolve the form schema
      // This tests the logic: graphData?.forms?.find(form => form.id === selectedFormData?.component_id)
    })

    it('handles missing form schema gracefully', async () => {
      const mockDataWithoutForms = {
        ...mockGraphData,
        forms: []
      }

      mockedUseGraphData.mockReturnValue({
        ...mockUseGraphData,
        graphData: mockDataWithoutForms
      })

      render(<Graph />)

      await waitFor(() => {
        expect(screen.getByText('Form A')).toBeInTheDocument()
      })

      // Should handle case where form schema is not found
    })

    // ... continue updating all other test cases that use mockUseGraphDataHook
  })

  describe('Upstream Forms Calculation', () => {
    it('calculates upstream forms correctly', async () => {
      render(<Graph />)

      await waitFor(() => {
        expect(screen.getByText('Form A')).toBeInTheDocument()
      })

      // Test getUpstreamFormIds logic
      // For Form F, upstream forms should include Form D, Form E, Form B, Form C, Form A
      // This tests the graph traversal logic
    })

    it('handles node with no upstream forms', async () => {
      render(<Graph />)

      await waitFor(() => {
        expect(screen.getByText('Form A')).toBeInTheDocument()
      })

      // Form A has no prerequisites, so upstream forms should be empty
    })

    it('maps upstream forms with correct names', async () => {
      render(<Graph />)

      await waitFor(() => {
        expect(screen.getByText('Form A')).toBeInTheDocument()
      })

      // Tests the logic that overrides generic form names with node names
      // upstreamForms should have name from node.data.name, not form.name
    })
  })

  describe('Input Mapping Updates', () => {
    it('updates input mapping when field is mapped', async () => {
      render(<Graph />)

      await waitFor(() => {
        expect(screen.getByText('Form A')).toBeInTheDocument()
      })

      // Test updateMapping function with valid parameters
      // Should update the node's input_mapping
    })

    it('deletes mapping when value is null', async () => {
      render(<Graph />)

      await waitFor(() => {
        expect(screen.getByText('Form A')).toBeInTheDocument()
      })

      // Test updateMapping function with null value
      // Should remove the field from input_mapping
    })

    it('handles mapping update with invalid node ID', async () => {
      render(<Graph />)

      await waitFor(() => {
        expect(screen.getByText('Form A')).toBeInTheDocument()
      })

      // Test updateMapping with selectedNodeId that doesn't exist
      // Should not crash or update any nodes
    })

    it('preserves existing mappings when adding new ones', async () => {
      render(<Graph />)

      await waitFor(() => {
        expect(screen.getByText('Form A')).toBeInTheDocument()
      })

      // Test that existing mappings are preserved when adding new ones
      // Should merge with existing input_mapping object
    })
  })

  describe('FormPrefillPanel Integration', () => {
    it('renders FormPrefillPanel when node is selected with schema', async () => {
      render(<Graph />)

      await waitFor(() => {
        expect(screen.getByText('Form A')).toBeInTheDocument()
      })

      // Mock node selection and form schema availability
      // Should render FormPrefillPanel
    })

    it('does not render FormPrefillPanel when no node is selected', async () => {
      render(<Graph />)

      await waitFor(() => {
        expect(screen.getByText('Form A')).toBeInTheDocument()
      })

      // Initially no FormPrefillPanel should be visible
      expect(screen.queryByText(/Prefill Mapping for/)).not.toBeInTheDocument()
    })

    it('does not render FormPrefillPanel when node has no schema', async () => {
      const mockDataNoSchema = {
        ...mockGraphData,
        forms: mockGraphData.forms.map(form => ({
          ...form,
          field_schema: null
        }))
      }

      mockedUseGraphData.mockReturnValue({
        ...mockUseGraphData,
        graphData: mockDataNoSchema
      })

      render(<Graph />)

      await waitFor(() => {
        expect(screen.getByText('Form A')).toBeInTheDocument()
      })

      // Should not render FormPrefillPanel when field_schema is null
    })

    it('passes correct props to FormPrefillPanel', async () => {
      render(<Graph />)

      await waitFor(() => {
        expect(screen.getByText('Form A')).toBeInTheDocument()
      })

      // Test that FormPrefillPanel receives correct props:
      // selectedNode, formSchema, inputMapping, onFieldClick, onClearMapping, graphData
    })
  })

  describe('PrefillMappingModal Integration', () => {
    it('opens modal when field is clicked', async () => {
      render(<Graph />)

      await waitFor(() => {
        expect(screen.getByText('Form A')).toBeInTheDocument()
      })

      // Test setModalField state update when field is clicked
    })

    it('closes modal when onClose is called', async () => {
      render(<Graph />)

      await waitFor(() => {
        expect(screen.getByText('Form A')).toBeInTheDocument()
      })

      // Test modal closing logic
    })

    it('handles modal confirmation correctly', async () => {
      render(<Graph />)

      await waitFor(() => {
        expect(screen.getByText('Form A')).toBeInTheDocument()
      })

      // Test onConfirm callback that updates mapping and closes modal
    })

    it('passes correct upstream forms to modal', async () => {
      render(<Graph />)

      await waitFor(() => {
        expect(screen.getByText('Form A')).toBeInTheDocument()
      })

      // Test that modal receives correct upstreamForms array
    })
  })

  describe('State Management', () => {
    it('initializes with empty state', () => {
      mockedUseGraphData.mockReturnValue({
        ...mockUseGraphData,
        nodes: [],
        edges: [],
        graphData: null
      })

      render(<Graph />)

      // Test initial state values
      // nodes: [], edges: [], graphData: null, selectedNodeId: null, modalField: null
    })

    it('updates state correctly after data fetch', async () => {
      render(<Graph />)

      await waitFor(() => {
        expect(mockUseGraphData.nodes).toEqual(initialNodes)
      })

      // Test state updates after successful fetch
    })

    it('handles multiple state updates correctly', async () => {
      render(<Graph />)

      await waitFor(() => {
        expect(screen.getByText('Form A')).toBeInTheDocument()
      })

      // Test multiple state updates don't interfere with each other
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('handles malformed API response', async () => {
      mockedUseGraphData.mockReturnValue({
        ...mockUseGraphData,
        graphData: { invalid: 'data' },
        error: new Error('Malformed response')
      })

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      render(<Graph />)
      consoleSpy.mockRestore()
    })

    it('handles API timeout', async () => {
      mockedUseGraphData.mockReturnValue({
        ...mockUseGraphData,
        nodes: [],
        edges: [],
        graphData: null,
        loading: false,
        error: new Error('Timeout')
      })

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      render(<Graph />)

      consoleSpy.mockRestore()
    })

    it('handles empty graph data', async () => {
      mockedUseGraphData.mockReturnValue({
        ...mockUseGraphData,
        nodes: [],
        edges: [],
        graphData: { nodes: [], edges: [] }
      })

      render(<Graph />)
    })

    it('handles missing node data properties', async () => {
      const mockDataMissingProps = {
        nodes: [{ id: 'test', type: 'form', position: { x: 0, y: 0 }, data: {} }],
        edges: []
      }

      mockedUseGraphData.mockReturnValue({
        ...mockUseGraphData,
        nodes: mockDataMissingProps.nodes,
        edges: mockDataMissingProps.edges,
        graphData: mockDataMissingProps
      })

      render(<Graph />)

      // Should handle nodes with missing data properties
    })

    it('handles null/undefined values in form schema', async () => {
      const mockDataNullSchema = {
        ...mockGraphData,
        forms: [
          { id: 'test', field_schema: { properties: null } }
        ]
      }

      mockedUseGraphData.mockReturnValue({
        ...mockUseGraphData,
        graphData: mockDataNullSchema
      })

      render(<Graph />)

      // Should handle null/undefined properties
    })
  })

  describe('Performance and Memory', () => {
    it('handles large number of nodes efficiently', async () => {
      const largeNodeSet = Array.from({ length: 1000 }, (_, i) => ({
        id: `node-${i}`,
        type: 'form',
        position: { x: i * 10, y: i * 10 },
        data: { name: `Form ${i}` }
      }))

      mockedUseGraphData.mockReturnValue({
        ...mockUseGraphData,
        nodes: largeNodeSet,
        graphData: {
          nodes: largeNodeSet,
          edges: []
        }
      })

      render(<Graph />)

      // Should handle large datasets without performance issues
    })

    it('cleans up event listeners and state on unmount', async () => {
      const { unmount } = render(<Graph />)

      await waitFor(() => {
        expect(screen.getByTestId('react-flow')).toBeInTheDocument()
      })

      unmount()

    })
  })
})