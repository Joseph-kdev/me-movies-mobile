import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useAuth } from "../AuthContext";
import { Image } from "expo-image";
import {
  Settings,
  LogOut,
  ChevronRight,
  User,
  HelpCircle,
  Bell,
  Shield,
} from "lucide-react-native";
import auth from "@react-native-firebase/auth";
import { getUserStats, UserStats } from "../services/requests";
import { useQuery } from "@tanstack/react-query";

const Profile = () => {
  const { user } = useAuth();

  const {data: stats, isLoading: statsLoading} = useQuery({
    queryKey: ["userStats", user?.uid],
    queryFn: () => getUserStats(user?.uid || ""),
    enabled: !!user?.uid,
    initialData: {
      watched: 0,
      favorites: 0,
      watchlist: 0,
    },
  });

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await auth().signOut();
            // Navigation handled by onAuthStateChanged in _layout.tsx
          } catch (error) {
            console.error("Error signing out:", error);
            Alert.alert("Error", "Failed to sign out. Please try again.");
          }
        },
      },
    ]);
  };

  const MenuOption = ({
    icon: Icon,
    label,
    onPress,
  }: {
    icon: any;
    label: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      className="flex-row items-center justify-between py-4 border-b border-gray-100"
      onPress={onPress}
    >
      <View className="flex-row items-center">
        <View className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center mr-4">
          <Icon size={20} color="#484F45" />
        </View>
        <Text className="text-gray-700 text-base font-medium">{label}</Text>
      </View>
      <ChevronRight size={20} color="#ccc" />
    </TouchableOpacity>
  );

  const StatItem = ({
    label,
    value,
    loading,
  }: {
    label: string;
    value: number;
    loading?: boolean;
  }) => (
    <View className="items-center flex-1">
      <Text className="text-primary text-xl font-bold mb-1">
        {loading ? "-" : value}
      </Text>
      <Text className="text-gray-500 text-xs uppercase tracking-wider">
        {label}
      </Text>
    </View>
  );

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="pb-24"
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <View className="items-center pt-12 pb-8 px-6 ">
        <View className="relative mb-4">
          <Image
            source={
              user?.photoURL
                ? { uri: user.photoURL }
                : require("../../assets/images/Me-Movies.png") // Fallback or placeholder
            }
            style={{ width: 100, height: 100, borderRadius: 50 }}
            contentFit="cover"
            transition={500}
            className="border-4 border-gray-50"
          />
          <View className="absolute bottom-0 right-0 bg-primary w-8 h-8 rounded-full items-center justify-center border-2 border-white">
            <User size={14} color="#fff" />
          </View>
        </View>

        <Text className="text-2xl font-bold text-text mb-1 text-center">
          {user?.displayName || "Movie Buff"}
        </Text>
        <Text className="text-gray-500 text-sm mb-6 text-center">
          {user?.email || "No email provided"}
        </Text>

        {/* <TouchableOpacity className="bg-primary px-6 py-2 rounded-full">
          <Text className="text-white font-medium text-sm">Edit Profile</Text>
        </TouchableOpacity> */}
      </View>

      {/* Stats Section */}
      <View className="flex-row justify-between py-6 mx-6 bg-gray-50 rounded-2xl mb-8 px-4">
        <StatItem label="Watched" value={stats.watched} loading={statsLoading} />
        <View className="w-[1px] bg-gray-200 h-full" />
        <StatItem label="Favorites" value={stats.favorites} loading={statsLoading} />
        <View className="w-[1px] bg-gray-200 h-full" />
        <StatItem label="WatchList" value={stats.watchlist} loading={statsLoading} />
      </View>

      {/* Menu Options */}
      <View className="px-6">
        <Text className="text-gray-400 font-bold mb-2 text-xs uppercase tracking-widest">
          Account
        </Text>
        <MenuOption icon={Bell} label="Notifications" />
        <MenuOption icon={Shield} label="Privacy & Security" />

        <Text className="text-gray-400 font-bold mb-2 mt-8 text-xs uppercase tracking-widest">
          Support
        </Text>
        <MenuOption icon={HelpCircle} label="Help & Support" />
        <MenuOption icon={Settings} label="App Settings" />
        
        {/* Sign Out Button */}
        <TouchableOpacity
          className="flex-row items-center justify-between py-4 mt-4"
          onPress={handleSignOut}
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-red-50 items-center justify-center mr-4">
              <LogOut size={20} color="#FF3B30" />
            </View>
            <Text className="text-red-500 text-base font-medium">Sign Out</Text>
          </View>
        </TouchableOpacity>
        
        <Text className="text-center text-gray-300 text-xs mt-8 mb-4">
          Version 1.0.0
        </Text>
      </View>
    </ScrollView>
  );
};

export default Profile;