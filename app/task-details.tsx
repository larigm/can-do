//detalhes das tarefas
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBar } from '../components/BottomTabBar';

interface SubtaskItem {
  id: string;
  title: string;
  completed: boolean;
}

export default function TaskDetailsScreen() {
  const router = useRouter();

  // Estado da tarefa principal
  const [isTaskCompleted, setIsTaskCompleted] = useState(false);

  // Lista de subtarefas interativas
  const [subtasks, setSubtasks] = useState<SubtaskItem[]>([
    { id: '1', title: 'Pesquisar referências', completed: true },
    { id: '2', title: 'Criar modelo do banco', completed: true },
    { id: '3', title: 'Fazer documentação', completed: false },
    { id: '4', title: 'Revisar trabalho', completed: false },
  ]);

  // Alterna o status da subtarefa ao clicar
  const handleToggleSubtask = (id: string) => {
    setSubtasks((prev) =>
      prev.map((sub) =>
        sub.id === id ? { ...sub, completed: !sub.completed } : sub
      )
    );
  };

  const completedSubtasksCount = subtasks.filter((s) => s.completed).length;

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
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Detalhes da tarefa</Text>
            <Text style={styles.headerSubtitle}>Fazer trabalho de Engenharia</Text>
          </View>

          <TouchableOpacity 
            style={styles.circleButton} 
            onPress={() => alert('Opções')}
            activeOpacity={0.7}
          >
            <Ionicons name="settings-outline" size={22} color="#64748B" />
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
                  isTaskCompleted && styles.mainCheckboxCompleted,
                ]}
                onPress={() => setIsTaskCompleted(!isTaskCompleted)}
              >
                {isTaskCompleted && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
              </TouchableOpacity>

              <View style={styles.taskTitleInfo}>
                <Text style={[styles.taskTitle, isTaskCompleted && styles.taskTitleDone]}>
                  Fazer trabalho de Engenharia
                </Text>
                <View style={styles.badgesRow}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>Faculdade</Text>
                  </View>
                  <View style={styles.priorityDot} />
                </View>
              </View>

              <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="ellipsis-vertical" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            {/* Descrição */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Descrição</Text>
              <Text style={styles.descriptionText}>
                Entregar o trabalho final da disciplina de Engenharia de Software com os requisitos
                revisados e o modelo do banco concluído.
              </Text>
            </View>

            <View style={styles.divider} />

            {/* Data e Horário */}
            <View style={styles.dateTimeRow}>
              <View>
                <Text style={styles.sectionLabel}>Data</Text>
                <Text style={styles.dateTimeValue}>24 de setembro</Text>
              </View>
              <View style={styles.timeContainer}>
                <Text style={styles.sectionLabel}>Horário</Text>
                <Text style={styles.dateTimeValue}>19:00</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Subtarefas */}
            <View style={styles.section}>
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
                  onPress={() => handleToggleSubtask(item.id)}
                  activeOpacity={0.7}
                >
                  {item.completed ? (
                    <View style={styles.checkedCircle}>
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    </View>
                  ) : (
                    <View style={styles.uncheckedCircle} />
                  )}
                  <Text style={[styles.subtaskTitle, item.completed && styles.subtaskTitleCompleted]}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Botões de Ação */}
          <TouchableOpacity 
            style={styles.addSubtaskButton}
            onPress={() => {
              const novoTitulo = `Nova subtarefa ${subtasks.length + 1}`;
              setSubtasks([...subtasks, { id: String(Date.now()), title: novoTitulo, completed: false }]);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.addSubtaskButtonText}>+ Adicionar subtarefa</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.editTaskButton} 
            onPress={() => router.push('/new-task')}
            activeOpacity={0.8}
          >
            <Text style={styles.editTaskButtonText}>Editar tarefa</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.deleteTaskButton} 
            onPress={() => router.back()}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 20,
    marginBottom: 20,
  },
  taskTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#5B6BFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  mainCheckboxCompleted: {
    backgroundColor: '#5B6BFE',
  },
  taskTitleInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5B6BFE',
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F87171',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 18,
  },
  section: {
    // Espaçamento interno
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 22,
  },
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  dateTimeValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  subtasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  subtasksProgressText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B6BFE',
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  checkedCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#52BA85', // Verde do Figma
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  uncheckedCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#5B6BFE',
    marginRight: 12,
  },
  subtaskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  subtaskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#64748B',
    fontWeight: '500',
  },
  addSubtaskButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#5B6BFE',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  addSubtaskButtonText: {
    color: '#5B6BFE',
    fontSize: 15,
    fontWeight: '700',
  },
  editTaskButton: {
    backgroundColor: '#5B6BFE',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#5B6BFE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  editTaskButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  deleteTaskButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  deleteTaskButtonText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '700',
  },
});