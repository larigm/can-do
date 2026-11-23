import React from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Linking,
  Share,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";

import { useTasks } from "../hooks/useTasks";
import { BottomTabBar } from "../components/BottomTabBar";
import { colors } from "../constants/theme";
import { styles } from "../styles/profile.styles";

const USER_NAME = "Larissa Gomes";
const REPO_URL = "https://github.com/larigm/can-do";
const SUPPORT_URL = `${REPO_URL}/issues`;

interface MenuRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  tone?: "default" | "danger";
  isLast?: boolean;
}

// Linha de menu reaproveitada em todas as opções da tela
function MenuRow({
  icon,
  label,
  onPress,
  tone = "default",
  isLast = false,
}: MenuRowProps) {
  const isDanger = tone === "danger";
  return (
    <TouchableOpacity
      style={[styles.menuRow, !isLast && styles.menuRowBorder]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons
        name={icon}
        size={20}
        color={isDanger ? colors.danger : colors.primary}
      />
      <Text
        style={[
          styles.menuText,
          { color: isDanger ? colors.danger : colors.text },
        ]}
      >
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textDisabled} />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { tasks, clearCompleted } = useTasks();

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const version = Constants.expoConfig?.version ?? "1.0.0";

  const openLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        "Não foi possível abrir o link",
        "Tente novamente mais tarde.",
      );
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Conheça o CanDo, um app de organização de tarefas diárias: ${REPO_URL}`,
      });
    } catch {
      // O usuário fechou o compartilhamento ou ele não está disponível
    }
  };

  const handleClearCompleted = () => {
    if (completed === 0) {
      Alert.alert(
        "Nada para excluir",
        "Você ainda não tem tarefas concluídas.",
      );
      return;
    }

    Alert.alert(
      "Excluir tarefas concluídas",
      `Isso vai apagar ${completed} tarefa(s) concluída(s). Deseja continuar?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: clearCompleted },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.title}>Perfil</Text>

          {/* Usuário */}
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Ionicons name="person-outline" size={36} color={colors.primary} />
            </View>
            <Text style={styles.userName}>{USER_NAME}</Text>
            <Text style={styles.userSubtitle}>
              Organizando o dia com o CanDo
            </Text>
          </View>

          {/* Resumo */}
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {completed}
              </Text>
              <Text style={styles.statLabel}>Concluídas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {pending}
              </Text>
              <Text style={styles.statLabel}>Pendentes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.success }]}>
                {rate}%
              </Text>
              <Text style={styles.statLabel}>Taxa</Text>
            </View>
          </View>

          {/* Geral */}
          <View style={styles.menuCard}>
            <MenuRow
              icon="help-circle-outline"
              label="Ajuda e suporte"
              onPress={() => openLink(SUPPORT_URL)}
            />
            <MenuRow
              icon="trash-outline"
              label="Excluir tarefas concluídas"
              tone="danger"
              onPress={handleClearCompleted}
              isLast
            />
          </View>

          {/* Avaliar e compartilhar */}
          <View style={styles.menuCard}>
            <MenuRow
              icon="star-outline"
              label="Avaliar o app"
              onPress={() => openLink(REPO_URL)}
            />
            <MenuRow
              icon="share-social-outline"
              label="Compartilhar"
              onPress={handleShare}
              isLast
            />
          </View>

          <Text style={styles.footerText}>CanDo v{version}</Text>
        </ScrollView>

        <BottomTabBar currentTab="perfil" />
      </View>
    </SafeAreaView>
  );
}