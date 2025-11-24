import { useState } from 'react'
import { Plus, Trash2, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'

interface Command {
  template: string
  description?: string
  agent?: string
  model?: string
  subtask?: boolean
  topP?: number
}

interface CommandsEditorProps {
  commands: Record<string, Command>
  onChange: (commands: Record<string, Command>) => void
}

export function CommandsEditor({ commands, onChange }: CommandsEditorProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingCommand, setEditingCommand] = useState<{ name: string; command: Command } | null>(null)
  const [newCommandName, setNewCommandName] = useState('')
  const [newCommand, setNewCommand] = useState<Command>({
    template: '',
    description: '',
    agent: '',
    model: '',
    subtask: false,
    topP: 1
  })

  const createCommand = () => {
    if (!newCommandName.trim() || !newCommand.template.trim()) return

    const updatedCommands = {
      ...commands,
      [newCommandName]: {
        template: newCommand.template,
        description: newCommand.description,
        agent: newCommand.agent || undefined,
        model: newCommand.model || undefined,
        subtask: newCommand.subtask || undefined,
        topP: newCommand.topP || undefined
      }
    }

    onChange(updatedCommands)
    setNewCommandName('')
    setNewCommand({
      template: '',
      description: '',
      agent: '',
      model: '',
      subtask: false,
      topP: 1
    })
    setIsCreateDialogOpen(false)
  }

  const updateCommand = () => {
    if (!editingCommand) return

    const updatedCommands = { ...commands }
    delete updatedCommands[editingCommand.name]

    updatedCommands[editingCommand.name] = {
      template: editingCommand.command.template,
      description: editingCommand.command.description,
      agent: editingCommand.command.agent || undefined,
      model: editingCommand.command.model || undefined,
      subtask: editingCommand.command.subtask || undefined,
      topP: editingCommand.command.topP || undefined
    }

    onChange(updatedCommands)
    setEditingCommand(null)
  }

  const deleteCommand = (name: string) => {
    const updatedCommands = { ...commands }
    delete updatedCommands[name]
    onChange(updatedCommands)
  }

  const startEdit = (name: string, command: Command) => {
    setEditingCommand({ name, command })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Commands</h3>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Command
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Command</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="command-name">Command Name</Label>
                <Input
                  id="command-name"
                  value={newCommandName}
                  onChange={(e) => setNewCommandName(e.target.value)}
                  placeholder="my-command"
                />
              </div>
              
              <div>
                <Label htmlFor="command-description">Description</Label>
                <Input
                  id="command-description"
                  value={newCommand.description}
                  onChange={(e) => setNewCommand({ ...newCommand, description: e.target.value })}
                  placeholder="Brief description of what the command does"
                />
              </div>

              <div>
                <Label htmlFor="command-template">Template</Label>
                <Textarea
                  id="command-template"
                  value={newCommand.template}
                  onChange={(e) => setNewCommand({ ...newCommand, template: e.target.value })}
                  placeholder="The prompt template that will be sent to the LLM. Use $ARGUMENTS or $1, $2, etc. for parameters."
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="command-agent">Agent (optional)</Label>
                  <Input
                    id="command-agent"
                    value={newCommand.agent}
                    onChange={(e) => setNewCommand({ ...newCommand, agent: e.target.value })}
                    placeholder="build"
                  />
                </div>
                
                <div>
                  <Label htmlFor="command-model">Model (optional)</Label>
                  <Input
                    id="command-model"
                    value={newCommand.model}
                    onChange={(e) => setNewCommand({ ...newCommand, model: e.target.value })}
                    placeholder="anthropic/claude-3-5-sonnet-20241022"
                  />
                </div>

                <div>
                  <Label htmlFor="command-top-p">Top P (optional)</Label>
                  <Input
                    id="command-top-p"
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={newCommand.topP}
                    onChange={(e) => setNewCommand({ ...newCommand, topP: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="command-subtask"
                  checked={newCommand.subtask}
                  onCheckedChange={(checked) => setNewCommand({ ...newCommand, subtask: checked })}
                />
                <Label htmlFor="command-subtask">Run as subtask</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createCommand} disabled={!newCommandName.trim() || !newCommand.template.trim()}>
                  Create
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {Object.keys(commands).length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No commands configured. Add your first command to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {Object.entries(commands).map(([name, command]) => (
            <Card key={name}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">/{name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(name, command)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteCommand(name)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {command.description && (
                    <p className="text-sm text-muted-foreground">{command.description}</p>
                  )}
<div className="text-xs text-muted-foreground space-y-1">
                     {command.agent && <p>Agent: {command.agent}</p>}
                     {command.model && <p>Model: {command.model}</p>}
                     {command.topP !== undefined && <p>Top P: {command.topP}</p>}
                     {command.subtask && <p>Subtask: Yes</p>}
                   </div>
                  <div className="mt-2 p-2 bg-muted rounded text-xs font-mono max-h-20 overflow-y-auto">
                    {command.template}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingCommand} onOpenChange={() => setEditingCommand(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Command</DialogTitle>
          </DialogHeader>
          {editingCommand && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-command-name">Command Name</Label>
                <Input
                  id="edit-command-name"
                  value={editingCommand.name}
                  disabled
                  className="bg-muted"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-command-description">Description</Label>
                <Input
                  id="edit-command-description"
                  value={editingCommand.command.description || ''}
                  onChange={(e) => setEditingCommand({
                    ...editingCommand,
                    command: { ...editingCommand.command, description: e.target.value }
                  })}
                  placeholder="Brief description of what the command does"
                />
              </div>

              <div>
                <Label htmlFor="edit-command-template">Template</Label>
                <Textarea
                  id="edit-command-template"
                  value={editingCommand.command.template}
                  onChange={(e) => setEditingCommand({
                    ...editingCommand,
                    command: { ...editingCommand.command, template: e.target.value }
                  })}
                  placeholder="The prompt template that will be sent to the LLM. Use $ARGUMENTS or $1, $2, etc. for parameters."
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>

<div className="grid grid-cols-3 gap-4">
                 <div>
                   <Label htmlFor="edit-command-agent">Agent (optional)</Label>
                   <Input
                     id="edit-command-agent"
                     value={editingCommand.command.agent || ''}
                     onChange={(e) => setEditingCommand({
                       ...editingCommand,
                       command: { ...editingCommand.command, agent: e.target.value }
                     })}
                     placeholder="build"
                   />
                 </div>
                 
                 <div>
                   <Label htmlFor="edit-command-model">Model (optional)</Label>
                   <Input
                     id="edit-command-model"
                     value={editingCommand.command.model || ''}
                     onChange={(e) => setEditingCommand({
                       ...editingCommand,
                       command: { ...editingCommand.command, model: e.target.value }
                     })}
                     placeholder="anthropic/claude-3-5-sonnet-20241022"
                   />
                 </div>

                 <div>
                   <Label htmlFor="edit-command-top-p">Top P (optional)</Label>
                   <Input
                     id="edit-command-top-p"
                     type="number"
                     min="0"
                     max="1"
                     step="0.1"
                     value={editingCommand.command.topP ?? 1}
                     onChange={(e) => setEditingCommand({
                       ...editingCommand,
                       command: { ...editingCommand.command, topP: parseFloat(e.target.value) }
                     })}
                   />
                 </div>
               </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-command-subtask"
                  checked={editingCommand.command.subtask || false}
                  onCheckedChange={(checked) => setEditingCommand({
                    ...editingCommand,
                    command: { ...editingCommand.command, subtask: checked }
                  })}
                />
                <Label htmlFor="edit-command-subtask">Run as subtask</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingCommand(null)}>
                  Cancel
                </Button>
                <Button onClick={updateCommand}>
                  Update
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}