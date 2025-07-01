import { Stack } from "expo-router";
import "./globals.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "react-native";

export default function RootLayout() {
  const queryClient = new QueryClient();
  return (
    <SafeAreaProvider>
      <StatusBar hidden={true} />
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="movies/[id]"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="tv/[id]"
                options={{ headerShown: false }}
              />
            </Stack>
          </GestureHandlerRootView>
        </QueryClientProvider>
    </SafeAreaProvider>
  );
}
