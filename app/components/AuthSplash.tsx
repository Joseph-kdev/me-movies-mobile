import { View, Text, Image, Button, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

export default function AuthSplash() {
  const router = useRouter();

  return (
    <View className="min-h-screen">
      <View className="flex justify-center items-center">
        <Image
          source={require("../../assets/images/cinema.png")}
          resizeMode="cover"
          className="w-[300px] h-[300px] rounded-md mt-6"
        />
      </View>
      <Text
        className="text-text my-6 text-center"
        style={{ fontFamily: "Poppins" }}
      >
        Ooops! We could not detect an account. Would you like to:
      </Text>
      <View className="flex flex-row justify-center gap-10">
        <Pressable
          className="bg-secondary"
          onPress={() => router.push("/auth/Login")}
          accessibilityLabel="login"
        >
          <Text className="text-text">Login</Text>
        </Pressable>
        <Pressable
          className="bg-accent"
          onPress={() => router.push("/auth/Signup")}
          accessibilityLabel="sign up"
        >
          <Text className="text-text">Sign Up</Text>
        </Pressable>
      </View>
    </View>
  );
}
