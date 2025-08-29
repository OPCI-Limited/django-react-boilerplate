// Vitest + Testing Library setup
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Provide a Jest-compatible global for older tests
// so jest.fn(), jest.mock(), etc. resolve to vitest's vi API.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).jest = vi

// Router hooks are used inside providers/components; provide safe defaults in tests
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/' }),
  }
})

// Reset mocks and clear auth cookies between tests
import { afterEach } from 'vitest'
afterEach(() => {
  vi.resetAllMocks()
  document.cookie = 'reactauth.token=; Max-Age=0; path=/'
  document.cookie = 'reactauth.refreshToken=; Max-Age=0; path=/'
})
