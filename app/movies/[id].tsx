import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Platform,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { fetchMovieDetails } from "../services/requests";
import { ChevronLeft, Star } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { YoutubeView, useYouTubePlayer } from "react-native-youtube-bridge";

const MovieDetails = () => {
  let { id } = useLocalSearchParams() as any;
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const router = useRouter();

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

  let officialTrailer = null;

  if (movie) {
    officialTrailer = movie
      ? movie.videos.results.find(
          (trailer: { type: string }) => trailer.type === "Trailer"
        )
        ? movie.videos.results.find(
            (trailer: { type: string }) => trailer.type === "Trailer"
          )
        : movie.videos.results[0]
      : null;
  }
  const player = useYouTubePlayer(movie ? officialTrailer.key : "", {
    autoplay: false,
    controls: true,
    playsinline: true,
    rel: false,
    muted: true,
  });

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
        <View className="min-h-screen bg-background">
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ minHeight: "100%", paddingBottom: 80 }}
          >
            <View className="relative">
              <Pressable
                className="absolute top-4 left-2 z-50 bg-primary rounded-full flex justify-center p-1"
                onPress={() => router.back()}
              >
                <ChevronLeft className="" />
              </Pressable>
              <LinearGradient
                colors={["transparent", "#18181b", "#160d15"]}
                className="absolute w-full h-[800px] z-10"
              ></LinearGradient>
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
                }}
                className="w-full h-[550px] absolute"
                resizeMode="cover"
              />
            </View>
            <View className="mt-[400px] px-2 min-h-screen z-20">
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
                  className="text-text text-pretty"
                >
                  {movie.overview}
                </Text>
                {showReadMore && (
                  <TouchableOpacity onPress={toggleExpanded} className="mt-2">
                    <Text className="text-accent font-medium">
                      {isExpanded ? "Read less" : "Read more"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <View>
                <Text className="mt-6 text-lg text-text">Top Cast</Text>
                <FlatList
                  data={movie.credits.cast}
                  keyExtractor={(item) => item.id}
                  horizontal
                  maxToRenderPerBatch={4}
                  ItemSeparatorComponent={() => <View className="w-2" />}
                  renderItem={({ item }) => (
                    <View className="flex flex-col items-center">
                      <Image
                        source={{
                          uri: `https://image.tmdb.org/t/p/w500${item.profile_path}`,
                        }}
                        className="rounded-full"
                        resizeMode="cover"
                        width={80}
                        height={80}
                      />
                      <Text className="text-xs text-text mt-1">
                        {item.name}
                      </Text>
                    </View>
                  )}
                  className="mt-2 pb-2"
                />
              </View>
              <View className="mt-6">
                <Text className="text-text text-lg">Trailer</Text>
                <View className="max-w-full flex justify-center items-center mt-2">
                  {officialTrailer ? (
                    <YoutubeView
                      useInlineHtml={false}
                      player={player}
                      height={Platform.OS === "web" ? "auto" : undefined}
                      webViewProps={{
                        renderToHardwareTextureAndroid: true,
                      }}
                      style={{
                        minWidth: 344,
                      }}
                      iframeStyle={{
                        aspectRatio: 16 / 9,
                      }}
                    />
                  ) : (
                    <ActivityIndicator
                      size="large"
                      color="white"
                      style={{ alignSelf: "center" }}
                    />
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

export default MovieDetails;
