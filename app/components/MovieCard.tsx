import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Link } from 'expo-router';
import { Star } from 'lucide-react-native';

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
}

const MovieCard = ({ id, poster_path, title, vote_average, release_date, type} : Movie) => {
  return (
    <Link href={`/movies/${id}`} asChild>
      <TouchableOpacity className='w-[32%]'>
        <Image
          source={{ uri: poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : `https://placehold.co/600x400/1a1a1a/FFFFFF.png` }}
          className='w-full h-52 rounded-sm'
          resizeMode='cover'
          />
          <View className='bg-[rgba(0,0,0,0.5)] p-1'>
            <Text numberOfLines={1} className='text-text'>{title}</Text>
            <View className='flex flex-row-reverse justify-between mt-1'>
              <View className='flex-row items-center'>
                <Star height={15} color={"gold"} fill={"gold"}/> 
                <Text className='text-text'>
                  {Math.round(parseFloat(vote_average) * 10)/10}
                </Text>
              </View>
              <Text className='text-text'>
                {release_date?.split("-")[0]}
              </Text>
            </View>
          </View>
      </TouchableOpacity>
    </Link>
  )
}

export default MovieCard