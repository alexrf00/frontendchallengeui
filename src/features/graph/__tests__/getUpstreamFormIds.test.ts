import { describe, it, expect } from 'vitest'
import { getUpstreamFormIds } from '../utils/getUpstreamFormIds'
import type { Edge } from '../graph.types'

describe('getUpstreamFormIds', () => {
  const mockEdges: Edge[] = [
    { id: 'e1', source: 'form-a', target: 'form-b' },
    { id: 'e2', source: 'form-b', target: 'form-c' },
    { id: 'e3', source: 'form-a', target: 'form-c' },
    { id: 'e4', source: 'form-d', target: 'form-e' },
    { id: 'e5', source: 'form-e', target: 'form-f' },
    { id: 'e6', source: 'form-c', target: 'form-f' },
  ]

  it('returns empty array when no upstream forms exist', () => {
    const result = getUpstreamFormIds('form-a', mockEdges)
    expect(result).toEqual([])
  })

  it('returns direct upstream forms', () => {
    const result = getUpstreamFormIds('form-b', mockEdges)
    expect(result).toContain('form-a')
    expect(result).toHaveLength(1)
  })

  it('returns all upstream forms in a chain', () => {
    const result = getUpstreamFormIds('form-c', mockEdges)
    expect(result).toContain('form-a')
    expect(result).toContain('form-b')
    expect(result).toHaveLength(2)
  })

  it('handles multiple upstream paths', () => {
    const result = getUpstreamFormIds('form-f', mockEdges)
    expect(result).toContain('form-c')
    expect(result).toContain('form-e')
    expect(result).toContain('form-d')
    expect(result).toContain('form-a')
    expect(result).toContain('form-b')
    expect(result).toHaveLength(5)
  })

it('handles circular dependencies without infinite loop', () => {
  const circularEdges: Edge[] = [
    { id: 'e1', source: 'form-a', target: 'form-b' },
    { id: 'e2', source: 'form-b', target: 'form-c' },
    { id: 'e3', source: 'form-c', target: 'form-a' }, // Creates a cycle
  ]

  const result = getUpstreamFormIds('form-a', circularEdges)
  expect(result).toContain('form-c')
  expect(result).toContain('form-b')
  expect(result).toContain('form-a') // Include the starting node
  expect(result).toHaveLength(3)
})

  it('handles empty edges array', () => {
    const result = getUpstreamFormIds('form-a', [])
    expect(result).toEqual([])
  })

  it('handles non-existent form ID', () => {
    const result = getUpstreamFormIds('non-existent', mockEdges)
    expect(result).toEqual([])
  })

  it('handles single node with self-reference', () => {
    const selfRefEdges: Edge[] = [
      { id: 'e1', source: 'form-a', target: 'form-a' }
    ]

    const result = getUpstreamFormIds('form-a', selfRefEdges)
    expect(result).toContain('form-a')
    expect(result).toHaveLength(1)
  })

  it('handles complex graph with multiple branches', () => {
    const complexEdges: Edge[] = [
      { id: 'e1', source: 'form-1', target: 'form-3' },
      { id: 'e2', source: 'form-2', target: 'form-3' },
      { id: 'e3', source: 'form-3', target: 'form-4' },
      { id: 'e4', source: 'form-4', target: 'form-5' },
      { id: 'e5', source: 'form-2', target: 'form-6' },
      { id: 'e6', source: 'form-6', target: 'form-5' },
    ]

    const result = getUpstreamFormIds('form-5', complexEdges)
    expect(result).toContain('form-1')
    expect(result).toContain('form-2')
    expect(result).toContain('form-3')
    expect(result).toContain('form-4')
    expect(result).toContain('form-6')
    expect(result).toHaveLength(5)
  })

  it('maintains uniqueness of upstream form IDs', () => {
    const duplicatePathEdges: Edge[] = [
      { id: 'e1', source: 'form-a', target: 'form-c' },
      { id: 'e2', source: 'form-b', target: 'form-c' },
      { id: 'e3', source: 'form-a', target: 'form-b' }, // form-a appears in multiple paths
    ]

    const result = getUpstreamFormIds('form-c', duplicatePathEdges)
    expect(result).toContain('form-a')
    expect(result).toContain('form-b')
    expect(result).toHaveLength(2)
    
    // Check that form-a only appears once despite multiple paths
    const aCount = result.filter(id => id === 'form-a').length
    expect(aCount).toBe(1)
  })

  it('handles very deep chains efficiently', () => {
    const deepChainEdges: Edge[] = []
    for (let i = 0; i < 100; i++) {
      deepChainEdges.push({
        id: `e${i}`,
        source: `form-${i}`,
        target: `form-${i + 1}`
      })
    }

    const result = getUpstreamFormIds('form-100', deepChainEdges)
    expect(result).toHaveLength(100)
    expect(result).toContain('form-0')
    expect(result).toContain('form-50')
    expect(result).toContain('form-99')
  })
})