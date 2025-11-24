import { useState } from 'react'
import { Plus, Trash2, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Agent {
  prompt?: string
  description?: string
  mode?: 'subagent' | 'primary' | 'all'
  temperature?: number
  topP?: number
  model?: {
    modelID: string
    providerID: string
  }
  tools?: Record<string, boolean>
  permission?: {
    edit?: 'ask' | 'allow' | 'deny'
    bash?: 'ask' | 'allow' | 'deny' | Record<string, 'ask' | 'allow' | 'deny'>
    webfetch?: 'ask' | 'allow' | 'deny'
  }
  disable?: boolean
  [key: string]: unknown
}

interface AgentsEditorProps {
  agents: Record<string, Agent>
  onChange: (agents: Record<string, Agent>) => void
}

export function AgentsEditor({ agents, onChange }: AgentsEditorProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingAgent, setEditingAgent] = useState<{ name: string; agent: Agent } | null>(null)
  const [newAgentName, setNewAgentName] = useState('')
  const [newAgent, setNewAgent] = useState<Agent>({
    prompt: '',
    description: '',
    mode: 'subagent',
    temperature: 0.7,
    topP: 1,
    disable: false,
    tools: {},
    permission: {}
  })

  const createAgent = () => {
    if (!newAgentName.trim()) return

    const updatedAgents = {
      ...agents,
      [newAgentName]: {
        prompt: newAgent.prompt || undefined,
        description: newAgent.description || undefined,
        mode: newAgent.mode,
        temperature: newAgent.temperature,
        topP: newAgent.topP,
        disable: newAgent.disable
      }
    }

    onChange(updatedAgents)
    setNewAgentName('')
    setNewAgent({
      prompt: '',
      description: '',
      mode: 'subagent',
      temperature: 0.7,
      topP: 1,
      disable: false,
      tools: {},
      permission: {}
    })
    setIsCreateDialogOpen(false)
  }

  const updateAgent = () => {
    if (!editingAgent) return

    const updatedAgents = { ...agents }
    delete updatedAgents[editingAgent.name]

    updatedAgents[editingAgent.name] = editingAgent.agent

    onChange(updatedAgents)
    setEditingAgent(null)
  }

  const deleteAgent = (name: string) => {
    const updatedAgents = { ...agents }
    delete updatedAgents[name]
    onChange(updatedAgents)
  }

  const startEdit = (name: string, agent: Agent) => {
    setEditingAgent({ name, agent })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Agents</h3>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Agent</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className='space-y-1'>
                <Label htmlFor="agent-name">Agent Name</Label>
                <Input
                  id="agent-name"
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  placeholder="my-agent"
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="agent-description">Description</Label>
                <Input
                  id="agent-description"
                  value={newAgent.description}
                  onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                  placeholder="Brief description of what the agent does"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="agent-prompt">Prompt</Label>
                <Textarea
                  id="agent-prompt"
                  value={newAgent.prompt}
                  onChange={(e) => setNewAgent({ ...newAgent, prompt: e.target.value })}
                  placeholder="The system prompt that defines the agent's behavior and role"
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="agent-mode">Mode</Label>
                  <Select
                    value={newAgent.mode}
                    onValueChange={(value: 'subagent' | 'primary' | 'all') => 
                      setNewAgent({ ...newAgent, mode: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="subagent">Subagent</SelectItem>
                      <SelectItem value="primary">Primary</SelectItem>
                      <SelectItem value="all">All</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="agent-temperature">Temperature</Label>
                  <Input
                    id="agent-temperature"
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    value={newAgent.temperature}
                    onChange={(e) => setNewAgent({ ...newAgent, temperature: parseFloat(e.target.value) })}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="agent-top-p">Top P</Label>
                  <Input
                    id="agent-top-p"
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={newAgent.topP}
                    onChange={(e) => setNewAgent({ ...newAgent, topP: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Model Configuration</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="agent-model-id">Model ID</Label>
                    <Input
                      id="agent-model-id"
                      value={newAgent.model?.modelID || ''}
                      onChange={(e) => setNewAgent({ 
                        ...newAgent, 
                        model: { ...newAgent.model, modelID: e.target.value, providerID: newAgent.model?.providerID || '' }
                      })}
                      placeholder="claude-3-5-sonnet-20241022"
                    />
                  </div>
                  <div>
                    <Label htmlFor="agent-provider-id">Provider ID</Label>
                    <Input
                      id="agent-provider-id"
                      value={newAgent.model?.providerID || ''}
                      onChange={(e) => setNewAgent({ 
                        ...newAgent, 
                        model: { ...newAgent.model, providerID: e.target.value, modelID: newAgent.model?.modelID || '' }
                      })}
                      placeholder="anthropic"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tools Configuration</Label>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="tool-write"
                      checked={newAgent.tools?.write ?? true}
                      onCheckedChange={(checked) => setNewAgent({ 
                        ...newAgent, 
                        tools: { ...newAgent.tools, write: checked } 
                      })}
                    />
                    <Label htmlFor="tool-write">Write</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="tool-edit"
                      checked={newAgent.tools?.edit ?? true}
                      onCheckedChange={(checked) => setNewAgent({ 
                        ...newAgent, 
                        tools: { ...newAgent.tools, edit: checked } 
                      })}
                    />
                    <Label htmlFor="tool-edit">Edit</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="tool-bash"
                      checked={newAgent.tools?.bash ?? true}
                      onCheckedChange={(checked) => setNewAgent({ 
                        ...newAgent, 
                        tools: { ...newAgent.tools, bash: checked } 
                      })}
                    />
                    <Label htmlFor="tool-bash">Bash</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="tool-webfetch"
                      checked={newAgent.tools?.webfetch ?? true}
                      onCheckedChange={(checked) => setNewAgent({ 
                        ...newAgent, 
                        tools: { ...newAgent.tools, webfetch: checked } 
                      })}
                    />
                    <Label htmlFor="tool-webfetch">Web Fetch</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <Label className="text-xs">Edit</Label>
                    <Select
                      value={newAgent.permission?.edit ?? 'allow'}
                      onValueChange={(value: 'ask' | 'allow' | 'deny') => 
                        setNewAgent({ 
                          ...newAgent, 
                          permission: { ...newAgent.permission, edit: value } 
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ask">Ask</SelectItem>
                        <SelectItem value="allow">Allow</SelectItem>
                        <SelectItem value="deny">Deny</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Bash</Label>
                    <Select
                      value={typeof newAgent.permission?.bash === 'string' ? newAgent.permission.bash : 'allow'}
                      onValueChange={(value: 'ask' | 'allow' | 'deny') => 
                        setNewAgent({ 
                          ...newAgent, 
                          permission: { ...newAgent.permission, bash: value } 
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ask">Ask</SelectItem>
                        <SelectItem value="allow">Allow</SelectItem>
                        <SelectItem value="deny">Deny</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Web Fetch</Label>
                    <Select
                      value={newAgent.permission?.webfetch ?? 'allow'}
                      onValueChange={(value: 'ask' | 'allow' | 'deny') => 
                        setNewAgent({ 
                          ...newAgent, 
                          permission: { ...newAgent.permission, webfetch: value } 
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ask">Ask</SelectItem>
                        <SelectItem value="allow">Allow</SelectItem>
                        <SelectItem value="deny">Deny</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="agent-disable"
                  checked={newAgent.disable}
                  onCheckedChange={(checked) => setNewAgent({ ...newAgent, disable: checked })}
                />
                <Label htmlFor="agent-disable">Disable agent</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createAgent} disabled={!newAgentName.trim()}>
                  Create
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {Object.keys(agents).length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No agents configured. Add your first agent to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {Object.entries(agents).map(([name, agent]) => (
            <Card key={name}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(name, agent)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteAgent(name)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {agent.description && (
                    <p className="text-sm text-muted-foreground">{agent.description}</p>
                  )}
<div className="text-xs text-muted-foreground space-y-1">
                     <p>Mode: {agent.mode}</p>
                     {agent.temperature !== undefined && <p>Temperature: {agent.temperature}</p>}
                     {agent.topP !== undefined && <p>Top P: {agent.topP}</p>}
                     {agent.model?.modelID && <p>Model: {agent.model.providerID}/{agent.model.modelID}</p>}
                     {agent.disable && <p>Status: Disabled</p>}
                   </div>
                  {agent.prompt && (
                    <div className="mt-2 p-2 bg-muted rounded text-xs font-mono max-h-20 overflow-y-auto">
                      {agent.prompt}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingAgent} onOpenChange={() => setEditingAgent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Agent</DialogTitle>
          </DialogHeader>
          {editingAgent && (
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="edit-agent-name">Agent Name</Label>
                <Input
                  id="edit-agent-name"
                  value={editingAgent.name}
                  disabled
                  className="bg-muted"
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="edit-agent-description">Description</Label>
                <Input
                  id="edit-agent-description"
                  value={editingAgent.agent.description || ''}
                  onChange={(e) => setEditingAgent({
                    ...editingAgent,
                    agent: { ...editingAgent.agent, description: e.target.value }
                  })}
                  placeholder="Brief description of what the agent does"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="edit-agent-prompt">Prompt</Label>
                <Textarea
                  id="edit-agent-prompt"
                  value={editingAgent.agent.prompt || ''}
                  onChange={(e) => setEditingAgent({
                    ...editingAgent,
                    agent: { ...editingAgent.agent, prompt: e.target.value }
                  })}
                  placeholder="The system prompt that defines the agent's behavior and role"
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className='space-y-1'>
                  <Label htmlFor="edit-agent-mode">Mode</Label>
                  <Select
                    value={editingAgent.agent.mode || 'subagent'}
                    onValueChange={(value: 'subagent' | 'primary' | 'all') => 
                      setEditingAgent({
                        ...editingAgent,
                        agent: { ...editingAgent.agent, mode: value }
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="subagent">Subagent</SelectItem>
                      <SelectItem value="primary">Primary</SelectItem>
                      <SelectItem value="all">All</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="edit-agent-temperature">Temperature</Label>
                  <Input
                    id="edit-agent-temperature"
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    value={editingAgent.agent.temperature ?? 0.7}
                    onChange={(e) => setEditingAgent({
                      ...editingAgent,
                      agent: { ...editingAgent.agent, temperature: parseFloat(e.target.value) }
                    })}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="edit-agent-top-p">Top P</Label>
                  <Input
                    id="edit-agent-top-p"
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={editingAgent.agent.topP ?? 1}
                    onChange={(e) => setEditingAgent({
                      ...editingAgent,
                      agent: { ...editingAgent.agent, topP: parseFloat(e.target.value) }
                    })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Model Configuration</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-agent-model-id">Model ID</Label>
                    <Input
                      id="edit-agent-model-id"
                      value={editingAgent.agent.model?.modelID || ''}
                      onChange={(e) => setEditingAgent({
                        ...editingAgent,
                        agent: { 
                          ...editingAgent.agent, 
                          model: { 
                            ...editingAgent.agent.model, 
                            modelID: e.target.value, 
                            providerID: editingAgent.agent.model?.providerID || '' 
                          }
                        }
                      })}
                      placeholder="claude-3-5-sonnet-20241022"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-agent-provider-id">Provider ID</Label>
                    <Input
                      id="edit-agent-provider-id"
                      value={editingAgent.agent.model?.providerID || ''}
                      onChange={(e) => setEditingAgent({
                        ...editingAgent,
                        agent: { 
                          ...editingAgent.agent, 
                          model: { 
                            ...editingAgent.agent.model, 
                            providerID: e.target.value, 
                            modelID: editingAgent.agent.model?.modelID || '' 
                          }
                        }
                      })}
                      placeholder="anthropic"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tools Configuration</Label>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-tool-write"
                      checked={editingAgent.agent.tools?.write ?? true}
                      onCheckedChange={(checked) => setEditingAgent({
                        ...editingAgent,
                        agent: { ...editingAgent.agent, tools: { ...editingAgent.agent.tools, write: checked } }
                      })}
                    />
                    <Label htmlFor="edit-tool-write">Write</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-tool-edit"
                      checked={editingAgent.agent.tools?.edit ?? true}
                      onCheckedChange={(checked) => setEditingAgent({
                        ...editingAgent,
                        agent: { ...editingAgent.agent, tools: { ...editingAgent.agent.tools, edit: checked } }
                      })}
                    />
                    <Label htmlFor="edit-tool-edit">Edit</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-tool-bash"
                      checked={editingAgent.agent.tools?.bash ?? true}
                      onCheckedChange={(checked) => setEditingAgent({
                        ...editingAgent,
                        agent: { ...editingAgent.agent, tools: { ...editingAgent.agent.tools, bash: checked } }
                      })}
                    />
                    <Label htmlFor="edit-tool-bash">Bash</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-tool-webfetch"
                      checked={editingAgent.agent.tools?.webfetch ?? true}
                      onCheckedChange={(checked) => setEditingAgent({
                        ...editingAgent,
                        agent: { ...editingAgent.agent, tools: { ...editingAgent.agent.tools, webfetch: checked } }
                      })}
                    />
                    <Label htmlFor="edit-tool-webfetch">Web Fetch</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <Label className="text-xs">Edit</Label>
                    <Select
                      value={editingAgent.agent.permission?.edit ?? 'allow'}
                      onValueChange={(value: 'ask' | 'allow' | 'deny') => 
                        setEditingAgent({
                          ...editingAgent,
                          agent: { ...editingAgent.agent, permission: { ...editingAgent.agent.permission, edit: value } }
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ask">Ask</SelectItem>
                        <SelectItem value="allow">Allow</SelectItem>
                        <SelectItem value="deny">Deny</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Bash</Label>
                    <Select
                      value={typeof editingAgent.agent.permission?.bash === 'string' ? editingAgent.agent.permission.bash : 'allow'}
                      onValueChange={(value: 'ask' | 'allow' | 'deny') => 
                        setEditingAgent({
                          ...editingAgent,
                          agent: { ...editingAgent.agent, permission: { ...editingAgent.agent.permission, bash: value } }
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ask">Ask</SelectItem>
                        <SelectItem value="allow">Allow</SelectItem>
                        <SelectItem value="deny">Deny</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Web Fetch</Label>
                    <Select
                      value={editingAgent.agent.permission?.webfetch ?? 'allow'}
                      onValueChange={(value: 'ask' | 'allow' | 'deny') => 
                        setEditingAgent({
                          ...editingAgent,
                          agent: { ...editingAgent.agent, permission: { ...editingAgent.agent.permission, webfetch: value } }
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ask">Ask</SelectItem>
                        <SelectItem value="allow">Allow</SelectItem>
                        <SelectItem value="deny">Deny</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-agent-disable"
                  checked={editingAgent.agent.disable || false}
                  onCheckedChange={(checked) => setEditingAgent({
                    ...editingAgent,
                    agent: { ...editingAgent.agent, disable: checked }
                  })}
                />
                <Label htmlFor="edit-agent-disable">Disable agent</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingAgent(null)}>
                  Cancel
                </Button>
                <Button onClick={updateAgent}>
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
