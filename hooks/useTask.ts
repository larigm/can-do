import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { Task } from "../types/task";
import {
  deleteTask,
  getTaskById,
  insertSubtask,
  toggleSubtaskCompleted,
  toggleTaskCompleted,
  updateTask,
  type UpdateTaskInput,
} from "../database/tasks";

export function useTask(id: string | undefined) {
  const db = useSQLiteContext();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTask = useCallback(async () => {
    setTask(id ? await getTaskById(db, id) : null);
    setLoading(false);
  }, [db, id]);

  useFocusEffect(
    useCallback(() => {
      loadTask();
    }, [loadTask]),
  );

  const toggleTask = async () => {
    if (!task) return;
    await toggleTaskCompleted(db, task.id);
    await loadTask();
  };

  const toggleSubtask = async (subtaskId: string) => {
    await toggleSubtaskCompleted(db, subtaskId);
    await loadTask();
  };

  const addSubtask = async (title: string) => {
    if (!task) return;
    await insertSubtask(db, task.id, title);
    await loadTask();
  };

  const removeTask = async () => {
    if (!task) return;
    await deleteTask(db, task.id);
  };
  const editTask = async (input: UpdateTaskInput) => {
    if (!task) return;
    await updateTask(db, task.id, input);
  };

  return {
    task,
    loading,
    toggleTask,
    toggleSubtask,
    addSubtask,
    removeTask,
    editTask,
  };
}
