import vine from '@vinejs/vine'
import { TASK_STATUSES } from '#models/task'

/**
 * Al crear solo se admite el título: cualquier otro campo se descarta.
 */
export const createTaskValidator = vine.create({
  title: vine.string().trim().minLength(1).maxLength(255),
})

/**
 * Al actualizar solo se admiten estado y responsable, ambos opcionales.
 * El título no se edita.
 */
export const updateTaskValidator = vine.create({
  status: vine.enum(TASK_STATUSES).optional(),
  assigneeId: vine.number().withoutDecimals().exists({ table: 'users', column: 'id' }).optional(),
})
