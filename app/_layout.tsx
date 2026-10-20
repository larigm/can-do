import { Stack } from "expo-router";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#5B6BFE" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#5B6BFE" },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: { fontFamily: "Inter_700Bold" },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Hoje", headerShown: false }}
      />
      <Stack.Screen
        name="new-task"
        options={{ title: "Nova Tarefa", headerShown: false }}
      />
      <Stack.Screen
        name="task-details"
        options={{ title: "Detalhes da Tarefa", headerShown: false }}
      />
    </Stack>
  );
}
