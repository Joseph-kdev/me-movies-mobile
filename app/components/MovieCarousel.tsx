import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { fetchMovieDetails } from "../services/requests";
import { useQueries } from "@tanstack/react-query";
import { Play, Star } from "lucide-react-native";
import { useRouter } from "expo-router";

const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");
const CAROUSEL_HEIGHT = screenHeight * 0.5;

const CarouselComponent = () => {
  const images = [
    { id: 293660, source: require("../../assets/images/deadpool.jpg") },
    { id: 546554, source: require("../../assets/images/knives-out.jpg") },
    { id: 157336, source: require("../../assets/images/interstellar.jpg") },
    { id: 372058, source: require("../../assets/images/your-name.jpg") },
    { id: 359724, source: require("../../assets/images/ford-v-ferrari.jpg") },
    { id: 13, source: require("../../assets/images/forrest-gump.jpg") },
    { id: 872585, source: require("../../assets/images/oppenheimer.jpg") },
  ];

  const editorsChoiceIds = [293660, 546554, 13, 372058, 157336, 359724, 872585];

  const router = useRouter()

  const queries = editorsChoiceIds.map((movieId) => ({
    queryKey: ["movie", movieId],
    queryFn: () => fetchMovieDetails({ id: movieId, type: "movie" }),
    enabled: !!movieId,
  }));

  const queryResults = useQueries({ queries });
  const isLoading = queryResults.some((result) => result.isLoading);
  const isError = queryResults.some((result) => result.isError);

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const autoplayRef = useRef(null);

  // Create extended data for infinite loop
  const extendedImages = [
    queryResults[queryResults.length - 1], // Last item at the beginning
    ...queryResults,
    queryResults[0], // First item at the end
  ];

  // Autoplay functionality
  useEffect(() => {
    const startAutoplay = () => {
      autoplayRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % images.length;
          flatListRef.current?.scrollToOffset({
            offset: (nextIndex + 1) * screenWidth, // +1 for the duplicate at the start
            animated: true,
          });
          return nextIndex;
        });
      }, 3000);
    };

    const stopAutoplay = () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };

    startAutoplay();
    return () => stopAutoplay();
  }, []);

  const onMomentumScrollEnd = useCallback(
    (event: {
      nativeEvent: {
        layoutMeasurement: { width: any };
        contentOffset: { x: number };
      };
    }) => {
      const slideSize = event.nativeEvent.layoutMeasurement.width;
      const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);

      if (index === 0) {
        // Jump to the last real item
        flatListRef.current?.scrollToOffset({
          offset: images.length * slideSize,
          animated: false,
        });
        setCurrentIndex(images.length - 1);
      } else if (index === extendedImages.length - 1) {
        // Jump to the first real item
        flatListRef.current?.scrollToOffset({
          offset: slideSize,
          animated: false,
        });
        setCurrentIndex(0);
      } else {
        setCurrentIndex(index - 1); // Adjust for the duplicate at the start
      }
    },
    [images.length],
  );

  const onScrollBeginDrag = useCallback(() => {
    // Stop autoplay when user starts dragging
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
  }, []);

  const onScrollEndDrag = useCallback(() => {
    // Restart autoplay after user stops dragging
    autoplayRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % images.length;
        flatListRef.current?.scrollToOffset({
          offset: (nextIndex + 1) * screenWidth, // +1 for the duplicate
          animated: true,
        });
        return nextIndex;
      });
    }, 3000);
  }, []);

  const renderItem = useCallback(({ item }) => {
    return (
      <View style={styles.slide}>
        <Image
          source={images.find((image) => image.id === item.data.id)?.source}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.overlay}></View>
        <View className="absolute left-2 bottom-10 z-10">
          <Text className="text-text text-2xl mb-4">{item.data.title}</Text>
          <View className="flex-row items-center">
            <Star height={15} color={"gold"} fill={"gold"} />
            <Text className="text-text">
              {Math.round(parseFloat(item.data.vote_average) * 10) / 10}
            </Text>
          </View>
          <View></View>
        </View>
        <TouchableOpacity
          className="absolute bottom-10 right-2 z-10 flex flex-row items-center bg-gray-800 p-4 rounded-md active:opacity-70"
          onPress={() =>
            router.push({ pathname: "/movies/[id]", params: { id: item.data.id } })
          }
        >
          <Play height={12} color="#a3dcbc" fill="#a3dcbc" />
          <Text className="text-text text-sm ml-1">Watch Trailer</Text>
        </TouchableOpacity>
      </View>
    );
  }, []);

  const getItemLayout = useCallback(
    (data: any, index: number) => ({
      length: screenWidth,
      offset: screenWidth * index,
      index,
    }),
    [],
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="white"
          style={{ marginTop: 40, alignSelf: "center" }}
        />
      ) : isError ? (
        <Text style={{ color: "white", textAlign: "center" }}>
          Error loading movies
        </Text>
      ) : (
        <FlatList
          ref={flatListRef}
          data={extendedImages}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.data.id}-${index}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onMomentumScrollEnd}
          onScrollBeginDrag={onScrollBeginDrag}
          onScrollEndDrag={onScrollEndDrag}
          scrollEventThrottle={16}
          getItemLayout={getItemLayout}
          initialScrollIndex={1} // Start at the first real item
          style={styles.flatList}
          initialNumToRender={3}
          maxToRenderPerBatch={3}
          windowSize={5}
        />
      )}

      <View style={styles.dotsContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === currentIndex
                    ? "#160d15"
                    : "rgba(255, 255, 255, 0.214)",
                transform: [{ scale: index === currentIndex ? 1.2 : 1 }],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: CAROUSEL_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  flatList: {
    width: screenWidth,
    height: CAROUSEL_HEIGHT,
  },
  slide: {
    width: screenWidth,
    height: CAROUSEL_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: screenWidth,
    height: CAROUSEL_HEIGHT,
  },
  indicatorContainer: {
    position: "absolute",
    top: 20,
    backgroundColor: "rgba(0, 0, 0, 0.368)",
    borderRadius: 15,
    padding: 5,
  },
  dotsContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
    zIndex: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.662)",
    width: screenWidth,
    height: CAROUSEL_HEIGHT,
    zIndex: 9,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CarouselComponent;
