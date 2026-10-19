//dados fake
import { Task } from '../types/task';

export const MOCK_TASKS: Task[] = [
   {
    id: '1',
    title: 'Fazer entrega da semana',
    category: 'Trabalho',
    priority: 'media',
    date: '2026-09-18',
    completed: true,
    subtasks: [
      { id: 's1', title: 'Editar revisão', completed: true},
      { id: 's2', title: 'Realizar entrega', completed: true},
    ],
  },
  {
    id: '2',
    title: 'Fazer trabalho de Engenharia',
    category: 'Estudos',
    priority: 'alta',
    date: '2026-09-18',
    completed: false,
    subtasks: [
      { id: 's1', title: 'Pesquisar referências', completed: true },
      { id: 's2', title: 'Criar modelo do banco', completed: true },
      { id: 's3', title: 'Fazer documentação', completed: false },
      { id: 's4', title: 'Revisar trabalho', completed: false }
    ],
  },
 
];