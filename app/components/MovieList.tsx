import { View, FlatList, Text } from "react-native";
import React from "react";
import MovieCard, { Movie } from "./MovieCard";

const MovieList = ({ movies }: { movies: Movie[] }) => {
  return (
    <View>
      <FlatList
        data={movies}
        maxToRenderPerBatch={8}
        renderItem={({ item }) => (
          <MovieCard
            id={item.id}
            title={item.title ? item.title : item.name}
            overview={item.overview}
            poster_path={item.poster_path}
            vote_average={item.vote_average}
            release_date={
              item.release_date ? item.release_date : item.first_air_date
            }
            type={item.type || (item.name ? "tv" : "movie")}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 8,
          paddingRight: 5,
          marginBottom: 10,
        }}
        className="mt-2 pb-32"
        scrollEnabled={false}
        ListEmptyComponent={
          <View className="mt-10 justify-center items-center">
            <Text className="text-lg font-semibold">
              No data found
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default MovieList;
