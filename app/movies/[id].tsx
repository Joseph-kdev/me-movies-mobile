import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { fetchMovieDetails } from "../services/requests";
import { Star } from "lucide-react-native";

const MovieDetails = () => {
  let { id } = useLocalSearchParams() as any;
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const onTextLayout = (event: { nativeEvent: { lines: string | any[] } }) => {
    if (event.nativeEvent.lines.length > 4) {
      setShowReadMore(true);
    }
  };

  const {
    data: movie,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [`${id}`],
    queryFn: () => fetchMovieDetails({ id: id, type: "movie" }),
  });
  console.log(movie);
  return (
    <SafeAreaView>
      {isLoading && (
        <View>
          <ActivityIndicator
            size="large"
            color="white"
            style={{ alignSelf: "center" }}
          />
        </View>
      )}
      {isError && (
        <View>
          <Text className="text-primary">Error occurred</Text>
        </View>
      )}
      {movie && (
        <View className="min-h-screen">
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ minHeight: "100%", paddingBottom: 80 }}
          >
            <View className="relative">
              <View className="bg-gradient-to-b from-transparent via-zinc-900 to-background absolute w-full h-[800px] z-10"></View>
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
                }}
                className="w-full h-[550px] absolute"
                resizeMode="cover"
              />
            </View>
            <View className="mt-[400px] px-2 min-h-screen">
              <Text className="text-2xl font-bold mt-2 text-text">
                {movie.title}
              </Text>
              <View>
                <View className="flex flex-row gap-1 mt-2">
                  {movie.genres.map(
                    (genre: {
                      id: React.Key | null | undefined;
                      name:
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactElement<
                            unknown,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | Promise<
                            | string
                            | number
                            | bigint
                            | boolean
                            | React.ReactPortal
                            | React.ReactElement<
                                unknown,
                                string | React.JSXElementConstructor<any>
                              >
                            | Iterable<React.ReactNode>
                            | null
                            | undefined
                          >
                        | null
                        | undefined;
                    }) => (
                      <Text
                        key={genre.id}
                        className="text-text bg-secondary p-1 text-xs rounded-full"
                      >
                        {genre.name}
                      </Text>
                    )
                  )}
                </View>
                <View className="flex-row gap-4 mt-2 justify-between">
                  <Text className="text-text">{movie?.runtime} minutes</Text>
                  <View className="flex-row items-center">
                    <Star height={15} color={"gold"} fill={"gold"} />
                    <Text className="text-text">
                      {Math.round(parseFloat(movie.vote_average) * 10) / 10}
                    </Text>
                  </View>
                </View>
                <Text className="text-text mt-2">
                  {movie?.release_date.split("-")[0]}
                </Text>
              </View>
            <View className="mt-6">
              <Text
                numberOfLines={isExpanded ? undefined : 4}
                onTextLayout={onTextLayout}
                className="text-text"
              >
                {movie.overview}
              </Text>
              {showReadMore && (
                <TouchableOpacity onPress={toggleExpanded} className="mt-2">
                  <Text className="text-blue-600 font-medium">
                    {isExpanded ? "Read less" : "Read more"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            </View>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

export default MovieDetails;
