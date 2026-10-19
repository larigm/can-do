import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DailyProgressCardProps {
  completedCount: number;
  totalCount: number;
}

export function DailyProgressCard({ completedCount, totalCount }: DailyProgressCardProps) {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const encouragementText =
    totalCount === 0
      ? 'Vamos planejar o seu dia?'
      : percentage === 100
      ? 'Parabéns! Todas as tarefas concluídas!'
      : 'Continue assim, você está quase lá!';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.taskCountText}>
          {completedCount} de {totalCount} tarefas concluídas
        </Text>
        <Text style={styles.percentageText}>{percentage}%</Text>
      </View>

      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
      </View>

      <Text style={styles.encouragementText}>{encouragementText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6E8F0',
    padding: 18,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  taskCountText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    fontWeight: '600',
    color: '#252633',
  },
  percentageText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    fontWeight: '700',
    color: '#5365D9',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E9ECFF',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 4,
  },
  encouragementText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#777A8A',
  },
});