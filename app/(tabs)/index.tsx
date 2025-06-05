import { ActivityIndicator, Text, View, ScrollView } from "react-native";
import CarouselComponent from "../components/MovieCarousel";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFetch } from "../services/useFetch";
import { fetchMovies } from "../services/requests";
import MovieList from "../components/MovieList";

export default function Index() {

  const { data: movies, loading, error, refetch } = useFetch(() => fetchMovies({ query: ''}))

  return (
      <SafeAreaView className="bg-background flex-1">
        <ScrollView className="flex-1 px-5 py-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ minHeight: "100%", paddingBottom: 10}}>
          <View>
            <Text className="text-text">Editor Picks</Text>
            <CarouselComponent />
          </View>
          <View>
            <Text className="text-text mb-2">
              Trending
            </Text>
            {loading ? (
              <ActivityIndicator
                size="large"
                color="white"
                className="mt-10 self-center"
                />
            ) : error ? (
              <Text>An error occurred</Text>
            ) : (
              <View>
               <MovieList movies={movies}/>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
  );
}
