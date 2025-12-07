import axios from "axios"
import { API_BASE_URL } from "@/config"

export interface OAuthAuthorizeResponse {
  url: string
  method: "auto" | "code"
  instructions: string
}

export interface OAuthCallbackRequest {
  method: number
  code?: string
}

export interface ProviderAuthMethod {
  type: "oauth" | "api"
  label: string
}

export interface ProviderAuthMethods {
  [providerId: string]: ProviderAuthMethod[]
}

export const oauthApi = {
  authorize: async (providerId: string, method: number): Promise<OAuthAuthorizeResponse> => {
    const { data } = await axios.post(`${API_BASE_URL}/api/oauth/${providerId}/oauth/authorize`, {
      method,
    })
    return data
  },

  callback: async (providerId: string, request: OAuthCallbackRequest): Promise<boolean> => {
    const { data } = await axios.post(`${API_BASE_URL}/api/oauth/${providerId}/oauth/callback`, request)
    return data
  },

  getAuthMethods: async (): Promise<ProviderAuthMethods> => {
    const { data } = await axios.get(`${API_BASE_URL}/api/oauth/auth-methods`)
    return data.providers || data
  },
}