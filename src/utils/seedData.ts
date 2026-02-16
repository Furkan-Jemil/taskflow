import { workspaceService } from '@/features/workspaces/services/workspaceService'
import { boardService } from '@/features/boards/services/boardService'
import { listService } from '@/features/lists/services/listService'
import { cardService } from '@/features/cards/services/cardService'

export async function seedDemoData() {
    try {
        // 1. Create "Personal" Workspace
        const personalWs = await workspaceService.create('Personal Projects')

        // Create "Daily Tasks" Board
        const dailyBoard = await boardService.create(personalWs.id, 'Daily Tasks')

        // Create Lists
        const todoList = await listService.create(dailyBoard.id, 'To Do')
        const progressList = await listService.create(dailyBoard.id, 'In Progress')
        const doneList = await listService.create(dailyBoard.id, 'Done')

        // Create Cards
        await cardService.create(todoList.id, 'Buy groceries')
        await cardService.create(todoList.id, 'Schedule dentist appointment')
        await cardService.create(progressList.id, 'Read 10 pages of a book')
        await cardService.create(doneList.id, 'Morning workout')

        // 2. Create "Work" Workspace
        const workWs = await workspaceService.create('Work')

        // Create "Project Alpha" Board
        const alphaBoard = await boardService.create(workWs.id, 'Project Alpha')

        await listService.create(alphaBoard.id, 'Backlog')
        const devList = await listService.create(alphaBoard.id, 'In Development')
        await listService.create(alphaBoard.id, 'Review')
        await listService.create(alphaBoard.id, 'Complete')

        await cardService.create(devList.id, 'Implement authentication')
        await cardService.create(devList.id, 'Design database schema')

        return true
    } catch (error) {
        console.error('Failed to seed data:', error)
        throw error
    }
}
