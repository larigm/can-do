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
    marginBottom: 20,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 24,
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  userName: {
    fontSize: fontSize.xl,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  userSubtitle: {
    fontSize: fontSize.base,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginTop: 4,
  },
  statsCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 16,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.border,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontFamily: fonts.bold,
  },
  statLabel: {
    fontSize: fontSize.sm,
    fontFamily: fonts.medium,
    color: colors.textMuted,
    marginTop: 2,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 18,
    marginBottom: 16,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  menuText: {
    flex: 1,
    fontSize: fontSize.md,
    fontFamily: fonts.semiBold,
    marginLeft: 12,
  },
  footerText: {
    fontSize: fontSize.sm,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 8,
  },
});