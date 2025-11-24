export interface ProviderTemplate {
  id: string
  name: string
  description: string
  npm: string
  options?: {
    baseURL?: string
    [key: string]: unknown
  }
  models?: Record<string, {
    name: string
    limit?: {
      context: number
      output: number
    }
  }>
  requiresApiKey: boolean
  docsUrl?: string
}

export const PROVIDER_TEMPLATES: ProviderTemplate[] = [
  {
    id: 'opencode',
    name: 'OpenCode Zen',
    description: 'Tested models from OpenCode (Recommended)',
    npm: '@ai-sdk/openai-compatible',
    options: {
      baseURL: 'https://api.opencode.ai/v1',
    },
    requiresApiKey: true,
    docsUrl: 'https://opencode.ai/docs/zen/',
    models: {
      'qwen3-coder-480b': {
        name: 'Qwen 3 Coder 480B',
      },
    },
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Claude models from Anthropic',
    npm: '@ai-sdk/anthropic',
    requiresApiKey: true,
    docsUrl: 'https://opencode.ai/docs/providers/#anthropic',
    models: {
      'claude-3-5-sonnet-20241022': {
        name: 'Claude 3.5 Sonnet',
        limit: { context: 200000, output: 8192 },
      },
      'claude-3-5-haiku-20241022': {
        name: 'Claude 3.5 Haiku',
        limit: { context: 200000, output: 8192 },
      },
    },
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT models from OpenAI',
    npm: '@ai-sdk/openai',
    requiresApiKey: true,
    docsUrl: 'https://opencode.ai/docs/providers/#openai',
    models: {
      'gpt-4o': {
        name: 'GPT-4o',
        limit: { context: 128000, output: 4096 },
      },
      'gpt-4o-mini': {
        name: 'GPT-4o Mini',
        limit: { context: 128000, output: 16384 },
      },
    },
  },
  {
    id: 'google',
    name: 'Google',
    description: 'Gemini models from Google',
    npm: '@ai-sdk/google',
    requiresApiKey: true,
    docsUrl: 'https://opencode.ai/docs/providers/#google-vertex-ai',
    models: {
      'gemini-1.5-pro': {
        name: 'Gemini 1.5 Pro',
        limit: { context: 2000000, output: 8192 },
      },
      'gemini-1.5-flash': {
        name: 'Gemini 1.5 Flash',
        limit: { context: 1000000, output: 8192 },
      },
    },
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    description: 'DeepSeek models including DeepSeek Reasoner',
    npm: '@ai-sdk/openai-compatible',
    options: {
      baseURL: 'https://api.deepseek.com/v1',
    },
    requiresApiKey: true,
    docsUrl: 'https://opencode.ai/docs/providers/#deepseek',
    models: {
      'deepseek-reasoner': {
        name: 'DeepSeek Reasoner',
      },
      'deepseek-chat': {
        name: 'DeepSeek Chat',
      },
    },
  },
  {
    id: 'groq',
    name: 'Groq',
    description: 'Fast inference with Groq',
    npm: '@ai-sdk/openai-compatible',
    options: {
      baseURL: 'https://api.groq.com/openai/v1',
    },
    requiresApiKey: true,
    docsUrl: 'https://opencode.ai/docs/providers/#groq',
    models: {
      'llama-3.1-70b-versatile': {
        name: 'Llama 3.1 70B',
      },
    },
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    description: 'Access multiple models through OpenRouter',
    npm: '@ai-sdk/openai-compatible',
    options: {
      baseURL: 'https://openrouter.ai/api/v1',
    },
    requiresApiKey: true,
    docsUrl: 'https://opencode.ai/docs/providers/#openrouter',
    models: {
      'anthropic/claude-3.5-sonnet': {
        name: 'Claude 3.5 Sonnet (via OpenRouter)',
      },
    },
  },
  {
    id: 'cerebras',
    name: 'Cerebras',
    description: 'Fast inference including Qwen 3 Coder',
    npm: '@ai-sdk/cerebras',
    requiresApiKey: true,
    docsUrl: 'https://opencode.ai/docs/providers/#cerebras',
    models: {
      'qwen3-480b': {
        name: 'Qwen 3 Coder 480B',
      },
    },
  },
  {
    id: 'fireworks',
    name: 'Fireworks AI',
    description: 'Fast model inference including Kimi K2',
    npm: '@ai-sdk/openai-compatible',
    options: {
      baseURL: 'https://api.fireworks.ai/inference/v1',
    },
    requiresApiKey: true,
    docsUrl: 'https://opencode.ai/docs/providers/#fireworks-ai',
    models: {
      'kimi-k2-instruct': {
        name: 'Kimi K2 Instruct',
      },
    },
  },
  {
    id: 'together',
    name: 'Together AI',
    description: 'Access to multiple open source models',
    npm: '@ai-sdk/openai-compatible',
    options: {
      baseURL: 'https://api.together.xyz/v1',
    },
    requiresApiKey: true,
    docsUrl: 'https://opencode.ai/docs/providers/#together-ai',
    models: {
      'kimi-k2-instruct': {
        name: 'Kimi K2 Instruct',
      },
    },
  },
  {
    id: 'deepinfra',
    name: 'Deep Infra',
    description: 'Serverless inference for open models',
    npm: '@ai-sdk/openai-compatible',
    options: {
      baseURL: 'https://api.deepinfra.com/v1/openai',
    },
    requiresApiKey: true,
    docsUrl: 'https://opencode.ai/docs/providers/#deep-infra',
  },
  {
    id: 'baseten',
    name: 'Baseten',
    description: 'Serverless GPU inference',
    npm: '@ai-sdk/openai-compatible',
    requiresApiKey: true,
    docsUrl: 'https://opencode.ai/docs/providers/#baseten',
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    description: 'Access to 17+ inference providers',
    npm: '@ai-sdk/openai-compatible',
    options: {
      baseURL: 'https://api-inference.huggingface.co/v1',
    },
    requiresApiKey: true,
    docsUrl: 'https://opencode.ai/docs/providers/#hugging-face',
    models: {
      'kimi-k2-instruct': {
        name: 'Kimi K2 Instruct',
      },
      'glm-4.6': {
        name: 'GLM 4.6',
      },
    },
  },
  {
    id: 'moonshot',
    name: 'Moonshot AI',
    description: 'Kimi K2 models from Moonshot AI',
    npm: '@ai-sdk/openai-compatible',
    options: {
      baseURL: 'https://api.moonshot.cn/v1',
    },
    requiresApiKey: true,
    docsUrl: 'https://opencode.ai/docs/providers/#moonshot-ai',
    models: {
      'kimi-k2': {
        name: 'Kimi K2',
      },
    },
  },
  {
    id: 'cortecs',
    name: 'Cortecs',
    description: 'AI inference platform',
    npm: '@ai-sdk/openai-compatible',
    requiresApiKey: true,
    docsUrl: 'https://opencode.ai/docs/providers/#cortecs',
    models: {
      'kimi-k2-instruct': {
        name: 'Kimi K2 Instruct',
      },
    },
  },
  {
    id: 'zai',
    name: 'Z.AI',
    description: 'GLM models from Z.AI',
    npm: '@ai-sdk/openai-compatible',
    requiresApiKey: true,
    docsUrl: 'https://opencode.ai/docs/providers/#zai',
    models: {
      'glm-4.5': {
        name: 'GLM 4.5',
      },
    },
  },
  {
    id: 'ovhcloud',
    name: 'OVHcloud AI Endpoints',
    description: 'European cloud AI inference',
    npm: '@ai-sdk/openai-compatible',
    options: {
      baseURL: 'https://endpoints.ai.cloud.ovh.net/v1',
    },
    requiresApiKey: true,
    docsUrl: 'https://opencode.ai/docs/providers/#ovhcloud-ai-endpoints',
    models: {
      'gpt-oss-120b': {
        name: 'GPT OSS 120B',
      },
    },
  },
  {
    id: 'xai',
    name: 'xAI',
    description: 'Grok models from xAI',
    npm: '@ai-sdk/openai-compatible',
    options: {
      baseURL: 'https://api.x.ai/v1',
    },
    requiresApiKey: true,
    docsUrl: 'https://opencode.ai/docs/providers/#xai',
    models: {
      'grok-beta': {
        name: 'Grok Beta',
      },
    },
  },
  {
    id: 'zenmux',
    name: 'ZenMux',
    description: 'Multi-provider AI gateway',
    npm: '@ai-sdk/openai-compatible',
    options: {
      baseURL: 'https://api.zenmux.ai/v1',
    },
    requiresApiKey: true,
    docsUrl: 'https://opencode.ai/docs/providers/#zenmux',
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    description: 'Use your GitHub Copilot subscription',
    npm: '@ai-sdk/openai-compatible',
    requiresApiKey: true,
    docsUrl: 'https://opencode.ai/docs/providers/#github-copilot',
  },
  {
    id: 'ollama',
    name: 'Ollama (Local)',
    description: 'Run models locally with Ollama',
    npm: '@ai-sdk/openai-compatible',
    options: {
      baseURL: 'http://localhost:11434/v1',
    },
    requiresApiKey: false,
    docsUrl: 'https://opencode.ai/docs/providers/#ollama',
    models: {
      'llama3.2': {
        name: 'Llama 3.2',
      },
      'qwen2.5-coder': {
        name: 'Qwen 2.5 Coder',
      },
    },
  },
  {
    id: 'lmstudio',
    name: 'LM Studio (Local)',
    description: 'Run models locally with LM Studio',
    npm: '@ai-sdk/openai-compatible',
    options: {
      baseURL: 'http://127.0.0.1:1234/v1',
    },
    requiresApiKey: false,
    docsUrl: 'https://opencode.ai/docs/providers/#lm-studio',
    models: {
      'google/gemma-3n-e4b': {
        name: 'Gemma 3n-e4b',
      },
    },
  },
  {
    id: 'custom-openai-compatible',
    name: 'Custom OpenAI-Compatible',
    description: 'Any OpenAI-compatible API endpoint',
    npm: '@ai-sdk/openai-compatible',
    options: {
      baseURL: 'https://api.example.com/v1',
    },
    requiresApiKey: true,
    docsUrl: 'https://opencode.ai/docs/providers/#custom-provider',
  },
]

export function getProviderTemplate(id: string): ProviderTemplate | undefined {
  return PROVIDER_TEMPLATES.find((t) => t.id === id)
}
