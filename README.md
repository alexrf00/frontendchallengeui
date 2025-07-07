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

## Architecture
- **scream architecture** 

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

## Installation

```bash
npm install @xyflow/react
```

## Dependencies

- **React**: UI framework
- **@xyflow/react**: Graph visualization and interaction
- **TypeScript**: Type safety

## Configuration

The system fetches graph data from:
```
http://localhost:3000/api/v1/1/actions/blueprints/bp_01jk766tckfwx84xjcxazggzyc/graph
```

Modify the API endpoint in `useGraphData.ts` to match your backend.

## Future Enhancements

- [ ] Form validation integration
- [ ] Complex field transformations
- [ ] Conditional prefill logic
- [ ] Export/import mapping configurations
- [ ] Audit trail for form submissions
- [ ] Real-time collaboration features# frontendchallengeui
