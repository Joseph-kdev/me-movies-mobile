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
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { fetchMovieDetails, getSimilarMovies } from "../services/requests";
import {
  BookmarkMinus,
  BookmarkPlus,
  ChevronLeft,
  CircleCheck,
  HeartIcon,
  Star,
  X,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { YoutubeView, useYouTubePlayer } from "react-native-youtube-bridge";
import { useAuth } from "../AuthContext";
import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "@react-native-firebase/firestore";
import LoaderKitView from "react-native-loader-kit";
import MovieList from "../components/MovieList";

const MovieDetails = () => {
  let { id } = useLocalSearchParams() as any;
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const router = useRouter();
  const [movieInCollections, setMovieInCollections] = useState({
    watched: false,
    watchlist: false,
    favorites: false,
  });
  const { user } = useAuth();

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

  const {
    data: similarMovies,
    isLoading: isLoadingSimilar,
    error: errorSimilar,
  } = useQuery({
    queryKey: ["similar-movies", `${id}-movie`],
    queryFn: () => getSimilarMovies(id, "movie"),
    enabled: !!movie, // only fetch when movie exists
    staleTime: 1000 * 60 * 30, // 30 minutes – similar lists don't change often
    gcTime: 1000 * 60 * 60, // keep in cache 1 hour
  });

  let officialTrailer = null;

  if (movie) {
    officialTrailer = movie
      ? movie.videos.results.find(
          (trailer: { type: string }) => trailer.type === "Trailer",
        )
        ? movie.videos.results.find(
            (trailer: { type: string }) => trailer.type === "Trailer",
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

  useEffect(() => {
    const fetchMovieCollections = async () => {
      if (!user) {
        setMovieInCollections({
          watched: false,
          watchlist: false,
          favorites: false,
        });
        return;
      }

      try {
        const collections = ["watched", "watchlist", "favorites"];
        const db = getFirestore();
        const results = await Promise.all(
          collections.map((listType) =>
            getDocs(
              query(
                collection(db, `users/${user.uid}/${listType}`),
                where("id", "==", id),
                where("type", "==", "movie"),
              ),
            ),
          ),
        );
        const movieInCollections = results.reduce(
          (acc, querySnapshot, index) => {
            acc[collections[index]] = !querySnapshot.empty;
            return acc;
          },
          {
            watched: false,
            watchlist: false,
            favorites: false,
          },
        );
        setMovieInCollections(movieInCollections);
      } catch (error) {
        Alert.alert("Error checking for movie in database");
        console.log(error);
      }
    };

    if (user) {
      fetchMovieCollections();
    }
  }, [user, id]);

  const toggleMovieCollection = async (
    listType: string,
    action: string,
    type: string,
  ) => {
    if (!user) {
      console.log("No user was found");
      return; // stop if not logged in
    }

    try {
      const db = getFirestore();
      const collectionRef = collection(db, `users/${user.uid}/${listType}`);
      const movieQuery = query(
        collectionRef,
        where("id", "==", id),
        where("type", "==", type), // Add type check
      );

      // Build query to check if movie already exists
      const querySnapshot = await getDocs(movieQuery);

      if (querySnapshot.empty) {
        // Movie not found, add it
        if (action === "add") {
          await addDoc(collectionRef, {
            id,
            title: movie.title || movie.name,
            overview: movie.overview,
            poster_path: movie.poster_path,
            vote_average: movie.vote_average,
            release_date: movie.release_date || movie.first_air_date,
            type,
          });

          setMovieInCollections((prevState) => ({
            ...prevState,
            [listType]: true,
          }));
        } else {
          console.log("Cannot remove non-existent movie");
        }
      } else {
        // Movie found, perform action based on 'add' or 'remove'
        const docRef = querySnapshot.docs[0].ref; // Get reference of the found document
        if (action === "add") {
          console.log("Already saved");
        } else if (action === "remove") {
          await deleteDoc(docRef);

          setMovieInCollections((prevState) => ({
            ...prevState,
            [listType]: false,
          }));
        }
      }

      // Invalidate the query to refetch data from Firestore
      // queryClient.invalidateQueries([`userCollections-${id}`]);
    } catch (error) {
      console.log(error);
    }
  };

  const moveToWatched = async (type: string) => {
    try {
      if (!user) {
        console.log("Please login to modify collections.");
        return;
      }

      const db = getFirestore();
      const watchlistRef = collection(db, `users/${user.uid}/watchlist`);
      const watchlistQuery = query(
        watchlistRef,
        where("id", "==", id),
        where("type", "==", type), // Add type check
      );
      const watchlistQuerySnapshot = await getDocs(watchlistQuery);

      if (!watchlistQuerySnapshot.empty) {
        const watchlistDocRef = watchlistQuerySnapshot.docs[0].ref;
        await deleteDoc(watchlistDocRef);
      }

      // Add the movie to the watched collection
      const watchedRef = collection(db, `users/${user.uid}/watched`);
      await addDoc(watchedRef, {
        id,
        title: movie.title || movie.name,
        overview: movie.overview,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date || movie.first_air_date,
        type,
      });

      // Update the movieInCollections state
      setMovieInCollections((prev) => ({
        ...prev,
        watched: true,
        watchlist: false,
      }));

      // Invalidate the query to refetch data from Firestore
      // queryClient.invalidateQueries([`userCollections-${id}`]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView>
      {isLoading && (
        <View className="min-h-screen bg-background flex justify-center items-center">
          <LoaderKitView
            name="BallBeat"
            style={{ width: 50, height: 50 }}
            color={"#efe4ef"}
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
            contentContainerStyle={{ minHeight: "100%", paddingBottom: 60 }}
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
              <View className="flex flex-row justify-between items-center mb-1">
                <Text className="text-2xl font-bold mt-2 text-text">
                  {movie.title}
                </Text>
                <View className="mt-4">
                  {movieInCollections.favorites ? (
                    <Pressable
                      onPress={() =>
                        toggleMovieCollection("favorites", "remove", "movie")
                      }
                    >
                      <HeartIcon
                        className="w-4 h-4"
                        stroke={"red"}
                        fill={"red"}
                      />
                    </Pressable>
                  ) : (
                    <Pressable
                      onPress={() =>
                        toggleMovieCollection("favorites", "add", "movie")
                      }
                    >
                      <HeartIcon className="w-5 h-5" stroke={"red"} />
                    </Pressable>
                  )}
                </View>
              </View>
              <View>
                <View className="flex flex-1 flex-row justify-between">
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
                          className="text-text bg-secondary flex justify-center items-center px-2 py-1 text-xs rounded-full"
                        >
                          {genre.name}
                        </Text>
                      ),
                    )}
                  </View>
                  <Text className="text-text mt-2">
                    {movie.release_date.split("-")[0]}
                  </Text>
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
              </View>
              <View className="flex flex-col gap-2">
                {!movieInCollections.watched ? (
                  <View className="">
                    <Pressable
                      onPress={() => moveToWatched("movie")}
                      className="bg-gray-700 px-2 py-1 flex justify-center items-center mt-2 rounded-full"
                    >
                      <View className="flex flex-row justify-center items-center gap-4">
                        <CircleCheck className="" />
                        <Text className="">Mark as Watched</Text>
                      </View>
                    </Pressable>
                    <Pressable
                      onPress={() =>
                        toggleMovieCollection(
                          "watchlist",
                          movieInCollections.watchlist ? "remove" : "add",
                          "movie",
                        )
                      }
                      className="bg-accent px-2 py-1 flex justify-center items-center mt-2 rounded-full"
                    >
                      {movieInCollections.watchlist ? (
                        <View className="w-full flex flex-row justify-center items-center gap-4">
                          <BookmarkMinus className="" />
                          <Text className="">Unadd from watchlist</Text>
                        </View>
                      ) : (
                        <View className="w-full flex flex-row justify-center items-center gap-4">
                          <BookmarkPlus className="" />
                          <Text className="">Add to Watchlist</Text>
                        </View>
                      )}
                    </Pressable>
                  </View>
                ) : (
                  /* Watched – only show remove button */
                  <Pressable
                    onPress={() =>
                      toggleMovieCollection("watched", "remove", "movie")
                    }
                    className="bg-gray-600 px-2 py-1 flex justify-center items-center mt-2 rounded-full"
                  >
                    <View className="flex flex-row justify-center items-center gap-2">
                      <X />
                      <Text className="">Remove from watched</Text>
                    </View>
                  </Pressable>
                )}
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
            <View className="mt-6 px-2">
              <Text className="text-text mb-1">Similar Vibes</Text>
              {isLoadingSimilar ? (
                <View className="flex flex-1 self-center justify-center items-center">
                  <LoaderKitView
                    name="BallClipRotateMultiple"
                    style={{ width: 50, height: 50 }}
                    color={"#efe4ef"}
                    className="mt-20"
                  />
                </View>
              ) : errorSimilar ? (
                <Text>An error occurred</Text>
              ) : (
                <View>
                  <MovieList movies={similarMovies ?? []} horizontal={true} />
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

export default MovieDetails;
