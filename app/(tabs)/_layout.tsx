import React from "react";
import { Tabs } from "expo-router";
import { Text, View, ImageBackground } from "react-native";
import {
  CompassIcon,
  HomeIcon,
  LibraryBigIcon,
  SearchIcon,
  UserRoundIcon,
} from "lucide-react-native";

export default function _layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#efe4ef",
        tabBarInactiveTintColor: "#efe4ef",
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          marginHorizontal: 6,
          marginBottom: 30,
          backgroundColor: "#160d15",
          borderRadius: 50,
          height: 56,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => {
            return (
              <View className="items-center justify-center">
                {focused ? (
                  <View className="bg-blue-600 rounded-full w-12 h-12 items-center justify-center -mt-4 border-4 border-background">
                    <HomeIcon size={24} color="white" />
                    <View className="absolute -bottom-6 text-center">
                      <Text className="text-blue-400 text-xs font-medium">
                        Home
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View className="items-center mt-2">
                    <HomeIcon size={24} color={color} />
                  </View>
                )}
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ focused, color }) => {
            return (
              <View className="items-center justify-center">
                {focused ? (
                  <View className="bg-blue-600 rounded-full w-12 h-12 items-center justify-center -mt-4 border-4 border-background">
                    <SearchIcon size={24} color="white" />
                    <View className="absolute -bottom-6 text-center">
                      <Text className="text-blue-400 text-xs font-medium">
                        Search
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View className="items-center mt-2">
                    <SearchIcon size={24} color={color} />
                  </View>
                )}
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          headerShown: false,
          tabBarIcon: ({ focused, color }) => {
            return (
              <View className="items-center justify-center">
                {focused ? (
                  <View className="bg-blue-600 rounded-full w-12 h-12 items-center justify-center -mt-4 border-4 border-background">
                    <CompassIcon size={24} color="white" />
                    <View className="absolute -bottom-6 text-center">
                      <Text className="text-blue-400 text-xs font-medium">
                        Explore
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View className="items-center mt-2">
                    <CompassIcon size={24} color={color} />
                  </View>
                )}
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="catalogue"
        options={{
          title: "Catalogue",
          headerShown: false,
          tabBarIcon: ({ focused, color }) => {
            return (
              <View className="items-center justify-center">
                {focused ? (
                  <View className="bg-blue-600 rounded-full w-12 h-12 items-center justify-center -mt-4 border-4 border-background">
                    <LibraryBigIcon size={24} color="white" />
                    <View className="absolute -bottom-6 text-center">
                      <Text className="text-blue-400 text-xs font-medium">
                        Library
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View className="items-center mt-2">
                    <LibraryBigIcon size={24} color={color} />
                  </View>
                )}
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused, color }) => {
            return (
              <View className="items-center justify-center">
                {focused ? (
                  <View className="bg-blue-600 rounded-full w-12 h-12 items-center justify-center -mt-4 border-4 border-background">
                    <UserRoundIcon size={24} color="white" />
                    <View className="absolute -bottom-6 text-center">
                      <Text className="text-blue-400 text-xs font-medium">
                        Profile
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View className="items-center mt-2">
                    <UserRoundIcon size={24} color={color} />
                  </View>
                )}
              </View>
            );
          },
        }}
      />
    </Tabs>
  );
}
