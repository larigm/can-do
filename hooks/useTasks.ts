import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { Task } from "../types/task";
import {
  deleteCompletedTasks,
  getTasks,
  toggleTaskCompleted,
} from "../database/tasks";

export function useTasks() {
  const db = useSQLiteContext();
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = useCallback(async () => {
    setTasks(await getTasks(db));
  }, [db]);

  // Recarrega sempre que a tela volta a ficar em foco (ex.: depois de criar uma tarefa)
  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks]),
  );

  const toggleTask = async (id: string) => {
    await toggleTaskCompleted(db, id);
    await loadTasks();
  };

  const clearCompleted = async () => {
    await deleteCompletedTasks(db);
    await loadTasks();
  };

  return { tasks, toggleTask, clearCompleted, reload: loadTasks };
}