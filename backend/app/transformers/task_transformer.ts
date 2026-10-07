import { BaseTransformer } from '@adonisjs/core/transformers'
import type Task from '#models/task'

/**
 * Del responsable solo se expone el nombre: ni correo ni id de cuenta.
 * De las fechas solo `dueDate`; `isOverdue` se calcula con el día de
 * referencia recibido y no se guarda.
 */
export default class TaskTransformer extends BaseTransformer<Task> {
  constructor(
    resource: Task,
    protected today: string
  ) {
    super(resource)
  }

  toObject() {
    return {
      ...this.pick(this.resource, ['id', 'title', 'status']),
      assignee: { fullName: this.resource.assignee.fullName },
      dueDate: this.resource.dueDate?.toISODate() ?? null,
      isOverdue: this.resource.isOverdueOn(this.today),
    }
  }
}
