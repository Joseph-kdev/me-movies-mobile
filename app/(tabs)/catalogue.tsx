import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthSplash from "../components/AuthSplash";
import { useAuth } from "../AuthContext";
import { useQuery } from "@tanstack/react-query";
import { userLists } from "../services/requests";

const Catalogue = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("favorites");

  const {
    data: favorites,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => userLists("favorites", user?.uid),
  });
  const { data: watched } = useQuery({
    queryKey: ["watched"],
    queryFn: () => userLists("watched", user?.uid),
  });
  const { data: watchlist } = useQuery({
    queryKey: ["watchlist"],
    queryFn: () => userLists("watchlist", user?.uid),
  });

  console.log("returned favorites", favorites);

  return (
    <SafeAreaView className="bg-background">
      <View>
        <Text
          className="text-text text-center mt-6 mb-2"
          style={{ fontFamily: "RubikDirt", fontSize: 32 }}
        >
          Library
        </Text>
      </View>
      <View>{!user && <AuthSplash />}</View>
      {user && (
        <View className="flex flex-row mx-2 mb-[4px]">
          <Pressable
            onPress={() => setActiveTab("favorites")}
            className={`w-1/3 py-2 ${
              activeTab === "favorites" ? "bg-[rgba(0,0,0,0.6)]" : ""
            }`}
          >
            <Text
              className={`${
                activeTab === "favorites" ? "text-accent" : "text-text"
              } text-center`}
            >
              Favorites
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab("watchlist")}
            className={`w-1/3 py-2 ${
              activeTab === "watchlist" ? "bg-[rgba(0,0,0,0.6)]" : ""
            }`}
          >
            <Text
              className={`${
                activeTab === "watchlist" ? "text-accent" : "text-text"
              } text-center`}
            >
              Watchlist
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab("watched")}
            className={`w-1/3 py-2 ${
              activeTab === "watched" ? "bg-[rgba(0,0,0,0.6)]" : ""
            }`}
          >
            <Text
              className={`${
                activeTab === "watched" ? "text-accent" : "text-text"
              } text-center`}
            >
              Watched
            </Text>
          </Pressable>
        </View>
      )}
      <View></View>
    </SafeAreaView>
  );
};

export default Catalogue;
