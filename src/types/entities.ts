import { BaseEntity } from './index'

export type UserRole = 'owner' | 'member'

export interface User extends BaseEntity {
    name: string
    email: string
    avatar_url?: string
}

export interface Workspace extends BaseEntity {
    name: string
    owner_id: string
}

export interface Board extends BaseEntity {
    workspace_id: string
    name: string
    description?: string
}

export interface List extends BaseEntity {
    board_id: string
    title: string
    position: number
}

export interface Card extends BaseEntity {
    list_id: string
    title: string
    description?: string
    priority: 'low' | 'medium' | 'high'
    due_date?: string
    position: number
}
