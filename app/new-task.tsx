import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import { createTask } from "../database/tasks";
import { useTask } from "../hooks/useTask";
import { TaskCategory } from "../types/task";
import {
  formatDateLabel,
  getDateOption,
  getNextDays,
  getTodayISO,
} from "../utils/date";

interface FormErrors {
  title?: string;
  description?: string;
  category?: string;
  subtask?: string;
  time?: string;
}

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export default function NewTaskScreen() {
  const router = useRouter();
  const db = useSQLiteContext();

  // Se vier um id pela rota, a tela funciona como edição
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;
  const { task: taskToEdit, editTask } = useTask(id);

  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Estudos");
  const [selectedPriority, setSelectedPriority] = useState<
    "baixa" | "media" | "alta"
  >("alta");
  const [selectedDate, setSelectedDate] = useState(getTodayISO());
  const [time, setTime] = useState("");

  // Estados das subtarefas
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [newSubtaskInput, setNewSubtaskInput] = useState("");

  // Mensagens de erro de validação
  const [errors, setErrors] = useState<FormErrors>({});

  const categories = [
    "Estudos",
    "Leitura",
    "Saúde",
    "Treino",
    "Trabalho",
    "Pessoal",
    "+ Nova",
  ];

  // Hoje e os próximos 13 dias (na edição, inclui a data atual da tarefa)
  const nextDays = getNextDays(14);
  const dateOptions = nextDays.some((d) => d.iso === selectedDate)
    ? nextDays
    : [getDateOption(selectedDate), ...nextDays];

  // No modo edição, preenche o formulário com os dados da tarefa
  useEffect(() => {
    if (!taskToEdit) return;
    setTaskName(taskToEdit.title);
    setDescription(taskToEdit.description ?? "");
    setSelectedCategory(taskToEdit.category);
    setSelectedPriority(taskToEdit.priority);
    setSelectedDate(taskToEdit.date);
    setTime(taskToEdit.time ?? "");
  }, [taskToEdit]);

  // Remove a mensagem de erro de um campo quando o usuário volta a mexer nele
  const clearError = (field: keyof FormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Máscara do horário: digita 1930 e vira 19:30
  const handleTimeChange = (text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, 4);
    const formatted =
      digits.length > 2 ? `${digits.slice(0, 2)}:${digits.slice(2)}` : digits;
    setTime(formatted);
    clearError("time");
  };

  const handleAddSubtask = () => {
    const title = newSubtaskInput.trim();

    if (!title) {
      setErrors((prev) => ({ ...prev, subtask: "Digite o nome da subtarefa." }));
      return;
    }
    if (subtasks.some((s) => s.toLowerCase() === title.toLowerCase())) {
      setErrors((prev) => ({
        ...prev,
        subtask: "Essa subtarefa já foi adicionada.",
      }));
      return;
    }

    setSubtasks([...subtasks, title]);
    setNewSubtaskInput("");
    clearError("subtask");
  };

  // Função para remover subtarefa
  const handleRemoveSubtask = (indexToRemove: number) => {
    setSubtasks(subtasks.filter((_, index) => index !== indexToRemove));
  };

  // Valida o formulário e guarda as mensagens de erro
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    const title = taskName.trim();

    if (!title) {
      newErrors.title = "O nome da tarefa é obrigatório.";
    } else if (title.length < 3) {
      newErrors.title = "O nome precisa ter pelo menos 3 caracteres.";
    } else if (title.length > 60) {
      newErrors.title = "O nome pode ter no máximo 60 caracteres.";
    }

    if (description.trim().length > 200) {
      newErrors.description = "A descrição pode ter no máximo 200 caracteres.";
    }

    if (selectedCategory === "+ Nova") {
      newErrors.category = "Escolha uma das categorias disponíveis.";
    }

    if (time && !TIME_REGEX.test(time)) {
      newErrors.time = "Use um horário válido no formato HH:MM (ex.: 19:30).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateTask = async () => {
    if (!validate()) return;

    const data = {
      title: taskName.trim(),
      description: description.trim() || undefined,
      category: selectedCategory as TaskCategory,
      priority: selectedPriority,
      date: selectedDate,
      time: time || undefined,
    };

    if (isEditing) {
      await editTask(data);
    } else {
      await createTask(db, { ...data, subtasks });
    }

    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditing ? "Editar tarefa" : "Nova tarefa"}
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Nome da tarefa */}
          <Text style={styles.label}>Nome da tarefa</Text>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            placeholder="Ex: Estudar para a prova"
            placeholderTextColor="#94A3B8"
            value={taskName}
            onChangeText={(text) => {
              setTaskName(text);
              clearError("title");
            }}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

          {/* Descrição */}
          <Text style={styles.label}>Descrição (opcional)</Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              errors.description && styles.inputError,
            ]}
            placeholder="Adicione detalhes sobre a tarefa..."
            placeholderTextColor="#94A3B8"
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              clearError("description");
            }}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          {errors.description && (
            <Text style={styles.errorText}>{errors.description}</Text>
          )}

          {/* Categoria */}
          <Text style={styles.label}>Categoria</Text>
          <View style={styles.categoriesContainer}>
            {categories.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    isSelected && styles.categoryChipSelected,
                  ]}
                  onPress={() => {
                    setSelectedCategory(category);
                    clearError("category");
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      isSelected && styles.categoryChipTextSelected,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {errors.category && (
            <Text style={styles.errorText}>{errors.category}</Text>
          )}

          {/* Prioridade */}
          <Text style={styles.label}>Prioridade</Text>
          <View style={styles.priorityContainer}>
            <TouchableOpacity
              style={[
                styles.priorityCard,
                selectedPriority === "baixa" &&
                  styles.priorityCardSelectedBaixa,
              ]}
              onPress={() => setSelectedPriority("baixa")}
              activeOpacity={0.7}
            >
              <View
                style={[styles.priorityDot, { backgroundColor: "#60A5FA" }]}
              />
              <Text style={styles.priorityText}>Baixa</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.priorityCard,
                selectedPriority === "media" &&
                  styles.priorityCardSelectedMedia,
              ]}
              onPress={() => setSelectedPriority("media")}
              activeOpacity={0.7}
            >
              <View
                style={[styles.priorityDot, { backgroundColor: "#FBBF24" }]}
              />
              <Text style={styles.priorityText}>Média</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.priorityCard,
                selectedPriority === "alta" && styles.priorityCardSelectedAlta,
              ]}
              onPress={() => setSelectedPriority("alta")}
              activeOpacity={0.7}
            >
              <View
                style={[styles.priorityDot, { backgroundColor: "#F87171" }]}
              />
              <Text style={styles.priorityText}>Alta</Text>
            </TouchableOpacity>
          </View>

          {/* Subtarefas (só ao criar; na edição são gerenciadas nos detalhes) */}
          {!isEditing && (
            <>
              <Text style={styles.label}>Subtarefas (opcional)</Text>

              {/* Lista de subtarefas criadas */}
              {subtasks.map((item, index) => (
                <View key={index} style={styles.subtaskItem}>
                  <View style={styles.subtaskContent}>
                    <Ionicons
                      name="checkbox-outline"
                      size={18}
                      color="#5B6BFE"
                      style={{ marginRight: 10 }}
                    />
                    <Text style={styles.subtaskText}>{item}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRemoveSubtask(index)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons
                      name="close-circle-outline"
                      size={20}
                      color="#94A3B8"
                    />
                  </TouchableOpacity>
                </View>
              ))}

              {/* Campo para adicionar nova subtarefa */}
              <View style={styles.addSubtaskRow}>
                <TextInput
                  style={[
                    styles.input,
                    styles.subtaskInput,
                    errors.subtask && styles.inputError,
                  ]}
                  placeholder="Adicionar subtarefa..."
                  placeholderTextColor="#94A3B8"
                  value={newSubtaskInput}
                  onChangeText={(text) => {
                    setNewSubtaskInput(text);
                    clearError("subtask");
                  }}
                  onSubmitEditing={handleAddSubtask}
                />
                <TouchableOpacity
                  style={styles.addSubtaskButton}
                  onPress={handleAddSubtask}
                  activeOpacity={0.8}
                >
                  <Ionicons name="add" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              {errors.subtask && (
                <Text style={styles.errorText}>{errors.subtask}</Text>
              )}
            </>
          )}

          {/* Data */}
          <Text style={styles.label}>Data</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateChipsContainer}
            keyboardShouldPersistTaps="handled"
          >
            {dateOptions.map((option) => {
              const isSelected = option.iso === selectedDate;
              return (
                <TouchableOpacity
                  key={option.iso}
                  style={[
                    styles.dateChip,
                    isSelected && styles.dateChipSelected,
                  ]}
                  onPress={() => setSelectedDate(option.iso)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dateChipWeekday,
                      isSelected && styles.dateChipTextSelected,
                    ]}
                  >
                    {option.weekday}
                  </Text>
                  <Text
                    style={[
                      styles.dateChipDay,
                      isSelected && styles.dateChipTextSelected,
                    ]}
                  >
                    {option.day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <Text style={styles.dateLabelText}>
            {formatDateLabel(selectedDate)}
          </Text>

          {/* Horário */}
          <Text style={styles.label}>Horário (opcional)</Text>
          <TextInput
            style={[styles.input, errors.time && styles.inputError]}
            placeholder="Ex: 19:30"
            placeholderTextColor="#94A3B8"
            value={time}
            onChangeText={handleTimeChange}
            keyboardType="number-pad"
            maxLength={5}
          />
          {errors.time && <Text style={styles.errorText}>{errors.time}</Text>}

          {/* Botão Adicionar / Salvar */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleCreateTask}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>
              {isEditing ? "Salvar alterações" : "Adicionar tarefa"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0F172A",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 8,
    marginTop: 18,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#0F172A",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 13,
    marginTop: 6,
  },
  textArea: {
    height: 100,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    backgroundColor: "#F1F5F9",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  categoryChipSelected: {
    backgroundColor: "#5B6BFE",
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
  },
  categoryChipTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  priorityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  priorityCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 14,
  },
  priorityCardSelectedBaixa: {
    borderColor: "#60A5FA",
  },
  priorityCardSelectedMedia: {
    borderColor: "#FBBF24",
  },
  priorityCardSelectedAlta: {
    borderColor: "#F87171",
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
  subtaskItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  subtaskContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  subtaskText: {
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "500",
  },
  addSubtaskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  subtaskInput: {
    flex: 1,
  },
  addSubtaskButton: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#5B6BFE",
    alignItems: "center",
    justifyContent: "center",
  },
  dateChipsContainer: {
    gap: 8,
    paddingRight: 20,
  },
  dateChip: {
    width: 52,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  dateChipSelected: {
    backgroundColor: "#5B6BFE",
    borderColor: "#5B6BFE",
  },
  dateChipWeekday: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  dateChipDay: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 2,
  },
  dateChipTextSelected: {
    color: "#FFFFFF",
  },
  dateLabelText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: "#5B6BFE",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
    elevation: 4,
    shadowColor: "#6D7EF7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});