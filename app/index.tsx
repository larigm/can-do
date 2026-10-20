//Tela inicial

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";

import { MOCK_TASKS } from "../mocks/types";
import { Task } from "../types/task";

import { HeaderGreeting } from "../components/HeaderGreeting";
import { WeekDaySelector, DayItem } from "../components/WeekDaySelector";
import { DailyProgressCard } from "../components/DailyProgressCard";
import { EmptyState } from "../components/EmptyState";
import { TaskCard } from "../components/TaskCard";
import { FloatingActionButton } from "../components/FloatingActionButton";
import { BottomTabBar } from "../components/BottomTabBar";

export default function HomeScreen() {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);

  const [days, setDays] = useState<DayItem[]>([
    { weekday: "S", dayNumber: 14 },
    { weekday: "T", dayNumber: 15 },
    { weekday: "Q", dayNumber: 16 },
    { weekday: "Q", dayNumber: 17 },
    { weekday: "S", dayNumber: 18, isSelected: true },
    { weekday: "S", dayNumber: 19 },
    { weekday: "D", dayNumber: 20 },
  ]);

  const handleSelectDay = (dayNumber: number) => {
    setDays((prev) =>
      prev.map((d) => ({ ...d, isSelected: d.dayNumber === dayNumber })),
    );
  };

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t,
      ),
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <HeaderGreeting
            userName="Larissa"
            dateText="Quinta-feira, 18 de setembro"
            onPressSettings={() => alert("Configurações")}
          />

          <WeekDaySelector days={days} onSelectDay={handleSelectDay} />

          <DailyProgressCard
            completedCount={completedCount}
            totalCount={totalCount}
          />

          <Text style={styles.sectionTitle}>Hoje</Text>

          {tasks.length === 0 ? (
            <EmptyState onPressNewTask={() => router.push("/new-task")} />
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleTask}
                onPressDetails={(id) => router.push({ pathname: '/task-details', params: { id } })}
              />
            ))
          )}
        </ScrollView>

        <FloatingActionButton onPress={() => router.push("/new-task")} />

        <BottomTabBar currentTab="hoje" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 90,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 16,
  },
});
