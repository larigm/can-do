import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderGreetingProps {
  userName: string;
  dateText: string;
  onPressSettings?: () => void;
}

export function HeaderGreeting({ userName, dateText, onPressSettings }: HeaderGreetingProps) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Bom dia, {userName}!</Text>
        <Text style={styles.date}>{dateText}</Text>
      </View>
      <TouchableOpacity 
        style={styles.settingsButton} 
        onPress={onPressSettings}
        accessibilityLabel="Configurações"
      >
        <Ionicons name="settings-outline" size={20} color="#64748B" />
      </TouchableOpacity>
    </View>
  );
}
  
const styles = StyleSheet.create({
  container: {
    color: '#F7F8FC',
    paddingTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontFamily: 'Inter_700Bold',
    fontSize: 26,
    fontWeight: '700',
    color: '#252633',
  },
  date: {
    fontSize: 14,
    color: '#777A8A',
    marginTop: 2,
  },
  settingsButton: {
    width: 34,
    height: 34,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});