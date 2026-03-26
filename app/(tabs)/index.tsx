import { Text, View, ScrollView, Image, Pressable, StatusBar, TouchableOpacity, FlatList } from "react-native";
import CarouselComponent from "../components/MovieCarousel";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchMovies, getTopRated } from "../services/requests";
import MovieList from "../components/MovieList";
import { Search } from "lucide-react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import LoaderKitView from "react-native-loader-kit";
import { getRecentMovies } from "../components/recent";
import { useCallback, useState } from "react";
import { Movie } from "../components/MovieCard";

export default function Index() {
  const [recentFinds, setRecentFinds] = useState([]);
  const {
    data: trending,
    isLoading: isLoadingTrending,
    error: errorTrending,
  } = useQuery({
    queryKey: ["trending"],
    queryFn: () => fetchMovies(""),
  });

  const {
    data: topRatedMovies,
    isLoading: isLoadingTopMovies,
    error: errorTopMovies,
  } = useQuery({
    queryKey: ["top-rated", "movie"],
    queryFn: () => getTopRated("movie"),
  });

  const {
    data: topRatedShows,
    isLoading: isLoadingTopShows,
    error: errorTopShows,
  } = useQuery({
    queryKey: ["top-rated", "tv"],
    queryFn: () => getTopRated("tv"),
  });

  useFocusEffect(
    useCallback(() => {
      const fresh = getRecentMovies();
      setRecentFinds(fresh);
    }, [])
  );

const renderMovie = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      onPress={() => {
        router.push({ pathname: item.type === 'movie' ? "/movies/[id]" : '/tv/[id]', params: { id: item.id } });
      }}
      className="w-[40vw] mr-3 rounded-xl overflow-hidden shadow-lg shadow-black/40 relative"
    >
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
        className="w-full aspect-[4/3] rounded-t-xl object-top"
        resizeMode="cover"
      />
      <View className="absolute left-2 bottom-2 bg-[rgba(0,0,0,0.6)] p-1 rounded-lg">
        <Text
          className="text-white text-sm font-medium text-center leading-tight"
          numberOfLines={2}
        >
          {item.title || item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const router = useRouter();
  return (
    <View className="bg-background flex-1 relative">
      <StatusBar hidden={true} />
      <View className="absolute top-12 right-2 left-2 z-20 flex flex-row justify-between items-center">
        <Image
          source={require("../../assets/images/Me-Movies.png")}
          resizeMode="cover"
          className="w-[70px] h-[70px] rounded-lg"
        />
        <Pressable className="" onPress={() => router.push("/(tabs)/search")}>
          <Search size={24} color={"#a3dcbc"} className="" />
        </Pressable>
      </View>
      <ScrollView
        className="flex-1 px-2"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 60 }}
      >
        <CarouselComponent />
        {recentFinds.length > 0 && (
          <View className="mt-4">
            <Text className="text-text mb-1">
              Recent Finds
            </Text>
            <View>
              <FlatList
                data={recentFinds}
                horizontal
                ItemSeparatorComponent={() => <View className="w-2" />}
                maxToRenderPerBatch={10}
                renderItem={renderMovie}
                keyExtractor={(item) => item.id}
                className="mt-2"
              />
            </View>
          </View>
        )}

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
            <MovieList movies={topRatedShows ?? []} horizontal={true} />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
