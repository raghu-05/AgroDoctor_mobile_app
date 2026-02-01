import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="index" />
      <Stack.Screen name="upload" />
      <Stack.Screen name="result" />
      <Stack.Screen name="treatment" />
      <Stack.Screen name="impact" />
      <Stack.Screen name="history" />
      <Stack.Screen name="feedback" />
      <Stack.Screen name="outbreak" />
    </Stack>
  );
}
