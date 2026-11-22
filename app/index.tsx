//Tela inicial

import React, { useState } from "react";
import { View, Text, ScrollView, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";

import { useTasks } from "../hooks/useTasks";
import { Task } from "../types/task";

import { HeaderGreeting } from "../components/HeaderGreeting";
import { WeekDaySelector, DayItem } from "../components/WeekDaySelector";
import { DailyProgressCard } from "../components/DailyProgressCard";
import { EmptyState } from "../components/EmptyState";
import { TaskCard } from "../components/TaskCard";
import { FloatingActionButton } from "../components/FloatingActionButton";
import { BottomTabBar } from "../components/BottomTabBar";
import { formatSectionLabel, toISODate } from "../utils/date";
import { styles } from "../styles/home.styles";

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

// Cada dia da semana também guarda a data completa (AAAA-MM-DD)
interface WeekDay extends DayItem {
  iso: string;
}

// Ex.: "Segunda-feira, 2 de novembro"
function getTodayText(): string {
  const today = new Date();
  return `${WEEKDAY_NAMES[today.getDay()]}, ${today.getDate()} de ${MONTH_NAMES[today.getMonth()]}`;
}

// Semana de segunda a domingo, com o dia de hoje selecionado
function getWeekDays(): WeekDay[] {
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
      iso: toISODate(day),
    };
  });
}

// Tarefas sem horário ficam no fim do dia
const sortByTime = (a: Task, b: Task) =>
  (a.time ?? "99:99").localeCompare(b.time ?? "99:99");

export default function HomeScreen() {
  const router = useRouter();

  const { tasks, toggleTask } = useTasks();

  const [days, setDays] = useState<WeekDay[]>(getWeekDays);

  const handleSelectDay = (dayNumber: number) => {
    setDays((prev) =>
      prev.map((d) => ({ ...d, isSelected: d.dayNumber === dayNumber })),
    );
  };

  // Só as tarefas do dia selecionado
  const selectedDate =
    days.find((d) => d.isSelected)?.iso ?? toISODate(new Date());
  const dayTasks = tasks
    .filter((task) => task.date === selectedDate)
    .sort(sortByTime);

  const completedCount = dayTasks.filter((t) => t.completed).length;
  const totalCount = dayTasks.length;
  // Dias da semana que têm pelo menos uma tarefa (mostram o ponto)
  const taskDates = new Set(tasks.map((task) => task.date));
  const daysWithDots = days.map((d) => ({
    ...d,
    hasTasks: taskDates.has(d.iso),
  }));
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

          <WeekDaySelector days={daysWithDots} onSelectDay={handleSelectDay} />

          <DailyProgressCard
            completedCount={completedCount}
            totalCount={totalCount}
          />

          <Text style={styles.sectionTitle}>
            {formatSectionLabel(selectedDate)}
          </Text>

          {dayTasks.length === 0 ? (
            <EmptyState onPressNewTask={() => router.push("/new-task")} />
          ) : (
            dayTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={toggleTask}
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
