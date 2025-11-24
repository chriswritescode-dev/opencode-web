import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const OPENCODE_URL = `${window.location.protocol}//${window.location.hostname}:5551`

interface ProviderModel {
  id: string
  name: string
  attachment?: boolean
  reasoning?: boolean
  temperature?: boolean
  tool_call?: boolean
  cost?: {
    input: number
    output: number
    cache_read?: number
    cache_write?: number
  }
  limit?: {
    context: number
    output: number
  }
  modalities?: {
    input: string[]
    output: string[]
  }
  options?: Record<string, unknown>
}

interface Provider {
  id: string
  name: string
  npm?: string
  env?: string[]
  models: Record<string, ProviderModel>
  options?: {
    baseURL?: string
    [key: string]: unknown
  }
}

interface ProvidersResponse {
  providers: Provider[]
  default: Record<string, string>
}

export function useProviders() {
  return useQuery({
    queryKey: ['opencode-providers'],
    queryFn: async (): Promise<Provider[]> => {
      const { data } = await axios.get<ProvidersResponse>(
        `${OPENCODE_URL}/config/providers`
      )
      return data.providers
    },
    staleTime: 30000,
  })
}
