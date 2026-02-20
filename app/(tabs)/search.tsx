import { Text, Image, ScrollView, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "../components/SearchBar";
import { useQuery } from "@tanstack/react-query";
import { fetchMovies } from "../services/requests";
import MovieList from "../components/MovieList";
import { useDebounce } from "use-debounce";
import LoaderKitView from "react-native-loader-kit";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [debouncedText] = useDebounce(query, 300);

  const {
    data: movies,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [`${debouncedText}`],
    queryFn: () => fetchMovies(debouncedText),
    initialData: () => fetchMovies(""),
  });

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View>
        <Text
          className="text-text text-center mt-6 mb-2"
          style={{ fontFamily: "RubikDirt", fontSize: 32 }}
        >
          Search
        </Text>
      </View>
      <SearchBar query={query} setQuery={setQuery} />
      {isLoading ? (
        <View className="flex flex-1 self-center justify-center items-center min-h-screen">
          <LoaderKitView
            name="BallClipRotateMultiple"
            style={{ width: 50, height: 50 }}
            color={"#efe4ef"}
            className="mt-20"
          />
        </View>
      ) : isError ? (
        <View className="flex-1">
          <Image
            source={require("../../assets/images/sad.png")}
            resizeMode="contain"
            className="w-full h-[100px] rounded-md mt-2"
          />
          <Text className="text-text text-center mt-1 text-sm">
            Oops...An error occurred
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-4 py-2"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
        >
          {query.length > 0 ? (
            <Text className="text-text mb-2">
              Search results for{" "}
              <Text className="font-bold text-accent text-lg">{query}</Text>
            </Text>
          ) : (
            <Text></Text>
          )}
          <MovieList movies={movies} horizontal={false} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default SearchPage;
