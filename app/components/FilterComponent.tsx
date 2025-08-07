import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchByGenre } from "../services/requests";
import MovieList from "./MovieList";
import { Movie } from "./MovieCard";

export interface ApiResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

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

  const handleGenreSelect = (genre: number) => {
    const updatedGenres = selectedGenre.includes(genre)
      ? selectedGenre.filter((g) => g !== genre)
      : [...selectedGenre, genre];
    setSelectedGenre(updatedGenres);
  };

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<ApiResponse, Error>({
    queryKey: [`results-${type}-${selectedGenre}`],
    queryFn: ({ pageParam }) =>
      fetchByGenre({ type: type, genre: selectedGenre, page: pageParam }),
    getNextPageParam: (lastPage: ApiResponse) => {
      if (lastPage.page < lastPage.total_pages) {
        const nextPage = lastPage.page + 1;
        return nextPage;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    setSelectedGenre([]);
  }, [type]);

  const allMovies: Movie[] = data?.pages?.flatMap((page) => page.results) || [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 40;

    if (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    ) {
      handleLoadMore();
    }
  };
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
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 20 }}
        onScroll={handleScroll}
        scrollEventThrottle={100}
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
            <MovieList movies={allMovies} horizontal={false} />
            {isFetchingNextPage && (
              <ActivityIndicator
                size="small"
                color="white"
                className="mt-4 self-center"
              />
            )}

            {/* End of results indicator */}
            {!hasNextPage && allMovies.length > 0 && (
              <Text className="text-center mt-4 text-gray-500">
                No more results
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
