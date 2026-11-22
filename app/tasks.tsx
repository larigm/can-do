import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

import { useTasks } from "../hooks/useTasks";
import { Task } from "../types/task";
import { TaskCard } from "../components/TaskCard";
import { FloatingActionButton } from "../components/FloatingActionButton";
import { BottomTabBar } from "../components/BottomTabBar";
import { formatSectionLabel } from "../utils/date";
import { styles } from "../styles/tasks.styles";

type Filter = "todas" | "pendentes" | "concluidas";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "todas", label: "Todas" },
  { key: "pendentes", label: "Pendentes" },
  { key: "concluidas", label: "Concluídas" },
];

// Tarefas sem horário ficam no fim de cada dia
const sortByTime = (a: Task, b: Task) =>
  (a.time ?? "99:99").localeCompare(b.time ?? "99:99");

export default function TasksScreen() {
  const router = useRouter();
  const { tasks, toggleTask } = useTasks();
  const [filter, setFilter] = useState<Filter>("todas");

  const filteredTasks = tasks.filter((task) => {
    if (filter === "pendentes") return !task.completed;
    if (filter === "concluidas") return task.completed;
    return true;
  });

  // Datas que aparecem na lista, em ordem crescente
  const dates = Array.from(new Set(filteredTasks.map((t) => t.date))).sort();

  const totalText =
    tasks.length === 1 ? "1 tarefa no total" : `${tasks.length} tarefas no total`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.title}>Tarefas</Text>
          <Text style={styles.subtitle}>{totalText}</Text>

          {/* Filtros */}
          <View style={styles.filtersRow}>
            {FILTERS.map((item) => {
              const isSelected = filter === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.filterChip,
                    isSelected && styles.filterChipSelected,
                  ]}
                  onPress={() => setFilter(item.key)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      isSelected && styles.filterChipTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Tarefas agrupadas por dia */}
          {filteredTasks.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma tarefa encontrada.</Text>
          ) : (
            dates.map((date) => (
              <View key={date}>
                <Text style={styles.sectionTitle}>
                  {formatSectionLabel(date)}
                </Text>
                {filteredTasks
                  .filter((task) => task.date === date)
                  .sort(sortByTime)
                  .map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggleComplete={toggleTask}
                      onPressDetails={(id) =>
                        router.push({
                          pathname: "/task-details",
                          params: { id },
                        })
                      }
                    />
                  ))}
              </View>
            ))
          )}
        </ScrollView>

        <FloatingActionButton onPress={() => router.push("/new-task")} />

        <BottomTabBar currentTab="tarefas" />
      </View>
    </SafeAreaView>
  );
}