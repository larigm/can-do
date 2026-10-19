import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export interface DayItem {
  weekday: string;
  dayNumber: number;
  isSelected?: boolean;
}

interface WeekDaySelectorProps {
  days: DayItem[];
  onSelectDay: (dayNumber: number) => void;
}

export function WeekDaySelector({ days, onSelectDay }: WeekDaySelectorProps) {
  return (
    <View style={styles.container}>
      {days.map((item) => (
        <TouchableOpacity
          key={item.dayNumber}
          style={[styles.dayCard, item.isSelected && styles.dayCardSelected]}
          onPress={() => onSelectDay(item.dayNumber)}
          activeOpacity={0.7}
        >
          <Text style={[styles.weekdayText, item.isSelected && styles.weekdaySelectedText]}>
            {item.weekday}
          </Text>
          <Text style={[styles.dayNumberText, item.isSelected && styles.dayNumberSelectedText]}>
            {item.dayNumber}
          </Text>
          {item.isSelected && <View style={styles.selectedDot} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 5, 
    paddingHorizontal: 1,
    marginBottom: 20,
  },
  dayCard: {
    flex: 1, 
    height: 72,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: '#E6E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  dayCardSelected: {
    backgroundColor: '#E9ECFF',
  },
  weekdayText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#777A8A',
    marginBottom: 4,
  },
  weekdaySelectedText: {
    color: '#5365D9',
  },
  dayNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#252633',
  },
  dayNumberSelectedText: {
    color: '#5365D9',
  },
  selectedDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4F46E5',
    marginTop: 4,
  },
});