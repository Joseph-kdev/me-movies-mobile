import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { getAuth, signOut } from '@react-native-firebase/auth'

const Profile = () => {
  const auth = getAuth()
  return (
    <View>
      <Text>profile</Text>
      <Pressable onPress={() => signOut(auth)}>
        <Text>
        Sign out
        </Text>
      </Pressable>
    </View>
  )
}

export default Profile