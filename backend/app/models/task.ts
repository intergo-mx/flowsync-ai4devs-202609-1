import User from '#models/user'
import { TaskSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

/**
 * Conjunto cerrado de estados. Es la única fuente: de aquí salen el
 * validador y el valor por defecto.
 */
export const TASK_STATUSES = ['pending', 'in_progress', 'done'] as const
export type TaskStatus = (typeof TASK_STATUSES)[number]

export default class Task extends TaskSchema {
  @belongsTo(() => User, { foreignKey: 'assigneeId' })
  declare assignee: BelongsTo<typeof User>

  /**
   * Única implementación de la regla de vencimiento. `today` es un día de
   * calendario `YYYY-MM-DD`: se comparan cadenas ISO, nunca instantes, así que
   * vencer hoy no es estar vencida y no hay conversión de huso.
   */
  isOverdueOn(today: string): boolean {
    if (!this.dueDate || this.status === 'done') return false
    const due = this.dueDate.toISODate()
    return due !== null && due < today
  }
}
