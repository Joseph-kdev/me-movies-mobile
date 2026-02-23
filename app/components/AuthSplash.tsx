import { View, Text, Image, Pressable } from "react-native";
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
        className="text-text mx-6 text-center my-2"
        style={{ fontFamily: "Poppins" }}
      >
        Ooops! We could not detect an account. Would you like to:
      </Text>
      <View className="flex-1 px-8 flex-row gap-2 mt-4">
        <Pressable
          className="bg-accent/60 w-1/2 h-10 rounded-xl flex justify-center items-center"
          onPress={() => router.push("/auth/Signup")}
          accessibilityLabel="login"
        >
          <Text className="text-text">Login</Text>
        </Pressable>
        <Pressable
          className="bg-gray-900 w-1/2 h-10 rounded-xl flex justify-center items-center"
          onPress={() => router.push("/auth/Signup")}
          accessibilityLabel="sign up"
        >
          <Text className="text-text">Sign Up</Text>
        </Pressable>
      </View>
    </View>
  );
}
