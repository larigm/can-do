import { Platform, StatusBar, StyleSheet } from "react-native";
import { colors, radius, fontSize, fonts } from "../constants/theme";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
  },
  title: {
    fontSize: fontSize.xxl,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSize.base,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 16,
    alignItems: "center",
  },
  statValue: {
    fontSize: fontSize.xl,
    fontFamily: fonts.bold,
    color: colors.text,
    marginTop: 6,
  },
  statLabel: {
    fontSize: fontSize.sm,
    fontFamily: fonts.medium,
    color: colors.textMuted,
    marginTop: 2,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontFamily: fonts.bold,
    color: colors.text,
    marginBottom: 14,
  },
  rateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rateValue: {
    fontSize: fontSize.xl,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primarySoft,
    overflow: "hidden",
    marginTop: 10,
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  hintText: {
    fontSize: fontSize.sm,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginTop: 8,
  },
  chartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chartColumn: {
    flex: 1,
    alignItems: "center",
  },
  barArea: {
    height: 110,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  barTrack: {
    width: 18,
    borderRadius: 6,
    backgroundColor: colors.primarySoft,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    backgroundColor: colors.primary,
  },
  chartLabel: {
    fontSize: fontSize.sm,
    fontFamily: fonts.semiBold,
    color: colors.textMuted,
    marginTop: 8,
  },
  categoryRow: {
    marginBottom: 14,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  categoryName: {
    fontSize: fontSize.base,
    fontFamily: fonts.semiBold,
    color: colors.text,
  },
  categoryCount: {
    fontSize: fontSize.base,
    fontFamily: fonts.medium,
    color: colors.textMuted,
  },
  emptyText: {
    fontSize: fontSize.base,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
});