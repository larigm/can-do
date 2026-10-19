import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface BottomTabBarProps {
  currentTab?: 'hoje' | 'tarefas' | 'progresso' | 'perfil';
}

export function BottomTabBar({ currentTab = 'hoje' }: BottomTabBarProps) {
  const router = useRouter();

  const tabs = [
    { key: 'hoje', label: 'Hoje', icon: 'calendar-outline', activeIcon: 'calendar' },
    { key: 'tarefas', label: 'Tarefas', icon: 'list-outline', activeIcon: 'list' },
    { key: 'progresso', label: 'Progresso', icon: 'stats-chart-outline', activeIcon: 'stats-chart' },
    { key: 'perfil', label: 'Perfil', icon: 'person-outline', activeIcon: 'person' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = currentTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabButton}
            onPress={() => {
              if (tab.key === 'hoje') router.push('/');
              if (tab.key === 'tarefas') router.push('/new-task');
              if (tab.key === 'progresso') router.push('/task-details');
            }}
          >
            <Ionicons
              name={(isActive ? tab.activeIcon : tab.icon) as any}
              size={22}
              color={isActive ? '#5B6BFE' : '#777A8A'}
            />
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 90,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E6E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 6,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 11,
    color: '#777A8A',
    marginTop: 4,
    fontFamily: 'Inter_700Bold'
  },
  tabLabelActive: {
    color: '#5B6BFE',
    fontFamily: 'Inter_700Bold'
  },
});