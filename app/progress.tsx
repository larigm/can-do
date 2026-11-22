import React from "react";
import { View, Text, ScrollView, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTasks } from "../hooks/useTasks";
import { BottomTabBar } from "../components/BottomTabBar";
import { getCurrentWeek, getTodayISO } from "../utils/date";
import { colors } from "../constants/theme";
import { styles } from "../styles/progress.styles";

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

interface CategoryStat {
  name: string;
  total: number;
  done: number;
}

export default function ProgressScreen() {
  const { tasks } = useTasks();
  const now = new Date();
  const today = getTodayISO();

  // Números gerais
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const overdue = tasks.filter((t) => !t.completed && t.date < today).length;
  const pending = total - completed - overdue;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Produtividade da semana atual (segunda a domingo)
  const week = getCurrentWeek().map((day) => {
    const dayTasks = tasks.filter((t) => t.date === day.iso);
    return {
      ...day,
      total: dayTasks.length,
      done: dayTasks.filter((t) => t.completed).length,
    };
  });
  const maxPerDay = Math.max(1, ...week.map((d) => d.total));

  // Progresso por categoria
  const byCategory = tasks.reduce<Record<string, CategoryStat>>((acc, task) => {
    const item = acc[task.category] ?? {
      name: task.category,
      total: 0,
      done: 0,
    };
    item.total += 1;
    if (task.completed) item.done += 1;
    acc[task.category] = item;
    return acc;
  }, {});
  const categories = Object.values(byCategory).sort((a, b) => b.total - a.total);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.title}>Progresso</Text>
          <Text style={styles.subtitle}>
            {MONTHS[now.getMonth()]} {now.getFullYear()}
          </Text>

          {/* Números gerais */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={colors.success}
              />
              <Text style={styles.statValue}>{completed}</Text>
              <Text style={styles.statLabel}>Concluídas</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="time" size={24} color={colors.primary} />
              <Text style={styles.statValue}>{pending}</Text>
              <Text style={styles.statLabel}>Pendentes</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="alert-circle" size={24} color={colors.danger} />
              <Text style={styles.statValue}>{overdue}</Text>
              <Text style={styles.statLabel}>Atrasadas</Text>
            </View>
          </View>

          {/* Taxa de conclusão */}
          <View style={styles.card}>
            <View style={styles.rateRow}>
              <Text style={styles.cardTitle}>Taxa de conclusão</Text>
              <Text style={styles.rateValue}>{rate}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${rate}%` }]} />
            </View>
            <Text style={styles.hintText}>
              {completed} de {total} tarefas concluídas
            </Text>
          </View>

          {/* Produtividade semanal */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Produtividade semanal</Text>
            <View style={styles.chartRow}>
              {week.map((day) => (
                <View key={day.iso} style={styles.chartColumn}>
                  <View style={styles.barArea}>
                    {day.total > 0 && (
                      <View
                        style={[
                          styles.barTrack,
                          { height: `${(day.total / maxPerDay) * 100}%` },
                        ]}
                      >
                        <View
                          style={[
                            styles.barFill,
                            { height: `${(day.done / day.total) * 100}%` },
                          ]}
                        />
                      </View>
                    )}
                  </View>
                  <Text style={styles.chartLabel}>{day.weekday}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.hintText}>
              Parte colorida: tarefas concluídas no dia
            </Text>
          </View>

          {/* Por categoria */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Por categoria</Text>
            {categories.length === 0 ? (
              <Text style={styles.emptyText}>
                Crie tarefas para acompanhar o progresso por categoria.
              </Text>
            ) : (
              categories.map((category) => (
                <View key={category.name} style={styles.categoryRow}>
                  <View style={styles.categoryHeader}>
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <Text style={styles.categoryCount}>
                      {category.done}/{category.total}
                    </Text>
                  </View>
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${(category.done / category.total) * 100}%` },
                      ]}
                    />
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>

        <BottomTabBar currentTab="progresso" />
      </View>
    </SafeAreaView>
  );
}