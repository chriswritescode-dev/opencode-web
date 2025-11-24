import { useEffect, useRef } from 'react'

interface FileSuggestionsProps {
  isOpen: boolean
  query: string
  files: string[]
  onSelect: (file: string) => void
  onClose: () => void
  position: { bottom: number, left: number, width: number }
  selectedIndex?: number
}

export function FileSuggestions({
  isOpen,
  files,
  onSelect,
  onClose,
  position,
  selectedIndex = 0
}: FileSuggestionsProps) {
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (listRef.current && !listRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen || !listRef.current) return
    
    const selectedItem = listRef.current.children[selectedIndex] as HTMLElement
    if (selectedItem) {
      selectedItem.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex, isOpen])

  if (!isOpen || files.length === 0) return null

  const getFilename = (path: string) => path.split('/').pop() || path
  const getDirectory = (path: string) => {
    const parts = path.split('/')
    return parts.slice(0, -1).join('/') || '.'
  }

  return (
    <div
      ref={listRef}
      className="fixed bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto"
      style={{
        bottom: `${position.bottom}px`,
        left: `${position.left}px`,
        width: `${position.width}px`
      }}
    >
      {files.map((file, idx) => (
        <button
          key={file}
          onClick={() => onSelect(file)}
          className={`w-full px-3 py-2 text-left transition-colors ${
            idx === selectedIndex
              ? 'bg-blue-600 text-white'
              : 'hover:bg-zinc-800 text-zinc-100'
          }`}
        >
          <div className="font-mono text-sm font-medium">
            {getFilename(file)}
          </div>
          <div className="text-xs opacity-70 mt-0.5">
            {getDirectory(file)}
          </div>
        </button>
      ))}
    </div>
  )
}
