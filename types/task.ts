//interface e tipos
export type TaskPriority = 'baixa' | 'media' | 'alta';
export type TaskCategory = 'Trabalho' | 'Estudos' | 'Pessoal' | 'Saúde';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  date: string;
  time?: string;
  completed: boolean;
  subtasks: Subtask[];
}