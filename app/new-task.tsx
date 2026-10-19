import React, { useState } from "react";
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
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function NewTaskScreen() {
  const router = useRouter();

  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Estudos");
  const [selectedPriority, setSelectedPriority] = useState<
    "baixa" | "media" | "alta"
  >("alta");

  // Estados das subtarefas
  const [subtasks, setSubtasks] = useState<string[]>([
    "Revisar anotações da aula", // Exemplo inicial pré-preenchido
  ]);
  const [newSubtaskInput, setNewSubtaskInput] = useState("");

  const categories = [
    "Estudos",
    "Leitura",
    "Saúde",
    "Treino",
    "Trabalho",
    "Pessoal",
    "+ Nova",
  ];


  const handleAddSubtask = () => {
    if (newSubtaskInput.trim()) {
      setSubtasks([...subtasks, newSubtaskInput.trim()]);
      setNewSubtaskInput("");
    }
  };

  // Função para remover subtarefa
  const handleRemoveSubtask = (indexToRemove: number) => {
    setSubtasks(subtasks.filter((_, index) => index !== indexToRemove));
  };

  const handleCreateTask = () => {
    // Retorna para a tela anterior
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
          <Text style={styles.headerTitle}>Nova tarefa</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Nome da tarefa */}
          <Text style={styles.label}>Nome da tarefa</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Estudar para a prova"
            placeholderTextColor="#94A3B8"
            value={taskName}
            onChangeText={setTaskName}
          />

          {/* Descrição */}
          <Text style={styles.label}>Descrição (opcional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Adicione detalhes sobre a tarefa..."
            placeholderTextColor="#94A3B8"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

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
                  onPress={() => setSelectedCategory(category)}
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

          {/* Subtarefas */}
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
              style={[styles.input, styles.subtaskInput]}
              placeholder="Adicionar subtarefa..."
              placeholderTextColor="#94A3B8"
              value={newSubtaskInput}
              onChangeText={setNewSubtaskInput}
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

          {/* Data */}
          <Text style={styles.label}>Data</Text>
          <TouchableOpacity style={styles.dateSelector} activeOpacity={0.8}>
            <View style={styles.dateInfo}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color="#5B6BFE"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.dateText}>Hoje, 18 de set</Text>
            </View>
            <Ionicons name="chevron-down" size={20} color="#64748B" />
          </TouchableOpacity>

          {/* Botão Adicionar Tarefa */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleCreateTask}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>Adicionar tarefa</Text>
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
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dateInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#0F172A",
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
