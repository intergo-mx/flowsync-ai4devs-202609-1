import Task from '#models/task'
import type { HttpContext } from '@adonisjs/core/http'
import TaskTransformer from '#transformers/task_transformer'
import { createTaskValidator, updateTaskValidator } from '#validators/task'

export default class TasksController {
  /**
   * Sin `orderBy` a propósito: el orden de la lista es un punto abierto.
   */
  async index({ serialize }: HttpContext) {
    const tasks = await Task.query().preload('assignee')

    return serialize(TaskTransformer.transform(tasks))
  }

  async store({ auth, request, serialize }: HttpContext) {
    const { title } = await request.validateUsing(createTaskValidator)
    const user = auth.getUserOrFail()

    const task = await Task.create({ title, status: 'pending', assigneeId: user.id })
    await task.load('assignee')

    return serialize(TaskTransformer.transform(task))
  }

  async update({ params, request, serialize }: HttpContext) {
    const task = await Task.findOrFail(params.id)
    const { status, assigneeId } = await request.validateUsing(updateTaskValidator)

    // Solo cambian los campos enviados: `merge` pisaría con `undefined` el resto.
    if (status !== undefined) task.status = status
    if (assigneeId !== undefined) task.assigneeId = assigneeId
    await task.save()
    await task.load('assignee')

    return serialize(TaskTransformer.transform(task))
  }
}
