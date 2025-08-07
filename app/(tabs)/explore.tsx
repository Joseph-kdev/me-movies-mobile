import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FilterComponent from "../components/FilterComponent";

const Explore = () => {
  const [activeTab, setActiveTab] = useState("movie");

  return (
    <SafeAreaView className="bg-background">
      <View>
        <Text
          className="text-text text-center mt-6 mb-2"
          style={{ fontFamily: "RubikDirt", fontSize: 32 }}
        >
          Explore
        </Text>
      </View>
      <View className="flex flex-row mx-2 mb-[4px]">
        <Pressable
          onPress={() => setActiveTab("movie")}
          className={`w-1/2 py-2 ${
            activeTab === "movie" ? "bg-[rgba(0,0,0,0.6)]" : ""
          }`}
        >
          <Text
            className={`${
              activeTab === "movie" ? "text-accent" : "text-text"
            } text-center`}
          >
            Movies
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab("tv")}
          className={`w-1/2 py-2 ${
            activeTab === "tv" ? "bg-[rgba(0,0,0,0.6)]" : ""
          }`}
        >
          <Text
            className={`${
              activeTab === "tv" ? "text-accent" : "text-text"
            } text-center`}
          >
            Tv Shows
          </Text>
        </Pressable>
      </View>
      <View className="min-h-screen">
        {activeTab === "movie" ? (
          <FilterComponent type="movie" />
        ) : (
          <FilterComponent type="tv" />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Explore;
