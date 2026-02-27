import { Stack, useRouter, useSegments } from "expo-router";
import "./globals.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster } from "sonner-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "react-native";
import { useEffect, useState } from "react";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { AuthProvider } from "./AuthContext";
import OfflineNotice from "./components/OfflineNotice";

export default function RootLayout() {
  const queryClient = new QueryClient();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          Buda: require("../assets/fonts/Buda.ttf"),
          Oxanium: require("../assets/fonts/Oxanium.ttf"),
          Poppins: require("../assets/fonts/Poppins.ttf"),
          RubikDirt: require("../assets/fonts/RubikDirt.ttf"),
          TiltNeon: require("../assets/fonts/TiltNeon.ttf"),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error("Error loading fonts:", error);
      } finally {
        await SplashScreen.hideAsync();
      }
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // Wait for fonts to load before rendering
  }

  return (
    <SafeAreaProvider>
      <StatusBar hidden={true} />
      <OfflineNotice />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <GestureHandlerRootView>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="movies/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="tv/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="auth/Signup" options={{ headerShown: false }} />
            </Stack>
            <Toaster theme="dark" style={{ marginTop: 8}}/>
          </GestureHandlerRootView>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
