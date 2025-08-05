import {
  ActivityIndicator,
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import CarouselComponent from "../components/MovieCarousel";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFetch } from "../services/useFetch";
import { fetchMovies } from "../services/requests";
import MovieList from "../components/MovieList";
import { Search } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const {
    data: movies,
    loading,
    error,
  } = useFetch(() => fetchMovies({ query: "" }));
  const router = useRouter();
  return (
    <SafeAreaView className="bg-background flex-1">
      <ScrollView
        className="flex-1 px-2 py-2"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <View className="flex-1 justify-center items-center">
          <Image
            source={require("../../assets/images/Me-Movies.png")}
            resizeMode="cover"
            className="w-[100px] h-[100px] rounded-md mt-6"
          />
        </View>
        <CarouselComponent />
        <Pressable
          className=" mt-1 mb-8 p-3 bg-transparent border-2 border-accent rounded-lg relative"
          onPress={() => router.push("/(tabs)/search")}
        >
          <View className="absolute right-4 top-3">
            <Search size={20} color={"#a3dcbc"} className="" />
          </View>
          <Text className="text-center text-text">Search...</Text>
        </Pressable>
        <View>
          <Text className="text-text mb-2">Trending</Text>
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
              <MovieList movies={movies} horizontal={true} />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
