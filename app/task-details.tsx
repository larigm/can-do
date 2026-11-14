//detalhes das tarefas
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBar } from "../components/BottomTabBar";
import { useTask } from "../hooks/useTask";
import { colors } from "../constants/theme";
import { styles } from "../styles/taskDetails.styles";

const MONTHS = [
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

function formatDate(date: string) {
  const [, month, day] = date.split("-");
  return `${Number(day)} de ${MONTHS[Number(month) - 1]}`;
}

export default function TaskDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { task, loading, toggleTask, toggleSubtask, addSubtask, removeTask } =
    useTask(id);

  // Enquanto carrega do banco, mostra a tela vazia
  if (loading) {
    return <SafeAreaView style={styles.safeArea} />;
  }

  if (!task) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Tarefa não encontrada.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const subtasks = task.subtasks;
  const completedSubtasksCount = subtasks.filter((s) => s.completed).length;

  const handleDelete = () => {
    Alert.alert(
      "Excluir tarefa",
      "Tem certeza que deseja excluir esta tarefa?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            await removeTask();
            router.back();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.circleButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Detalhes da tarefa</Text>
            <Text style={styles.headerSubtitle}>{task.title}</Text>
          </View>

          <TouchableOpacity
            style={styles.circleButton}
            onPress={() => alert("Opções")}
            activeOpacity={0.7}
          >
            <Ionicons
              name="settings-outline"
              size={22}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Card Principal de Informações */}
          <View style={styles.mainCard}>
            {/* Título e Checkbox da Tarefa */}
            <View style={styles.taskTitleRow}>
              <TouchableOpacity
                style={[
                  styles.mainCheckbox,
                  task.completed && styles.mainCheckboxCompleted,
                ]}
                onPress={toggleTask}
              >
                {task.completed && (
                  <Ionicons name="checkmark" size={16} color={colors.surface} />
                )}
              </TouchableOpacity>

              <View style={styles.taskTitleInfo}>
                <Text
                  style={[
                    styles.taskTitle,
                    task.completed && styles.taskTitleDone,
                  ]}
                >
                  {task.title}
                </Text>
                <View style={styles.badgesRow}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>
                      {task.category}
                    </Text>
                  </View>
                  <View style={styles.priorityDot} />
                </View>
              </View>

              <TouchableOpacity
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name="ellipsis-vertical"
                  size={20}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            {/* Descrição */}
            <View>
              <Text style={styles.sectionLabel}>Descrição</Text>
              <Text style={styles.descriptionText}>
                {task.description ?? "Sem descrição"}
              </Text>
            </View>

            <View style={styles.divider} />

            {/* Data e Horário */}
            <View style={styles.dateTimeRow}>
              <View>
                <Text style={styles.sectionLabel}>Data</Text>
                <Text style={styles.dateTimeValue}>
                  {formatDate(task.date)}
                </Text>
              </View>
              <View style={styles.timeContainer}>
                <Text style={styles.sectionLabel}>Horário</Text>
                <Text style={styles.dateTimeValue}>{task.time ?? "--:--"}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Subtarefas */}
            <View>
              <View style={styles.subtasksHeader}>
                <Text style={styles.sectionLabel}>Subtarefas</Text>
                <Text style={styles.subtasksProgressText}>
                  {completedSubtasksCount} de {subtasks.length} concluídas
                </Text>
              </View>

              {subtasks.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.subtaskRow}
                  onPress={() => toggleSubtask(item.id)}
                  activeOpacity={0.7}
                >
                  {item.completed ? (
                    <View style={styles.checkedCircle}>
                      <Ionicons
                        name="checkmark"
                        size={14}
                        color={colors.surface}
                      />
                    </View>
                  ) : (
                    <View style={styles.uncheckedCircle} />
                  )}
                  <Text
                    style={[
                      styles.subtaskTitle,
                      item.completed && styles.subtaskTitleCompleted,
                    ]}
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Botões de Ação */}
          <TouchableOpacity
            style={styles.addSubtaskButton}
            onPress={() => addSubtask(`Nova subtarefa ${subtasks.length + 1}`)}
            activeOpacity={0.8}
          >
            <Text style={styles.addSubtaskButtonText}>
              + Adicionar subtarefa
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editTaskButton}
            onPress={() =>
              router.push({ pathname: "/new-task", params: { id: task.id } })
            }
            activeOpacity={0.8}
          >
            <Text style={styles.editTaskButtonText}>Editar tarefa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteTaskButton}
            onPress={handleDelete}
            activeOpacity={0.8}
          >
            <Text style={styles.deleteTaskButtonText}>Excluir tarefa</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Barra inferior */}
        <BottomTabBar currentTab="hoje" />
      </View>
    </SafeAreaView>
  );
}
