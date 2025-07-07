# Form Workflow Graph with Prefill System

A React-based form workflow management system that allows users to create complex form dependencies with automatic field prefilling capabilities.

## Features

### 🔄 **Workflow Management**
- Visual graph representation of form workflows using ReactFlow
- Interactive nodes representing different forms in the workflow
- Clear dependency relationships between forms

### 📋 **Form Prefilling System**
- **Automatic Field Prefilling**: Map fields from upstream forms to downstream forms
- **Global Data Integration**: Access to system-wide data (user_id, session_id, timestamps, etc.)
- **Value Inheritance**: Submitted form values automatically become available to dependent forms
- **Smart Filtering**: Only submitted forms appear as prefill sources

### ✅ **Form Submission Tracking**
- Visual indicators for completed forms (✅)
- Form completion status tracking
- Prevention of duplicate submissions

### 🎯 **Interactive UI**
- **Side Panel**: Configure prefill mappings for selected forms
- **Modal Interface**: Easy selection of prefill sources and fields
- **Real-time Updates**: Immediate visual feedback on form states

## Project Structure

```
src/
├── components/
│   ├── FormNode.tsx              # Individual form node component
│   ├── FormPrefillPanel.tsx      # Side panel for mapping configuration
│   └── PrefillMappingModal.tsx   # Modal for selecting prefill sources
├── hooks/
│   └── useGraphData.ts           # Custom hook for fetching graph data
├── utils/
│   └── getUpstreamFormIds.ts     # Utility to find upstream form dependencies
├── Graph.tsx                     # Main graph component
└── graph.style.css               # Styling for the graph
```

## How It Works

### 1. **Form Dependencies**
Forms are connected in a directed graph where:
- **Upstream forms** must be completed before downstream forms can access their data
- **Dependencies** are defined by edges in the graph structure
- **Parallel forms** can be completed independently

### 2. **Prefill Mapping Process**
1. **Select a form** by clicking on a node in the graph
2. **Configure mappings** using the side panel
3. **Choose prefill sources** from the modal (Global Data + submitted upstream forms)
4. **Map specific fields** from source to target
5. **Submit the form** to make its values available downstream

### 3. **Data Flow**
```
Global Data ──┐
              ├── Form A ──── Form D ──── Form F
Form A ───────┤                    ┌──── 
              └── Form B ──── Form E ──┘
Form B ───────── Form C ──────────────┘
```

### 4. **Prefill Sources**
- **Global Data**: Always available system data
  - User ID
  - Session ID
  - Current Timestamp
  - Tenant ID
  - Current Date
- **Submitted Upstream Forms**: Only forms that have been completed and submitted

## Key Components

### Graph.tsx
Main orchestrator component that:
- Manages form states and submissions
- Handles prefill value calculations
- Coordinates between components

### FormPrefillPanel.tsx
Side panel that provides:
- Form selection and status display
- Prefill mapping configuration interface
- Form submission capability

### PrefillMappingModal.tsx
Modal interface for:
- Selecting prefill sources (forms/global data)
- Choosing specific fields to map
- Expandable form/field selection

### FormNode.tsx
Individual graph nodes that:
- Display form names
- Show completion status
- Handle click interactions

## Usage Example

1. **Start with Form A**
   - Click on Form A node
   - Configure any global data mappings if needed
   - Submit Form A

2. **Move to Form B**
   - Click on Form B node
   - Click "Set Prefill" for any field
   - Select "Form A" from the modal
   - Choose the field to map from Form A
   - Submit Form B

3. **Continue to Form C**
   - Now has access to both Form A and Form B data
   - Can create complex field mappings
   - Submit when complete

## Data Structure

### Form Mapping
```javascript
{
  field_name: {
    node_id: "form-uuid-123",     // Source form node ID
    field_key: "source_field"     // Source field name
  }
}
```

### Submitted Values
```javascript
{
  "form-uuid-123": {
    "field1": "value1",
    "field2": "value2"
  }
}
```

## Testing

The project includes comprehensive test coverage using **Vitest** and **React Testing Library**.

### Test Suite Overview

```bash
npm run test
```

### Test Coverage

- **50 total tests** across 3 test files
- **Components**: FormNode, Graph, PrefillMappingModal, FormPrefillPanel
- **Utilities**: getUpstreamFormIds graph traversal logic
- **Integration**: Full component interaction workflows

### Test Files

#### `FormNode.test.tsx`
- **4 tests** covering form node rendering
- Name display with various data states
- Fallback behavior for missing/empty names
- Handle positioning and click prevention

#### `getUpstreamFormIds.test.ts` 
- **11 tests** covering graph traversal logic
- Simple upstream relationships
- Complex multi-path dependencies
- Edge cases: circular dependencies, empty graphs, deep chains
- Performance testing with 100+ node chains

#### `Graph.test.tsx`
- **35 comprehensive tests** covering the main component
- **Initial Rendering**: API data fetching, error handling
- **Node Interaction**: Selection, click handling, state updates
- **Form Schema Resolution**: Schema mapping, missing data handling
- **Upstream Calculation**: Dependency chain calculation
- **Mapping Updates**: Field mapping CRUD operations
- **Component Integration**: Panel and modal interactions
- **State Management**: Initialization, updates, persistence
- **Error Handling**: Malformed data, API failures, edge cases
- **Performance**: Large dataset handling, memory cleanup

### Testing Strategy

#### **Unit Tests**
- Individual component behavior
- Utility function logic
- Error boundary testing

#### **Integration Tests**
- Component interaction workflows
- State management across components
- Event handling and data flow

#### **Mocking Strategy**
```typescript
// ReactFlow components mocked for testing
vi.mock('@xyflow/react', () => ({
  ReactFlow: ({ children, onNodeClick, nodes }: any) => (
    <div data-testid="react-flow">
      {nodes.map((node: any) => (
        <div key={node.id} data-testid={`node-${node.id}`}>
          {node.data.name}
        </div>
      ))}
    </div>
  ),
  ReactFlowProvider: ({ children }: any) => <div>{children}</div>
}))

// API hooks mocked for controlled testing
vi.mock('../hooks/useGraphData')
```

### Test Scenarios

#### **Form Workflow Testing**
1. **Node Selection** → Panel appearance → Mapping configuration
2. **Field Mapping** → Modal opening → Source selection → Confirmation
3. **Form Submission** → Value storage → Downstream availability
4. **Error Handling** → Graceful degradation → User feedback

#### **Data Flow Testing**
- Upstream form calculation with complex dependencies
- Prefill value resolution from multiple sources
- Global data integration
- Value priority handling (user input > prefill > default)

#### **Edge Case Coverage**
- Malformed API responses
- Missing form schemas
- Circular dependencies
- Large datasets (1000+ nodes)
- Empty states and null values

### Running Tests

```bash
# Run all tests
npm run test

```

### Test Configuration

#### **Setup** (`setupTests.ts`)
```typescript
import '@testing-library/jest-dom'

// Mock ResizeObserver for ReactFlow compatibility
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
```

#### **Dependencies**
- **Vitest**: Fast unit test framework
- **React Testing Library**: Component testing utilities
- **@testing-library/jest-dom**: Custom Jest matchers
- **@testing-library/user-event**: User interaction simulation

### Mock Data

#### **Test Data Structure**
```typescript
// Sample test nodes (mockData.ts)
export interface BlueprintNode extends XFNode {
  data: {
    component_key: string
    name: string
    prerequisites: string[]
    input_mapping: Record<string, any>
  }
}

// Complete form workflow graph for testing
const mockGraphData = {
  nodes: [/* Form A, B, C, D, E, F */],
  edges: [/* Dependency relationships */],
  forms: [/* Form schemas with field definitions */]
}
```

### Performance Testing

#### **Large Dataset Handling**
- Tests with 1000+ nodes verify scalability
- Memory cleanup verification on component unmount
- Efficient graph traversal algorithms

#### **Stress Testing Scenarios**
- Deep dependency chains (100+ levels)
- Complex branching workflows
- Multiple form instance handling
- Rapid state updates

### Continuous Integration

Tests run automatically on:
- Code commits
- Pull requests
- Deployment pipeline

### Test Quality Metrics

- **High Coverage**: All critical paths tested
- **Fast Execution**: Sub-second test runs
- **Reliable**: Consistent results across environments
- **Maintainable**: Clear test structure and naming

### Future Testing Enhancements

- [ ] E2E testing with Playwright
- [ ] Visual regression testing
- [ ] Accessibility testing automation
- [ ] Performance benchmarking
- [ ] Cross-browser compatibility testing

## Future Enhancements

- [ ] Form validation integration
- [ ] Complex field transformations
- [ ] Conditional prefill logic
- [ ] Export/import mapping configurations
- [ ] Audit trail for form submissions
- [ ] Real-time collaboration features