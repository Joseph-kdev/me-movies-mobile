import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { Star } from "lucide-react-native";

export interface Movie {
  id: string;
  poster_path: string;
  name?: string;
  title?: string;
  overview: string;
  vote_average: string;
  release_date?: string;
  first_air_date?: string;
  type: "tv" | "movie";
  horizontal: boolean;
}

const MovieCard = ({
  id,
  poster_path,
  title,
  vote_average,
  release_date,
  type,
  horizontal,
}: Movie) => {
  return (
    <Link
      key={id}
      href={{
        pathname: type === "movie" ? `/movies/[id]` : `/tv/[id]`,
        params: { id: id },
      }}
      asChild
    >
      <TouchableOpacity className={horizontal ? "w-36" : "w-[32%]"}>
        <Image
          source={{
            uri: poster_path
              ? `https://image.tmdb.org/t/p/w500${poster_path}`
              : `https://placehold.co/600x400/1a1a1a/FFFFFF.png`,
          }}
          className="w-full h-52 rounded-lg relative"
          resizeMode="cover"
        />
        <View className="flex flex-row justify-center items-center absolute top-2 right-1 z-10 bg-gray-600 rounded-full p-1 gap-1">
          <Star height={12} width={12} color={"gold"} fill={"gold"} />
          <Text className="text-text text-xs">
            {Math.round(parseFloat(vote_average) * 10) / 10}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default MovieCard;
