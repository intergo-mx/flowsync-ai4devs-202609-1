import { BaseTransformer } from '@adonisjs/core/transformers'
import type Task from '#models/task'

/**
 * Del responsable solo se expone el nombre: ni correo ni id de cuenta.
 * La tarea no expone fechas.
 */
export default class TaskTransformer extends BaseTransformer<Task> {
  toObject() {
    return {
      ...this.pick(this.resource, ['id', 'title', 'status']),
      assignee: { fullName: this.resource.assignee.fullName },
    }
  }
}
