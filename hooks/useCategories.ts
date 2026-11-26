import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { getCategories } from "../database/tasks";

// Categorias personalizadas já usadas em tarefas salvas
export function useCategories() {
  const db = useSQLiteContext();
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    getCategories(db).then(setCategories);
  }, [db]);

  return categories;
}