import Task from '#models/task'
import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import TaskTransformer from '#transformers/task_transformer'
import { createTaskValidator, referenceDayValidator, updateTaskValidator } from '#validators/task'

/**
 * Día de referencia de la lectura: el `today` de la consulta (el día local de
 * quien mira) o, si falta, el día actual en UTC.
 */
async function referenceDay({ request }: HttpContext): Promise<string> {
  const { today } = await request.validateUsing(referenceDayValidator, { data: request.qs() })

  return (today ?? DateTime.utc()).toISODate()!
}

export default class TasksController {
  /**
   * Sin `orderBy` a propósito: el orden de la lista es un punto abierto.
   */
  async index(ctx: HttpContext) {
    const today = await referenceDay(ctx)
    const tasks = await Task.query().preload('assignee')

    return ctx.serialize(TaskTransformer.transform(tasks, today))
  }

  async show(ctx: HttpContext) {
    const today = await referenceDay(ctx)
    const task = await Task.query().where('id', ctx.params.id).preload('assignee').firstOrFail()

    return ctx.serialize(TaskTransformer.transform(task, today))
  }

  async store(ctx: HttpContext) {
    const today = await referenceDay(ctx)
    const { title, dueDate } = await ctx.request.validateUsing(createTaskValidator)
    const user = ctx.auth.getUserOrFail()

    const task = await Task.create({
      title,
      status: 'pending',
      assigneeId: user.id,
      dueDate: dueDate ?? null,
    })
    await task.load('assignee')

    return ctx.serialize(TaskTransformer.transform(task, today))
  }

  async update(ctx: HttpContext) {
    const today = await referenceDay(ctx)
    const task = await Task.findOrFail(ctx.params.id)
    const { status, assigneeId, dueDate } = await ctx.request.validateUsing(updateTaskValidator)

    // Solo cambian los campos enviados: `merge` pisaría con `undefined` el resto.
    // `dueDate: null` quita la fecha; ausente la deja como estaba.
    if (status !== undefined) task.status = status
    if (assigneeId !== undefined) task.assigneeId = assigneeId
    if (dueDate !== undefined) task.dueDate = dueDate
    await task.save()
    await task.load('assignee')

    return ctx.serialize(TaskTransformer.transform(task, today))
  }
}
