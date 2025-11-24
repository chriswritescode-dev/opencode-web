import { Database } from 'bun:sqlite'
import { logger } from '../utils/logger'
import type { 
  UserPreferences, 
  SettingsResponse, 
  OpenCodeConfig,
  CreateOpenCodeConfigRequest,
  UpdateOpenCodeConfigRequest,
  OpenCodeConfigResponse 
} from '../types/settings'
import {
  UserPreferencesSchema,
  OpenCodeConfigSchema,
  OpenCodeConfigMetadataSchema,
  DEFAULT_USER_PREFERENCES,
} from '../types/settings'

export class SettingsService {
  constructor(private db: Database) {}

  getSettings(userId: string = 'default'): SettingsResponse {
    const row = this.db
      .query('SELECT preferences, updated_at FROM user_preferences WHERE user_id = ?')
      .get(userId) as { preferences: string; updated_at: number } | undefined

    if (!row) {
      return {
        preferences: DEFAULT_USER_PREFERENCES,
        updatedAt: Date.now(),
      }
    }

    try {
      const parsed = JSON.parse(row.preferences)
      const validated = UserPreferencesSchema.parse({
        ...DEFAULT_USER_PREFERENCES,
        ...parsed,
      })

      return {
        preferences: validated,
        updatedAt: row.updated_at,
      }
    } catch (error) {
      logger.error('Failed to parse user preferences, returning defaults', error)
      return {
        preferences: DEFAULT_USER_PREFERENCES,
        updatedAt: row.updated_at,
      }
    }
  }

  updateSettings(
    updates: Partial<UserPreferences>,
    userId: string = 'default'
  ): SettingsResponse {
    const current = this.getSettings(userId)
    const merged: UserPreferences = {
      ...current.preferences,
      ...updates,
    }

    const validated = UserPreferencesSchema.parse(merged)
    const updatedAt = Date.now()

    this.db
      .query(
        `INSERT INTO user_preferences (user_id, preferences, updated_at)
         VALUES (?, ?, ?)
         ON CONFLICT(user_id) DO UPDATE SET
           preferences = excluded.preferences,
           updated_at = excluded.updated_at`
      )
      .run(userId, JSON.stringify(validated), updatedAt)

    logger.info(`Updated preferences for user: ${userId}`)

    return {
      preferences: validated,
      updatedAt,
    }
  }

  resetSettings(userId: string = 'default'): SettingsResponse {
    this.db.query('DELETE FROM user_preferences WHERE user_id = ?').run(userId)

    logger.info(`Reset preferences for user: ${userId}`)

    return {
      preferences: DEFAULT_USER_PREFERENCES,
      updatedAt: Date.now(),
    }
  }

  getOpenCodeConfigs(userId: string = 'default'): OpenCodeConfigResponse {
    const rows = this.db
      .query('SELECT * FROM opencode_configs WHERE user_id = ? ORDER BY created_at DESC')
      .all(userId) as Array<{
        id: number
        user_id: string
        config_name: string
        config_content: string
        is_default: boolean
        created_at: number
        updated_at: number
      }>

    const configs: OpenCodeConfig[] = []
    let defaultConfig: OpenCodeConfig | null = null

    for (const row of rows) {
      try {
        const content = JSON.parse(row.config_content)
        const validated = OpenCodeConfigSchema.parse(content)
        
        const config: OpenCodeConfig = {
          id: row.id,
          name: row.config_name,
          content: validated,
          isDefault: Boolean(row.is_default),
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }

        configs.push(config)
        
        if (config.isDefault) {
          defaultConfig = config
        }
      } catch (error) {
        logger.error(`Failed to parse config ${row.config_name}:`, error)
      }
    }

    return {
      configs,
      defaultConfig,
    }
  }

  createOpenCodeConfig(
    request: CreateOpenCodeConfigRequest,
    userId: string = 'default'
  ): OpenCodeConfig {
    const contentValidated = OpenCodeConfigSchema.parse(request.content)
    const now = Date.now()

    if (request.isDefault) {
      this.db
        .query('UPDATE opencode_configs SET is_default = FALSE WHERE user_id = ?')
        .run(userId)
    }

    const result = this.db
      .query(
        `INSERT INTO opencode_configs (user_id, config_name, config_content, is_default, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(
        userId,
        request.name,
        JSON.stringify(contentValidated),
        request.isDefault || false,
        now,
        now
      )

    const config: OpenCodeConfig = {
      id: result.lastInsertRowid as number,
      name: request.name,
      content: contentValidated,
      isDefault: request.isDefault || false,
      createdAt: now,
      updatedAt: now,
    }

    logger.info(`Created OpenCode config '${config.name}' for user: ${userId}`)
    return config
  }

  updateOpenCodeConfig(
    configName: string,
    request: UpdateOpenCodeConfigRequest,
    userId: string = 'default'
  ): OpenCodeConfig | null {
    const existing = this.db
      .query('SELECT * FROM opencode_configs WHERE user_id = ? AND config_name = ?')
      .get(userId, configName) as {
        id: number
        config_content: string
        is_default: boolean
        created_at: number
      } | undefined

    if (!existing) {
      return null
    }

    const contentValidated = OpenCodeConfigSchema.parse(request.content)
    const now = Date.now()

    if (request.isDefault) {
      this.db
        .query('UPDATE opencode_configs SET is_default = FALSE WHERE user_id = ?')
        .run(userId)
    }

    this.db
      .query(
        `UPDATE opencode_configs 
         SET config_content = ?, is_default = ?, updated_at = ?
         WHERE user_id = ? AND config_name = ?`
      )
      .run(
        JSON.stringify(contentValidated),
        request.isDefault !== undefined ? request.isDefault : existing.is_default,
        now,
        userId,
        configName
      )

    const config: OpenCodeConfig = {
      id: existing.id,
      name: configName,
      content: contentValidated,
      isDefault: request.isDefault !== undefined ? request.isDefault : existing.is_default,
      createdAt: existing.created_at,
      updatedAt: now,
    }

    logger.info(`Updated OpenCode config '${configName}' for user: ${userId}`)
    return config
  }

  deleteOpenCodeConfig(configName: string, userId: string = 'default'): boolean {
    const result = this.db
      .query('DELETE FROM opencode_configs WHERE user_id = ? AND config_name = ?')
      .run(userId, configName)

    const deleted = result.changes > 0
    if (deleted) {
      logger.info(`Deleted OpenCode config '${configName}' for user: ${userId}`)
    }

    return deleted
  }

  setDefaultOpenCodeConfig(configName: string, userId: string = 'default'): OpenCodeConfig | null {
    const existing = this.db
      .query('SELECT * FROM opencode_configs WHERE user_id = ? AND config_name = ?')
      .get(userId, configName) as {
        id: number
        config_content: string
        created_at: number
      } | undefined

    if (!existing) {
      return null
    }

    this.db
      .query('UPDATE opencode_configs SET is_default = FALSE WHERE user_id = ?')
      .run(userId)

    const now = Date.now()
    this.db
      .query(
        `UPDATE opencode_configs 
         SET is_default = TRUE, updated_at = ?
         WHERE user_id = ? AND config_name = ?`
      )
      .run(now, userId, configName)

    try {
      const content = JSON.parse(existing.config_content)
      const validated = OpenCodeConfigSchema.parse(content)

      const config: OpenCodeConfig = {
        id: existing.id,
        name: configName,
        content: validated,
        isDefault: true,
        createdAt: existing.created_at,
        updatedAt: now,
      }

      logger.info(`Set '${configName}' as default OpenCode config for user: ${userId}`)
      return config
    } catch (error) {
      logger.error(`Failed to parse config ${configName}:`, error)
      return null
    }
  }

  getDefaultOpenCodeConfig(userId: string = 'default'): OpenCodeConfig | null {
    const row = this.db
      .query('SELECT * FROM opencode_configs WHERE user_id = ? AND is_default = TRUE')
      .get(userId) as {
        id: number
        config_name: string
        config_content: string
        created_at: number
        updated_at: number
      } | undefined

    if (!row) {
      return null
    }

    try {
      const content = JSON.parse(row.config_content)
      const validated = OpenCodeConfigSchema.parse(content)

      return {
        id: row.id,
        name: row.config_name,
        content: validated,
        isDefault: true,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }
    } catch (error) {
      logger.error(`Failed to parse default config:`, error)
      return null
    }
  }

  getOpenCodeConfigByName(configName: string, userId: string = 'default'): OpenCodeConfig | null {
    const row = this.db
      .query('SELECT * FROM opencode_configs WHERE user_id = ? AND config_name = ?')
      .get(userId, configName) as {
        id: number
        config_name: string
        config_content: string
        is_default: boolean
        created_at: number
        updated_at: number
      } | undefined

    if (!row) {
      return null
    }

    try {
      const content = JSON.parse(row.config_content)
      const validated = OpenCodeConfigSchema.parse(content)

      return {
        id: row.id,
        name: row.config_name,
        content: validated,
        isDefault: Boolean(row.is_default),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }
    } catch (error) {
      logger.error(`Failed to parse config ${configName}:`, error)
      return null
    }
  }

  getOpenCodeConfigContent(configName: string, userId: string = 'default'): string | null {
    const config = this.getOpenCodeConfigByName(configName, userId)
    
    if (!config) {
      logger.error(`Config '${configName}' not found for user ${userId}`)
      return null
    }

    try {
      return JSON.stringify(config.content, null, 2)
    } catch (error) {
      logger.error(`Failed to stringify config '${configName}':`, error)
      return null
    }
  }
}
