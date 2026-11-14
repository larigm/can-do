import { type SQLiteDatabase } from "expo-sqlite";
import { Task, TaskCategory, TaskPriority } from "../types/task";

interface TaskRow {
  id: number;
  title: string;
  description: string | null;
  category: string;
  priority: string;
  date: string;
  time: string | null;
  completed: number;
}

interface SubtaskRow {
  id: number;
  task_id: number;
  title: string;
  completed: number;
}

export interface NewTaskInput {
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  subtasks: string[];
}

// Data de hoje no formato AAAA-MM-DD
function getTodayISO(): string {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

// Lista as tarefas (mais novas primeiro), já com as subtarefas
export async function getTasks(db: SQLiteDatabase): Promise<Task[]> {
  const taskRows = await db.getAllAsync<TaskRow>(
    "SELECT * FROM tasks ORDER BY id DESC",
  );
  const subtaskRows = await db.getAllAsync<SubtaskRow>(
    "SELECT * FROM subtasks ORDER BY id",
  );

  return taskRows.map((row) => ({
    id: String(row.id),
    title: row.title,
    description: row.description ?? undefined,
    category: row.category as TaskCategory,
    priority: row.priority as TaskPriority,
    date: row.date,
    time: row.time ?? undefined,
    completed: row.completed === 1,
    subtasks: subtaskRows
      .filter((s) => s.task_id === row.id)
      .map((s) => ({
        id: String(s.id),
        title: s.title,
        completed: s.completed === 1,
      })),
  }));
}

// Cria a tarefa e as subtarefas juntas (se uma falhar, nenhuma é salva)
export async function createTask(db: SQLiteDatabase, input: NewTaskInput) {
  await db.withTransactionAsync(async () => {
    const result = await db.runAsync(
      "INSERT INTO tasks (title, description, category, priority, date) VALUES (?, ?, ?, ?, ?)",
      input.title,
      input.description ?? null,
      input.category,
      input.priority,
      getTodayISO(),
    );

    for (const subtaskTitle of input.subtasks) {
      await db.runAsync(
        "INSERT INTO subtasks (task_id, title) VALUES (?, ?)",
        result.lastInsertRowId,
        subtaskTitle,
      );
    }
  });
}

// Alterna entre concluída e não concluída
export async function toggleTaskCompleted(db: SQLiteDatabase, id: string) {
  await db.runAsync(
    "UPDATE tasks SET completed = 1 - completed WHERE id = ?",
    Number(id),
  );
}