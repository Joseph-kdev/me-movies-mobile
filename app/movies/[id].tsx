import { View, Text, ActivityIndicator, ScrollView, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { fetchMovieDetails } from '../services/requests'

const MovieDetails = () => {
  let {id} = useLocalSearchParams() as any
  
  const {data: movie, isLoading, isError} = useQuery({
    queryKey: [`${id}`],
    queryFn: () => fetchMovieDetails({id: id, type:"movie"}),
  })
  return (
    <SafeAreaView>
      {isLoading && (
        <View>
          <ActivityIndicator 
          size="large"
          color="white"
          style={{ alignSelf: "center" }}/>
        </View>
      )}
      {isError && (
        <View>
          <Text>
            Error occurred
          </Text>
        </View>
      )}
      {movie && (
      <View className='bg-primary flex-1'>
        <ScrollView contentContainerStyle = {{ paddingBottom: 80}}>
          <View>
            <Image source={{ uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`}} className='w-full h-[550px]' resizeMode='cover'/>
          </View>
        </ScrollView>
      </View>
      )}
    </SafeAreaView>
  )
}

export default MovieDetails