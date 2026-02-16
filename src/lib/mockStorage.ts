import { User, Workspace, Board, List, Card } from '@/types/entities'

const STORAGE_KEYS = {
    USERS: 'taskflow_users',
    WORKSPACES: 'taskflow_workspaces',
    BOARDS: 'taskflow_boards',
    LISTS: 'taskflow_lists',
    CARDS: 'taskflow_cards',
    CURRENT_USER: 'taskflow_current_user',
}

class MockStorage {
    constructor() {
        this.initialize()
    }

    private initialize() {
        if (typeof window === 'undefined') return
        const users = this.getUsers()
        if (users.length === 0) {
            // Seed a default user
            const defaultUser: User = {
                id: 'default-user-id',
                name: 'Demo User',
                email: 'demo@example.com',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }
            this.addUser(defaultUser)

            // Seed a workspace
            const defaultWs: Workspace = {
                id: 'default-ws-id',
                name: 'Personal Projects',
                owner_id: defaultUser.id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }
            this.addWorkspace(defaultWs)

            // Seed a board
            const defaultBoard: Board = {
                id: 'default-board-id',
                name: 'Daily Tasks',
                workspace_id: defaultWs.id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }
            this.addBoard(defaultBoard)

            // Seed lists
            const todoList: List = {
                id: 'todo-list-id',
                title: 'To Do',
                board_id: defaultBoard.id,
                position: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }
            this.addList(todoList)

            const doneList: List = {
                id: 'done-list-id',
                title: 'Done',
                board_id: defaultBoard.id,
                position: 1,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }
            this.addList(doneList)

            // Seed cards
            const card1: Card = {
                id: 'card-1-id',
                title: 'Welcome to TaskFlow',
                list_id: todoList.id,
                position: 0,
                priority: 'medium',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }
            this.addCard(card1)
        }
    }

    public get<T>(key: string): T[] {
        const data = localStorage.getItem(key)
        return data ? JSON.parse(data) : []
    }

    public set<T>(key: string, data: T[]): void {
        localStorage.setItem(key, JSON.stringify(data))
    }

    // Users
    getUsers(): User[] {
        return this.get<User>(STORAGE_KEYS.USERS)
    }

    addUser(user: User): void {
        const users = this.getUsers()
        users.push(user)
        this.set(STORAGE_KEYS.USERS, users)
    }

    // Workspaces
    getWorkspaces(): Workspace[] {
        return this.get<Workspace>(STORAGE_KEYS.WORKSPACES)
    }

    addWorkspace(workspace: Workspace): void {
        const workspaces = this.getWorkspaces()
        workspaces.push(workspace)
        this.set(STORAGE_KEYS.WORKSPACES, workspaces)
    }

    updateWorkspace(id: string, data: Partial<Workspace>): Workspace {
        const workspaces = this.getWorkspaces()
        const index = workspaces.findIndex((ws) => ws.id === id)
        if (index === -1) throw new Error('Workspace not found')
        workspaces[index] = { ...workspaces[index], ...data }
        this.set(STORAGE_KEYS.WORKSPACES, workspaces)
        return workspaces[index]
    }

    deleteWorkspace(id: string): void {
        const workspaces = this.getWorkspaces()
        this.set(STORAGE_KEYS.WORKSPACES, workspaces.filter((ws) => ws.id !== id))
    }

    // Boards
    getBoards(workspaceId: string): Board[] {
        return this.get<Board>(STORAGE_KEYS.BOARDS).filter((b) => b.workspace_id === workspaceId)
    }

    addBoard(board: Board): void {
        const boards = this.get<Board>(STORAGE_KEYS.BOARDS)
        boards.push(board)
        this.set(STORAGE_KEYS.BOARDS, boards)
    }

    // Lists
    getLists(boardId: string): List[] {
        return this.get<List>(STORAGE_KEYS.LISTS).filter((l) => l.board_id === boardId)
    }

    addList(list: List): void {
        const lists = this.get<List>(STORAGE_KEYS.LISTS)
        lists.push(list)
        this.set(STORAGE_KEYS.LISTS, lists)
    }

    // Cards
    getCards(listId: string): Card[] {
        return this.get<Card>(STORAGE_KEYS.CARDS).filter((c) => c.list_id === listId)
    }

    addCard(card: Card): void {
        const cards = this.get<Card>(STORAGE_KEYS.CARDS)
        cards.push(card)
        this.set(STORAGE_KEYS.CARDS, cards)
    }
}

export const mockStorage = new MockStorage()
