import { View, Text, Pressable, ActivityIndicator, Image, ScrollView } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthSplash from "../components/AuthSplash";
import { useAuth } from "../AuthContext";
import { useQuery } from "@tanstack/react-query";
import { userLists } from "../services/requests";
import MovieList from "../components/MovieList";

const Catalogue = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("favorites");

  const {
    data: favorites = [],
    isLoading: isFavoritesLoading,
    isError: isFavoritesError,
    refetch: refetchFavorites,
  } = useQuery({
    queryKey: ["favorites", user?.uid],
    queryFn: () => userLists("favorites", user!.uid),
    enabled: !!user?.uid,
    placeholderData: [],
  });

  const {
    data: watchlist = [],
    isLoading: isWatchlistLoading,
    isError: isWatchlistError,
    refetch: refetchWatchlist,
  } = useQuery({
    queryKey: ["watchlist", user?.uid],
    queryFn: () => userLists("watchlist", user!.uid),
    enabled: !!user?.uid,
    placeholderData: [],
  });

  const {
    data: watched = [],
    isLoading: isWatchedLoading,
    isError: isWatchedError,
    refetch: refetchWatched,
  } = useQuery({
    queryKey: ["watched", user?.uid],
    queryFn: () => userLists("watched", user!.uid),
    enabled: !!user?.uid,
    placeholderData: [],
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
      <View className="h-full flex justify-center items-center">{!user && <AuthSplash />}</View>
      {user && (
        <View className="flex flex-row mx-2 mb-[4px] bg-primary rounded-full">
          <Pressable
            onPress={() => setActiveTab("favorites")}
            className={`w-1/3 py-2 rounded-full ${
              activeTab === "favorites" ? "bg-accent" : ""
            }`}
          >
            <Text
              className={`${
                activeTab === "favorites" ? "text-background" : "text-text"
              } text-center`}
            >
              Favorites
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab("watchlist")}
            className={`w-1/3 py-2 rounded-full ${
              activeTab === "watchlist" ? "bg-accent" : ""
            }`}
          >
            <Text
              className={`${
                activeTab === "watchlist" ? "text-background" : "text-text"
              } text-center`}
            >
              Watchlist
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab("watched")}
            className={`w-1/3 py-2 rounded-full ${
              activeTab === "watched" ? "bg-accent" : ""
            }`}
          >
            <Text
              className={`${
                activeTab === "watched" ? "text-background" : "text-text"
              } text-center`}
            >
              Watched
            </Text>
          </Pressable>
        </View>
      )}
      <ScrollView className="flex-1 bg-background min-h-screen px-2">
        {activeTab === "favorites" && (
          <>
            {isFavoritesLoading && (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator
                  size="large"
                  color="#your-accent-color-here"
                />
              </View>
            )}

            {!isFavoritesLoading && isFavoritesError && (
              <View className="flex-1 justify-center items-center px-8">
                <Text className="text-text text-center text-lg mb-6">
                  Failed to load favorites.
                </Text>
                <Pressable
                  onPress={() => refetchFavorites()}
                  className="bg-accent py-3 px-8 rounded-lg"
                >
                  <Text className="text-white font-medium">Try Again</Text>
                </Pressable>
              </View>
            )}

            {!isFavoritesLoading &&
              !isFavoritesError &&
              favorites.length === 0 && (
                <View className="flex-1 px-8">
                  <View className="flex justify-center items-center mt-4">
                    <Image
                      source={require("../../assets/images/empty.png")}
                      resizeMode="cover"
                      className="w-[300px] h-[300px] rounded-md mt-2"
                    />
                  </View>
                  <Text className="text-text text-center text-2xl font-bold mb-2 mt-2">
                    No favorites yet
                  </Text>
                  <Text className="text-text/70 text-center text-base">
                    Tap the heart icon on a movie to add it to your favorites.
                  </Text>
                </View>
              )}

            {!isFavoritesLoading &&
              !isFavoritesError &&
              favorites.length > 0 && (
                <MovieList movies={favorites} horizontal={false} />
              )}
          </>
        )}

        {activeTab === "watchlist" && (
          <>
            {isWatchlistLoading && (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator
                  size="large"
                  color="#your-accent-color-here"
                />
              </View>
            )}

            {!isWatchlistLoading && isWatchlistError && (
              <View className="flex-1 justify-center items-center px-8">
                <Text className="text-text text-center text-lg mb-6">
                  Failed to load watchlist.
                </Text>
                <Pressable
                  onPress={() => refetchWatchlist()}
                  className="bg-accent py-3 px-8 rounded-lg"
                >
                  <Text className="text-white font-medium">Try Again</Text>
                </Pressable>
              </View>
            )}

            {!isWatchlistLoading &&
              !isWatchlistError &&
              watchlist.length === 0 && (
                <View className="flex-1 px-8">
                  <View className="flex justify-center items-center mt-4">
                    <Image
                      source={require("../../assets/images/empty.png")}
                      resizeMode="cover"
                      className="w-[300px] h-[300px] rounded-md mt-2"
                    />
                  </View>
                  <Text className="text-text text-center text-2xl font-bold my-2">
                    Your watchlist is empty
                  </Text>
                  <Text className="text-text/70 text-center text-base">
                    Add movies you want to watch later.
                  </Text>
                </View>
              )}

            {!isWatchlistLoading &&
              !isWatchlistError &&
              watchlist.length > 0 && (
                <MovieList movies={watchlist} horizontal={false} />
              )}
          </>
        )}

        {activeTab === "watched" && (
          <>
            {isWatchedLoading && (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator
                  size="large"
                  color="#your-accent-color-here"
                />
              </View>
            )}

            {!isWatchedLoading && isWatchedError && (
              <View className="flex-1 justify-center items-center px-8">
                <Text className="text-text text-center text-lg mb-6">
                  Failed to load watched movies.
                </Text>
                <Pressable
                  onPress={() => refetchWatched()}
                  className="bg-accent py-3 px-8 rounded-lg"
                >
                  <Text className="text-white font-medium">Try Again</Text>
                </Pressable>
              </View>
            )}

            {!isWatchedLoading && !isWatchedError && watched.length === 0 && (
              <View className="flex-1 px-8">
                <View className="flex justify-center items-center mt-4">
                  <Image
                    source={require("../../assets/images/empty.png")}
                    resizeMode="cover"
                    className="w-[300px] h-[300px] rounded-md mt-2"
                  />
                </View>
                <Text className="text-text text-center text-2xl font-bold my-2">
                  No watched movies yet
                </Text>
                <Text className="text-text/70 text-center text-base">
                  Mark movies as watched to build your viewing history.
                </Text>
              </View>
            )}

            {!isWatchedLoading && !isWatchedError && watched.length > 0 && (
              <MovieList movies={watched} horizontal={false} />
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Catalogue;
