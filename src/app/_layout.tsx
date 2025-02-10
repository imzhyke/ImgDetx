import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css";

export default function RootLayout() {
  return (
    <>
      <StatusBar backgroundColor="#FFFF" style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
