import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onPressDetails: (id: string) => void;
}

export function TaskCard({ task, onToggleComplete, onPressDetails }: TaskCardProps) {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onPressDetails(task.id)}
      activeOpacity={0.7}
    >
      <TouchableOpacity 
        style={[styles.checkbox, task.completed && styles.checkboxCompleted]}
        onPress={() => onToggleComplete(task.id)}
      >
        {task.completed && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={[styles.title, task.completed && styles.titleCompleted]}>
          {task.title}
        </Text>
        <View style={styles.badgeRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{task.category}</Text>
          </View>
          {task.subtasks.length > 0 && (
            <Text style={styles.subtasksText}>
              {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} subtarefas
            </Text>
          )}
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxCompleted: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryBadgeText: {
    fontSize: 11,
    color: '#4F46E5',
    fontWeight: '600',
  },
  subtasksText: {
    fontSize: 12,
    color: '#64748B',
  },
});