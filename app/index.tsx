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

const WEEKDAY_NAMES = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

const MONTH_NAMES = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

// Ex.: "Segunda-feira, 2 de novembro"
function getTodayText(): string {
  const today = new Date();
  return `${WEEKDAY_NAMES[today.getDay()]}, ${today.getDate()} de ${MONTH_NAMES[today.getMonth()]}`;
}

// Semana de segunda a domingo, com o dia de hoje selecionado
function getWeekDays(): DayItem[] {
  const today = new Date();
  const daysSinceMonday = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - daysSinceMonday);

  return ["S", "T", "Q", "Q", "S", "S", "D"].map((weekday, index) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + index);
    return {
      weekday,
      dayNumber: day.getDate(),
      isSelected: day.toDateString() === today.toDateString(),
    };
  });
}
export default function HomeScreen() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [days, setDays] = useState<DayItem[]>(getWeekDays);

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
            dateText={getTodayText()}
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
                onPressDetails={(id) =>
                  router.push({ pathname: "/task-details", params: { id } })
                }
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
