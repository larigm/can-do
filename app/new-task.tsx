import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import { createTask } from "../database/tasks";
import { useTask } from "../hooks/useTask";
import { useCategories } from "../hooks/useCategories";
import { TaskCategory } from "../types/task";
import {
  formatDateLabel,
  getDateOption,
  getNextDays,
  getTodayISO,
} from "../utils/date";
import { colors } from "../constants/theme";
import { styles } from "../styles/newTask.styles";

interface FormErrors {
  title?: string;
  description?: string;
  category?: string;
  subtask?: string;
  time?: string;
}

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

const DEFAULT_CATEGORIES = [
  "Estudos",
  "Leitura",
  "Saúde",
  "Treino",
  "Trabalho",
  "Pessoal",
];

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

  // Categorias: as padrão, as já usadas em tarefas salvas e as criadas agora
  const savedCategories = useCategories();
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState("");

  // Mensagens de erro de validação
  const [errors, setErrors] = useState<FormErrors>({});

  const allCategories = Array.from(
    new Set([...DEFAULT_CATEGORIES, ...savedCategories, ...customCategories]),
  );

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

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setShowNewCategory(false);
    clearError("category");
  };

  // Cria uma categoria nova, com validação, e já a seleciona
  const handleAddCategory = () => {
    const typed = newCategoryInput.trim();
    const name = typed.charAt(0).toUpperCase() + typed.slice(1);

    if (name.length < 2) {
      setErrors((prev) => ({
        ...prev,
        category: "O nome da categoria precisa ter pelo menos 2 caracteres.",
      }));
      return;
    }
    if (name.length > 20) {
      setErrors((prev) => ({
        ...prev,
        category: "O nome da categoria pode ter no máximo 20 caracteres.",
      }));
      return;
    }
    if (allCategories.some((c) => c.toLowerCase() === name.toLowerCase())) {
      setErrors((prev) => ({ ...prev, category: "Essa categoria já existe." }));
      return;
    }

    setCustomCategories([...customCategories, name]);
    setSelectedCategory(name);
    setNewCategoryInput("");
    setShowNewCategory(false);
    clearError("category");
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
            <Ionicons name="arrow-back" size={22} color={colors.text} />
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
            placeholderTextColor={colors.textDisabled}
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
            placeholderTextColor={colors.textDisabled}
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
            {allCategories.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    isSelected && styles.categoryChipSelected,
                  ]}
                  onPress={() => handleSelectCategory(category)}
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

            {/* Abre o campo para criar uma categoria nova */}
            <TouchableOpacity
              style={[
                styles.categoryChip,
                showNewCategory && styles.categoryChipSelected,
              ]}
              onPress={() => {
                setShowNewCategory(!showNewCategory);
                clearError("category");
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  showNewCategory && styles.categoryChipTextSelected,
                ]}
              >
                + Nova
              </Text>
            </TouchableOpacity>
          </View>

          {showNewCategory && (
            <View style={[styles.addSubtaskRow, { marginTop: 10 }]}>
              <TextInput
                style={[
                  styles.input,
                  styles.subtaskInput,
                  errors.category && styles.inputError,
                ]}
                placeholder="Nome da nova categoria"
                placeholderTextColor={colors.textDisabled}
                value={newCategoryInput}
                onChangeText={(text) => {
                  setNewCategoryInput(text);
                  clearError("category");
                }}
                onSubmitEditing={handleAddCategory}
                maxLength={20}
                autoFocus
              />
              <TouchableOpacity
                style={styles.addSubtaskButton}
                onPress={handleAddCategory}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark" size={24} color={colors.surface} />
              </TouchableOpacity>
            </View>
          )}
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
                style={[
                  styles.priorityDot,
                  { backgroundColor: colors.priorityLow },
                ]}
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
                style={[
                  styles.priorityDot,
                  { backgroundColor: colors.priorityMedium },
                ]}
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
                style={[
                  styles.priorityDot,
                  { backgroundColor: colors.priorityHigh },
                ]}
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
                      color={colors.primary}
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
                      color={colors.textDisabled}
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
                  placeholderTextColor={colors.textDisabled}
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
                  <Ionicons name="add" size={24} color={colors.surface} />
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
            placeholderTextColor={colors.textDisabled}
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