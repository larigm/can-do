import { Platform, StatusBar, StyleSheet } from "react-native";
import { colors, radius, fontSize, fonts } from "../constants/theme";

const circleBase = {
  width: 22,
  height: 22,
  borderRadius: 11,
  marginRight: 12,
} as const;

const buttonBase = {
  borderRadius: radius.md,
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 12,
} as const;

const buttonText = { fontSize: fontSize.md, fontFamily: fonts.bold } as const;

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleContainer: { alignItems: "center" },
  headerTitle: {
    fontSize: fontSize.xl,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: fontSize.sm,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginTop: 2,
  },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 30 },
  mainCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginBottom: 20,
  },
  taskTitleRow: { flexDirection: "row", alignItems: "center" },
  mainCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  mainCheckboxCompleted: { backgroundColor: colors.primary },
  taskTitleInfo: { flex: 1 },
  taskTitle: {
    fontSize: fontSize.lg,
    fontFamily: fonts.bold,
    color: colors.text,
    marginBottom: 4,
  },
  taskTitleDone: {
    textDecorationLine: "line-through",
    color: colors.textDisabled,
  },
  badgesRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  categoryBadge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  categoryBadgeText: {
    fontSize: fontSize.xs,
    fontFamily: fonts.semiBold,
    color: colors.primary,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.priorityHigh,
  },
  divider: { height: 1, backgroundColor: colors.divider, marginVertical: 18 },
  sectionLabel: {
    fontSize: fontSize.base,
    fontFamily: fonts.bold,
    color: colors.text,
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: fontSize.base,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    lineHeight: 22,
  },
  dateTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeContainer: { alignItems: "flex-end" },
  dateTimeValue: {
    fontSize: fontSize.md,
    fontFamily: fonts.bold,
    color: colors.text,
    marginTop: 2,
  },
  subtasksHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  subtasksProgressText: {
    fontSize: fontSize.sm,
    fontFamily: fonts.semiBold,
    color: colors.primary,
  },
  subtaskRow: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  checkedCircle: {
    ...circleBase,
    backgroundColor: colors.success,
    alignItems: "center",
    justifyContent: "center",
  },
  uncheckedCircle: {
    ...circleBase,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  subtaskTitle: {
    fontSize: fontSize.base,
    fontFamily: fonts.semiBold,
    color: colors.text,
  },
  subtaskTitleCompleted: {
    textDecorationLine: "line-through",
    color: colors.textMuted,
    fontFamily: fonts.medium,
  },
  addSubtaskButton: {
    ...buttonBase,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: 14,
  },
  addSubtaskButtonText: { ...buttonText, color: colors.primary },
  editTaskButton: {
    ...buttonBase,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  editTaskButtonText: { ...buttonText, color: colors.surface },
  deleteTaskButton: {
    ...buttonBase,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.dangerSoft,
    paddingVertical: 14,
    marginBottom: 20,
  },
  deleteTaskButtonText: { ...buttonText, color: colors.danger },
});