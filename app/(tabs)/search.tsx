import { Text, ActivityIndicator, ScrollView } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "../components/SearchBar";
import { useQuery } from "@tanstack/react-query";
import { fetchMovies } from "../services/requests";
import MovieList from "../components/MovieList";
import { useDebounce } from 'use-debounce';

const SearchPage = () => {
  const [query, setQuery] = useState("");
   const [debouncedText] = useDebounce(query, 300);

  const {
    data: movies,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [`${debouncedText}`],
    queryFn: () => fetchMovies({ query: debouncedText }),
    initialData: () => fetchMovies({ query: "" }),
  });

  return (
    <SafeAreaView className="flex-1 bg-background">
      <SearchBar query={query} setQuery={setQuery} />
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="white"
          className="mt-10 self-center"
        />
      ) : isError ? (
        <Text className="text-text">An error occurred</Text>
      ) : (
        <ScrollView className="flex-1 px-4 py-2" showsVerticalScrollIndicator={false} contentContainerStyle={{ minHeight: "100%", paddingBottom: 10}}>
          {query.length > 0 ? <Text className="text-text mb-2">Search results for <Text className="font-bold text-accent text-lg">{query}</Text></Text> : <Text></Text>}
          <MovieList movies={movies} horizontal={false} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default SearchPage;
