import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

export interface FileSearchResult {
  files: string[]
  isLoading: boolean
  error: Error | null
}

export function useFileSearch(
  opcodeUrl: string | null,
  query: string,
  enabled: boolean = true,
  directory?: string
): FileSearchResult {
  const [debouncedQuery, setDebouncedQuery] = useState(query)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  const { data, isLoading, error } = useQuery({
    queryKey: ['file-search', opcodeUrl, debouncedQuery, directory],
    queryFn: async () => {
      if (!opcodeUrl || !debouncedQuery) return []
      
      const params = new URLSearchParams({ query: debouncedQuery })
      if (directory) {
        params.append('directory', directory)
      }
      
      const response = await fetch(
        `${opcodeUrl}/find/file?${params.toString()}`
      )
      
      if (!response.ok) throw new Error('File search failed')
      
      const data = await response.json()
      return data as string[]
    },
    enabled: enabled && !!opcodeUrl && !!debouncedQuery,
    staleTime: 60000,
  })

  return {
    files: data || [],
    isLoading,
    error: error as Error | null
  }
}
