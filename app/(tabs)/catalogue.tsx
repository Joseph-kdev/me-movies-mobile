import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthSplash from "../components/AuthSplash";

const Catalogue = () => {
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
      <View>
        <AuthSplash />
      </View>
    </SafeAreaView>
  );
};

export default Catalogue;
