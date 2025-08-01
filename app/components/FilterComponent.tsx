import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  ScrollView
} from "react-native";
import React, { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchByGenre } from "../services/requests";
import MovieList from "./MovieList";

const movieGenres = [
  {
    id: 28,
    name: "Action",
  },
  {
    id: 12,
    name: "Adventure",
  },
  {
    id: 16,
    name: "Animation",
  },
  {
    id: 35,
    name: "Comedy",
  },
  {
    id: 80,
    name: "Crime",
  },
  {
    id: 99,
    name: "Documentary",
  },
  {
    id: 18,
    name: "Drama",
  },
  {
    id: 10751,
    name: "Family",
  },
  {
    id: 14,
    name: "Fantasy",
  },
  {
    id: 36,
    name: "History",
  },
  {
    id: 27,
    name: "Horror",
  },
  {
    id: 10402,
    name: "Music",
  },
  {
    id: 9648,
    name: "Mystery",
  },
  {
    id: 10749,
    name: "Romance",
  },
  {
    id: 878,
    name: "Science Fiction",
  },
  {
    id: 10770,
    name: "TV Movie",
  },
  {
    id: 53,
    name: "Thriller",
  },
  {
    id: 10752,
    name: "War",
  },
  {
    id: 37,
    name: "Western",
  },
];

const tvGenres = [
  {
    id: 10759,
    name: "Action & Adventure",
  },
  {
    id: 16,
    name: "Animation",
  },
  {
    id: 35,
    name: "Comedy",
  },
  {
    id: 80,
    name: "Crime",
  },
  {
    id: 99,
    name: "Documentary",
  },
  {
    id: 18,
    name: "Drama",
  },
  {
    id: 10751,
    name: "Family",
  },
  {
    id: 10762,
    name: "Kids",
  },
  {
    id: 9648,
    name: "Mystery",
  },
  {
    id: 10763,
    name: "News",
  },
  {
    id: 10764,
    name: "Reality",
  },
  {
    id: 10765,
    name: "Sci-Fi & Fantasy",
  },
  {
    id: 10766,
    name: "Soap",
  },
  {
    id: 10767,
    name: "Talk",
  },
  {
    id: 10768,
    name: "War & Politics",
  },
  {
    id: 37,
    name: "Western",
  },
];

export default function FilterComponent({ type }: { type: string }) {
  const [selectedGenre, setSelectedGenre] = useState<number[]>([]);
  const [page, setPage] = useState(1);

  const handleGenreSelect = (genre: number) => {
    const updatedGenres = selectedGenre.includes(genre)
      ? selectedGenre.filter((g) => g !== genre)
      : [...selectedGenre, genre];
    setSelectedGenre(updatedGenres);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: [`results-${type}-${selectedGenre}`],
    queryFn: () =>
      fetchByGenre({ type: type, genre: selectedGenre, page: page }),
    initialData: []
  });

  return (
    <View className="flex-1">
      <FlatList
        data={type === "movie" ? movieGenres : tvGenres}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className="w-2" />}
        renderItem={({ item }) => (
          <Pressable
            key={item.id}
            className={`p-1 rounded-md max-h-8 ${
              selectedGenre.includes(item.id) ? "bg-accent" : "bg-secondary"
            }`}
            onPress={() => handleGenreSelect(item.id)}
          >
            <Text
              className={`${
                selectedGenre.includes(item.id)
                  ? "text-background"
                  : "text-text"
              }`}
            >
              {item.name}
            </Text>
          </Pressable>
        )}
        className="m-2 max-h-8"
      />
      <ScrollView
        className="flex-1 px-2"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="white"
            className="mt-10 self-center"
          />
        ) : isError ? (
          <Text>An error occurred</Text>
        ) : (
          <View>
            <MovieList movies={data} horizontal={false} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
