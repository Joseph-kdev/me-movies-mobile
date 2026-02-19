import { Text, View, ScrollView, Image, Pressable } from "react-native";
import CarouselComponent from "../components/MovieCarousel";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchMovies, getTopRated } from "../services/requests";
import MovieList from "../components/MovieList";
import { Search } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import LoaderKitView from "react-native-loader-kit";

export default function Index() {
  const {
    data: trending,
    isLoading: isLoadingTrending,
    error: errorTrending,
  } = useQuery({
    queryKey: ["trending"],
    queryFn: () => fetchMovies(""),
    staleTime: 3600000,
  });

  // ── Top Rated Movies ──
  const {
    data: topRatedMovies,
    isLoading: isLoadingTopMovies,
    error: errorTopMovies,
  } = useQuery({
    queryKey: ["top-rated", "movie"],
    queryFn: () => getTopRated("movie"),
    staleTime: 3600000, // 1 hour — adjust as needed
  });

  // ── Top Rated TV Shows ──
  const {
    data: topRatedShows,
    isLoading: isLoadingTopShows,
    error: errorTopShows,
  } = useQuery({
    queryKey: ["top-rated", "tv"],
    queryFn: () => getTopRated("tv"),
    staleTime: 3600000,
  });

  const router = useRouter();
  return (
    <SafeAreaView className="bg-background flex-1">
      <ScrollView
        className="flex-1 px-2"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 60 }}
      >
        <View className="absolute top-2 right-1 left-1 z-20 flex flex-row justify-between items-center">
          <Image
            source={require("../../assets/images/Me-Movies.png")}
            resizeMode="cover"
            className="w-[40px] h-[40px] rounded-md"
          />
          <Pressable className="" onPress={() => router.push("/(tabs)/search")}>
            <Search size={20} color={"#a3dcbc"} className="" />
          </Pressable>
        </View>
        <CarouselComponent />
        <View className="mt-4">
          <Text className="text-text mb-1">Trending Today</Text>
          {isLoadingTrending ? (
            <View className="flex flex-1 self-center justify-center items-center">
              <LoaderKitView
                name="BallClipRotateMultiple"
                style={{ width: 50, height: 50 }}
                color={"#efe4ef"}
                className="mt-20"
              />
            </View>
          ) : errorTrending ? (
            <Text>An error occurred</Text>
          ) : (
            <View>
              <MovieList movies={trending} horizontal={true} />
            </View>
          )}
        </View>

        <View className="mt-8">
          <Text className="text-text mb-1">Top Rated Movies</Text>
          {isLoadingTopMovies ? (
            <View className="items-center justify-center py-12">
              <LoaderKitView
                name="BallClipRotateMultiple"
                style={{ width: 50, height: 50 }}
                color="#efe4ef"
              />
            </View>
          ) : errorTopMovies ? (
            <Text className="text-red-500">
              Failed to load top rated movies
            </Text>
          ) : (
            <MovieList movies={topRatedMovies ?? []} horizontal={true} />
          )}
        </View>

        <View className="mt-8 mb-12">
          <Text className="text-text mb-1">Top Rated Shows</Text>

          {isLoadingTopShows ? (
            <View className="items-center justify-center py-12">
              <LoaderKitView
                name="BallClipRotateMultiple"
                style={{ width: 50, height: 50 }}
                color="#efe4ef"
              />
            </View>
          ) : errorTopShows ? (
            <Text className="text-red-500">Failed to load top rated shows</Text>
          ) : (
            <MovieList movies={topRatedShows ?? []} horizontal={true} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
