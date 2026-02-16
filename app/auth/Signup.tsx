import {
  ChevronLeft,
  EyeOff,
  Lock,
  Mail,
  Paperclip,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
  Pressable,
  Image
} from "react-native";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "@react-native-firebase/auth";
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";

export default function Signup() {
  const [screen, setScreen] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const router = useRouter();

  const isSignIn = screen === "signin";

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "519582788658-v78uj0f8pdg6rd7ft8asjsvb6phga2e8.apps.googleusercontent.com",
    });
  }, []);

  const signIn = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Signed in successfully!");
      router.push("/(tabs)/catalogue")
    } catch (error) {
      console.error("Sign in error:", error);
      alert(`Sign in failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created successfully!");
      router.push("/(tabs)/catalogue")
    } catch (error) {
      console.error("Sign up error:", error);
      alert(`Registration failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  async function onGoogleButtonPress() {
    setLoading(true);
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // Get the users ID token
      const signInResult = await GoogleSignin.signIn();

      if (isSuccessResponse(signInResult)) {
        console.log("Google sign in success");

        // Create a Firebase credential with the token
        const googleCredential = GoogleAuthProvider.credential(
          signInResult.data.idToken,
        );

        // Sign in with Firebase
        await signInWithCredential(auth, googleCredential);
        console.log("Firebase authentication successful!");
        router.push("/(tabs)/catalogue")
      } else {
        alert("Google sign in cancelled");
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            alert("Sign in already in progress");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            alert("Google Play Services not available");
            break;
          default:
            console.error("Google Sign-In Error:", error);
            alert("Google sign in failed");
        }
      } else {
        console.error("Error:", error);
        alert("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerClassName="flex-grow justify-center px-5">
        <Pressable
          className="absolute top-4 left-4 z-50 bg-secondary/40 rounded-full flex justify-center p-1"
          onPress={() => router.back()}
        >
          <ChevronLeft className="" stroke={"white"} />
        </Pressable>
        <View className="bg-primary/80 rounded-3xl p-8 items-center shadow-lg">
          <View className="mb-8">
            <View className="w-20 h-20 justify-center items-center">
                <Image
                  source={require("../../assets/images/Me-Movies.png")}
                  resizeMode="cover"
                  className="w-[80px] h-[80px] rounded-md mt-6"
                />
            </View>
          </View>

          {/* Title & Subtitle */}
          <Text className="text-2xl font-semibold text-text mb-3">
            {isSignIn ? "Sign In" : "Sign Up"}
          </Text>

          {/* Form Inputs */}
          <View className="w-full space-y-4">
            <View className="flex-row items-center bg-gray-100 rounded-2xl px-3 py-1 mb-2">
              <Mail size={20} color="#aaa" />
              <TextInput
                className="flex-1 ml-3 text-base text-gray-700"
                placeholder="Email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            {/* Password */}
            <View className="flex-row items-center bg-gray-100 rounded-2xl px-3 py-1 mb-1">
              <Lock size={20} color="#aaa" />
              <TextInput
                className="flex-1 ml-3 text-base text-gray-700"
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                editable={!loading}
              />
              <TouchableOpacity>
                <EyeOff size={20} color="#aaa" />
              </TouchableOpacity>
            </View>

            {/* Forgot Password */}
            {isSignIn && (
              <TouchableOpacity className="self-end mb-4">
                <Text className="text-text text-sm">Forgot Password?</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Primary Button */}
          <TouchableOpacity
            className="w-full bg-accent py-3 rounded-full items-center mt-2 mb-5"
            onPress={isSignIn ? signIn : signUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-primary text-lg font-semibold">
                {isSignIn ? "Sign In" : "Sign Up"}
              </Text>
            )}
          </TouchableOpacity>

          <Text className="text-gray-400 text-sm mb-4">Or</Text>

          {/* Google Button */}
          <TouchableOpacity
            className="flex-row w-full bg-gray-400 py-3.5 rounded-full items-center justify-center mb-3"
            onPress={onGoogleButtonPress}
            disabled={loading}
          >
            <Text className="ml-3 text-text text-base">
              Sign in with Google
            </Text>
          </TouchableOpacity>

          {/* Bottom Link */}
          <View className="flex-row">
            <Text className="text-text text-sm">
              {isSignIn ? "Don't have account? " : "Already have an account? "}
            </Text>
            <TouchableOpacity
              onPress={() => setScreen(isSignIn ? "signup" : "signin")}
              disabled={loading}
            >
              <Text className="text-accent text-sm font-semibold">
                {isSignIn ? "Sign Up" : "Sign In"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
