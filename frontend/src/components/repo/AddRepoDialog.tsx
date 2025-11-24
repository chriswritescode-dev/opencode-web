import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createRepo } from '@/api/repos'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'

interface AddRepoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddRepoDialog({ open, onOpenChange }: AddRepoDialogProps) {
  const [repoUrl, setRepoUrl] = useState('')
  const [branch, setBranch] = useState('')
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => createRepo(repoUrl, branch || undefined, undefined, false),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repos'] })
      setRepoUrl('')
      setBranch('')
      onOpenChange(false)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (repoUrl) {
      mutation.mutate()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-[#141414] border-[#2a2a2a]">
        <DialogHeader>
          <DialogTitle className="text-xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Add Repository
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Repository URL</label>
            <Input
              placeholder="https://github.com/user/repo.git"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              disabled={mutation.isPending}
              className="bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-zinc-500"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Branch</label>
            <Input
              placeholder="Optional - uses default if empty"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              disabled={mutation.isPending}
              className="bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-zinc-500"
            />
            <p className="text-xs text-zinc-500">
              {branch 
                ? `Clones repository directly to '${branch}' branch`
                : "Clones repository to default branch"
              }
            </p>
          </div>
          
          <Button 
            type="submit" 
            disabled={!repoUrl || mutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Cloning...
              </>
            ) : (
              'Add Repository'
            )}
          </Button>
          {mutation.isError && (
            <p className="text-sm text-red-400">
              {mutation.error.message}
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
