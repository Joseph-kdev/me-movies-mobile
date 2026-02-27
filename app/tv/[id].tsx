import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Pressable,
  Alert,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMovieDetails, getSimilarMovies } from "../services/requests";
import {
  BookmarkMinus,
  BookmarkPlus,
  ChevronLeft,
  CircleCheck,
  HeartIcon,
  LogIn,
  Star,
  X,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
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
import { toast } from "sonner-native";
import TrailerSection from "../components/TrailerSection";

const TvDetails = () => {
  let { id } = useLocalSearchParams() as any;
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const router = useRouter();
  const [tvInCollections, setTvInCollections] = useState({
    watched: false,
    watchlist: false,
    favorites: false,
  });
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const onTextLayout = (event: { nativeEvent: { lines: string | any[] } }) => {
    if (event.nativeEvent.lines.length > 4) {
      setShowReadMore(true);
    }
  };

  const {
    data: tvShow,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [`${id}`],
    queryFn: () => fetchMovieDetails({ id: id, type: "tv" }),
  });

  const {
    data: similarShows,
    isLoading: isLoadingSimilar,
    error: errorSimilar,
  } = useQuery({
    queryKey: ["similar-movies", `${id}-movie`],
    queryFn: () => getSimilarMovies(id, "movie"),
    enabled: !!tvShow, // only fetch when movie exists
    staleTime: 1000 * 60 * 30, // 30 minutes – similar lists don't change often
    gcTime: 1000 * 60 * 60, // keep in cache 1 hour
  });

  const getPreferredTrailer = (videos: { results: Array<{ type: string; key: string; official?: boolean; name?: string }> } | undefined) => {
    if (!videos?.results?.length) return null;

    const results = videos.results;

    // 1. Official trailer (most reliable when present)
    let trailer = results.find(v => v.type === "Trailer" && v.official === true);
    if (trailer) return trailer;

    // 2. Any trailer (most common fallback)
    trailer = results.find(v => v.type === "Trailer");
    if (trailer) return trailer;

    // 3. First YouTube clip (very last resort — could be featurette, teaser, etc.)
    trailer = results.find(v => v.site === "YouTube"); // or just take results[0]
    if (trailer) return trailer;

    return null;
  };

  const officialTrailer = tvShow ? getPreferredTrailer(tvShow.videos) : null;

  const trailerKey = officialTrailer?.key ?? "";

  useEffect(() => {
    const fetchTvCollections = async () => {
      if (!user) {
        setTvInCollections({
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
                where("type", "==", "tv"),
              ),
            ),
          ),
        );
        const tvInCollections = results.reduce(
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
        setTvInCollections(tvInCollections);
      } catch (error) {
        Alert.alert("Error checking for tv show in database");
        console.log(error);
      }
    };

    if (user) {
      fetchTvCollections();
    }
  }, [user, id]);

  const toggleTvCollection = async (
    listType: string,
    action: string,
    type: string,
  ) => {
    if (!user) {
      toast.error("Sign in to manage your collection", {
        description: "Create an account to save movies & shows",
        duration: 4000,
        icon: <LogIn size={18} color="#ef4444" />,
        style: { backgroundColor: '#2d0808' },
      });
      return;
    }

    try {
      const db = getFirestore();
      const collectionRef = collection(db, `users/${user.uid}/${listType}`);
      const tvQuery = query(
        collectionRef,
        where("id", "==", id),
        where("type", "==", type),
      );

      // Build query to check if show already exists
      const querySnapshot = await getDocs(tvQuery);

      if (querySnapshot.empty) {
        // Show not found, add it
        if (action === "add") {
          await addDoc(collectionRef, {
            id,
            title: tvShow.title || tvShow.name,
            overview: tvShow.overview,
            poster_path: tvShow.poster_path,
            vote_average: tvShow.vote_average,
            release_date: tvShow.first_air_date,
            type,
          });

          setTvInCollections((prevState) => ({
            ...prevState,
            [listType]: true,
          }));
          queryClient.invalidateQueries({ queryKey: [listType, user.uid] });
          queryClient.invalidateQueries({ queryKey: ["userStats", user.uid] });
          toast.success(`Added to ${listType.charAt(0).toUpperCase() + listType.slice(1)}`, {
            duration: 3000,
            icon:
              listType === "favorites" ? (
                <HeartIcon size={18} fill="red" stroke="red" />
              ) : (
                <BookmarkPlus size={18} color="#22c55e" />
              ),
            style:
              listType === "favorites"
                ? { backgroundColor: '#2d1015' }
                : { backgroundColor: '#0a1f14' },
          });
        } else {
          console.log("Cannot remove non-existent show");
        }
      } else {
        // Show found, perform action based on 'add' or 'remove'
        const docRef = querySnapshot.docs[0].ref; // Get reference of the found document
        if (action === "add") {
          toast(`Already in ${listType.charAt(0).toUpperCase() + listType.slice(1)}`, {
            duration: 2000,
            icon:
              listType === "favorites" ? (
                <HeartIcon size={18} stroke="#9ca3af" />
              ) : (
                <BookmarkPlus size={18} stroke="#9ca3af" />
              ),
            style: { backgroundColor: '#222228' },
          });
        } else if (action === "remove") {
          await deleteDoc(docRef);

          setTvInCollections((prevState) => ({
            ...prevState,
            [listType]: false,
          }));
          queryClient.invalidateQueries({ queryKey: [listType, user.uid] });
          queryClient.invalidateQueries({ queryKey: ["userStats", user.uid] });
          toast.success(`Removed from ${listType.charAt(0).toUpperCase() + listType.slice(1)}`, {
            duration: 2500,
            icon:
              listType === "favorites" ? (
                <HeartIcon size={18} stroke="#9ca3af" />
              ) : (
                <BookmarkMinus size={18} stroke="#9ca3af" />
              ),
            style: { backgroundColor: '#1a1a2e' },
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const moveToWatched = async (type: string) => {
    try {
      if (!user) {
        toast.error("Sign in to manage your collection", {
          description: "Create an account to save movies & shows",
          duration: 4000,
          icon: <LogIn size={18} color="#ef4444" />,
        });
        return;
      }

      const db = getFirestore();
      const watchlistRef = collection(db, `users/${user.uid}/watchlist`);
      const watchlistQuery = query(
        watchlistRef,
        where("id", "==", id),
        where("type", "==", type),
      );
      const watchlistQuerySnapshot = await getDocs(watchlistQuery);

      if (!watchlistQuerySnapshot.empty) {
        const watchlistDocRef = watchlistQuerySnapshot.docs[0].ref;
        await deleteDoc(watchlistDocRef);
      }

      // Add the show to the watched collection
      const watchedRef = collection(db, `users/${user.uid}/watched`);
      await addDoc(watchedRef, {
        id,
        title: tvShow.title || tvShow.name,
        overview: tvShow.overview,
        poster_path: tvShow.poster_path,
        vote_average: tvShow.vote_average,
        release_date: tvShow.first_air_date,
        type,
      });

      // Update the tvInCollections state
      setTvInCollections((prev) => ({
        ...prev,
        watched: true,
        watchlist: false,
      }));
      queryClient.invalidateQueries({ queryKey: ["watched", user.uid] });
      queryClient.invalidateQueries({ queryKey: ["watchlist", user.uid] });
      queryClient.invalidateQueries({ queryKey: ["userStats", user.uid] });
      toast.success("Marked as watched", {
        description: "Hope you enjoyed it!",
        duration: 3000,
        icon: <CircleCheck size={18} color="#22c55e" />,
        style: { backgroundColor: '#0a1f14' },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar hidden={false} />
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
      {tvShow && (
        <ScrollView
          className="flex-1 min-h-screen bg-background"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ minHeight: "100%", paddingBottom: 28 }}
        >
          <View className="relative">
            <Pressable
              className="absolute top-4 left-2 z-50 bg-primary p-1 rounded-full flex justify-center"
              onPress={() => router.back()}
            >
              <ChevronLeft />
            </Pressable>
            <LinearGradient
              colors={["transparent", "#18181b", "#160d15"]}
              className="absolute w-full h-[800px] z-10"
            ></LinearGradient>
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w500${tvShow?.poster_path}`,
              }}
              className="w-full h-[550px] absolute"
              resizeMode="cover"
            />
          </View>
          <View className="mt-[400px] px-2 min-h-screen z-20">
            <View className="flex flex-row justify-between items-center mb-1">
              <Text className="text-2xl font-bold mt-2 text-text">
                {tvShow.title || tvShow.name}
              </Text>
              <View className="mt-4">
                {tvInCollections.favorites ? (
                  <Pressable
                    onPress={() =>
                      toggleTvCollection("favorites", "remove", "tv")
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
                      toggleTvCollection("favorites", "add", "tv")
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
                  {tvShow.genres.map(
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
                  {tvShow?.first_air_date.split("-")[0]}
                </Text>
              </View>
              <View className="flex-row gap-4 mt-2 justify-between">
                <Text className="text-text">
                  {tvShow?.number_of_seasons} season(s)
                </Text>
                <View className="flex-row items-center">
                  <Star height={15} color={"gold"} fill={"gold"} />
                  <Text className="text-text">
                    {Math.round(parseFloat(tvShow.vote_average) * 10) / 10}
                  </Text>
                </View>
              </View>
            </View>
            <View className="flex flex-col gap-2 my-4">
              {!tvInCollections.watched ? (
                <View className="">
                  <Pressable
                    onPress={() => moveToWatched("tv")}
                    className="bg-gray-700 px-2 py-1 flex justify-center items-center mt-2 rounded-full"
                  >
                    <View className="flex flex-row justify-center items-center gap-4">
                      <CircleCheck className="" />
                      <Text className="">Mark as Watched</Text>
                    </View>
                  </Pressable>
                  <Pressable
                    onPress={() =>
                      toggleTvCollection(
                        "watchlist",
                        tvInCollections.watchlist ? "remove" : "add",
                        "tv",
                      )
                    }
                    className="bg-accent px-2 py-1 flex justify-center items-center mt-2 rounded-full"
                  >
                    {tvInCollections.watchlist ? (
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
                    toggleTvCollection("watched", "remove", "tv")
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
              {tvShow.overview ? (
                <>
                  <Text
                    numberOfLines={isExpanded ? undefined : 4}
                    onTextLayout={onTextLayout}
                    className="text-text text-pretty"
                  >
                    {tvShow.overview}
                  </Text>
                  {showReadMore && (
                    <TouchableOpacity onPress={toggleExpanded} className="mt-2">
                      <Text className="text-accent font-medium">
                        {isExpanded ? "Read less" : "Read more"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <View className="flex flex-col items-center justify-center mt-4 border border-secondary/50 rounded-xl p-4 bg-secondary/20">
                  <Image source={require("../../assets/images/nothing.png")} className="w-[100px] h-[100px] opacity-80" resizeMode="contain" />
                  <Text className="text-text/70 italic text-center mt-2">
                    No overview available for this title.
                  </Text>
                </View>
              )}
            </View>
            <View>
              <Text className="mt-6 text-lg text-text">Top Cast</Text>
              {tvShow.credits?.cast && tvShow.credits.cast.length > 0 ? (
                <FlatList
                  data={tvShow.credits.cast}
                  keyExtractor={(item) => item.id}
                  horizontal
                  maxToRenderPerBatch={4}
                  ItemSeparatorComponent={() => <View className="w-2" />}
                  renderItem={({ item }) => (
                    <View className="flex flex-col items-center mx-1">
                      {item.profile_path ? (
                        <Image
                          source={{
                            uri: `https://image.tmdb.org/t/p/w500${item.profile_path}`,
                          }}
                          className="rounded-full w-24 h-24"
                          resizeMode="cover"
                        />
                      ) : (
                        <Image
                          source={require("../../assets/images/nothing.png")}
                          className="rounded-full bg-secondary/50 w-24 h-24"
                          resizeMode="cover"
                        />
                      )}
                      <Text className="text-xs text-text mt-1 text-center w-[80px]" numberOfLines={2}>
                        {item.name}
                      </Text>
                    </View>
                  )}
                  className="mt-2 pb-2"
                />
              ) : (
                <View className="flex flex-col items-center justify-center mt-4 border border-secondary/50 rounded-xl p-4 bg-secondary/20">
                  <Image source={require("../../assets/images/sad.png")} className="w-[80px] h-[80px] opacity-70" resizeMode="contain" />
                  <Text className="text-text/70 italic text-center mt-2">
                    Cast information is currently unavailable.
                  </Text>
                </View>
              )}
            </View>
            <View className="mt-2">
              <Text className="text-text text-lg">Trailer</Text>
              <View className="max-w-full flex justify-center items-center mt-1">
                {trailerKey ? (
                  <TrailerSection videoKey={trailerKey}/>
                ) : officialTrailer === null && tvShow?.videos?.results?.length > 0 ? (
                  // Edge case: videos exist, but none are suitable (rare)
                  <View className="w-full aspect-video bg-gray-900/50 rounded-xl justify-center items-center">
                    <Image source={require("../../assets/images/sad.png")} className="w-[80px] h-[80px] opacity-70" resizeMode="contain" />
                    <Text className="text-gray-400 text-center px-6">
                      No playable trailer available
                    </Text>
                  </View>
                ) : (
                  // No videos at all → clean empty state
                  <View className="w-full aspect-video bg-gray-900/50 rounded-xl justify-center items-center">
                    <Image source={require("../../assets/images/sad.png")} className="w-[80px] h-[80px] opacity-70" resizeMode="contain" />
                    <Text className="text-gray-400 text-center px-6">
                      Trailer not available
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <View className="mt-4 px-1">
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
                <View className="flex-1">
                  <Image
                    source={require("../../assets/images/nothing.png")}
                    resizeMode="contain"
                    className="w-full h-[100px] rounded-md mt-2"
                  />
                  <Text className="text-text text-center mt-1 text-sm">Oops...An error occurred</Text>
                </View>
              ) : (
                <View>
                  <MovieList movies={similarShows ?? []} horizontal={true} />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default TvDetails;
