import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { Graph } from '../Graph'
import { initialNodes, initialEdges } from '../mockData'

const graphEndpoint =
  'http://localhost:3000/api/v1/1/actions/blueprints/bp_01jk766tckfwx84xjcxazggzyc/graph'

describe('Graph TDD', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('renders all form nodes from mock data (happy path)', async () => {
    globalThis.fetch = vi.fn((input: RequestInfo) => {
      const url = typeof input === 'string' ? input : input.url

      if (url === graphEndpoint) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              nodes: initialNodes,
              edges: initialEdges.map(({ id, ...edge }) => edge),
            }),
        })
      }

      return Promise.reject(new Error(`Unhandled fetch URL: ${url}`))
    }) as any

    render(<Graph />)

    await waitFor(() => {
      expect(screen.getByText('Form A')).toBeInTheDocument()
    })

    const formLabels = ['Form A', 'Form B', 'Form C', 'Form D', 'Form E', 'Form F']
    for (const label of formLabels) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })

  it('handles failed API fetch (sad path)', async () => {
    globalThis.fetch = vi.fn((input: RequestInfo) => {
      const url = typeof input === 'string' ? input : input.url

      if (url === graphEndpoint) {
        return Promise.reject(new Error('Server is down'))
      }

      return Promise.reject(new Error(`Unhandled fetch URL: ${url}`))
    }) as any

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(<Graph />)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to fetch graph data:',
        expect.any(Error)
      )
    })

    consoleSpy.mockRestore()
  })
})
