import { ActivityIndicator, Text, View, ScrollView, Image } from "react-native";
import CarouselComponent from "../components/MovieCarousel";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFetch } from "../services/useFetch";
import { fetchMovies } from "../services/requests";
import MovieList from "../components/MovieList";

export default function Index() {

  const { data: movies, loading, error} = useFetch(() => fetchMovies({ query: ''}))

  return (
      <SafeAreaView className="bg-background flex-1">
        <ScrollView className="flex-1 px-2 py-2" showsVerticalScrollIndicator={false} contentContainerStyle={{ minHeight: "100%", paddingBottom: 10}}>
          {/* <View className="bg-accent">
            <Image source={require("../../assets/images/Me-Movies.png")} resizeMode="cover" className="w-[100px] h-[100px]"/>
          </View> */}
            <Text className="text-text px-1">Editor Picks</Text>
            <CarouselComponent />
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
               <MovieList movies={movies} horizontal={true}/>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
  );
}
