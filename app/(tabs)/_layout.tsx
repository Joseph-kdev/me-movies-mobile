import React from "react";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";
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
        tabBarActiveTintColor: "#484F45",
        tabBarInactiveTintColor: "#efe4ef7f",
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          marginHorizontal: 6,
          marginBottom: 30,
          backgroundColor: "#484F45",
          borderColor: "#484F45",
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
                  <View className="bg-accent rounded-full w-12 h-12 items-center justify-center -mt-4 border-4 border-primary">
                    <HomeIcon size={24} color={color} />
                    <View className="absolute -bottom-6 text-center">
                      <Text className="text-text text-xs font-medium">
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
                  <View className="bg-accent rounded-full w-12 h-12 items-center justify-center -mt-4 border-4 border-primary">
                    <SearchIcon size={24} color={color} />
                    <View className="absolute -bottom-6 text-center">
                      <Text className="text-text text-xs font-medium">
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
                  <View className="bg-accent rounded-full w-14 h-14 items-center justify-center -mt-4 border-4 border-primary">
                    <CompassIcon size={25} color={color} />
                    <View className="absolute -bottom-6 text-center">
                      <Text className="text-text text-xs font-medium">
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
                  <View className="bg-accent rounded-full w-12 h-12 items-center justify-center -mt-4 border-4 border-primary">
                    <LibraryBigIcon size={24} color={color} />
                    <View className="absolute -bottom-6 text-center">
                      <Text className="text-text text-xs font-medium">
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
                  <View className="bg-accent rounded-full w-12 h-12 items-center justify-center -mt-4 border-4 border-primary">
                    <UserRoundIcon size={24} color={color} />
                    <View className="absolute -bottom-6 text-center">
                      <Text className="text-text text-xs font-medium">
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
