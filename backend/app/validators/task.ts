import vine from '@vinejs/vine'
import { TASK_STATUSES } from '#models/task'

/**
 * Fecha de calendario `YYYY-MM-DD` real. Las pasadas se aceptan; `null` o
 * cadena vacía (el bodyparser la convierte en `null`) la quitan.
 */
const dueDate = () => vine.date({ formats: ['YYYY-MM-DD'] }).optional()

/**
 * Al crear solo se admiten el título y la fecha opcional: cualquier otro
 * campo (incluido `isOverdue`) se descarta.
 */
export const createTaskValidator = vine.create({
  title: vine.string().trim().minLength(1).maxLength(255),
  dueDate: dueDate().nullable(),
})

/**
 * Al actualizar solo se admiten estado, responsable y fecha, todos
 * opcionales. El título no se edita.
 */
export const updateTaskValidator = vine.create({
  status: vine.enum(TASK_STATUSES).optional(),
  assigneeId: vine.number().withoutDecimals().exists({ table: 'users', column: 'id' }).optional(),
  dueDate: dueDate().nullable(),
})

/**
 * Día de referencia opcional con el que se calcula `isOverdue`.
 */
export const referenceDayValidator = vine.create({
  today: vine.date({ formats: ['YYYY-MM-DD'] }).optional(),
})
