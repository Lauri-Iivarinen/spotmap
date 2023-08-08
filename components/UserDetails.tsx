import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from '../util/types';
import { Button } from '@react-native-material/core';

export default function UserDetails({route, navigation}: any){
    const {user, token} = route.params
    const [userData] = useState<User>(user)
    const [userToken] = useState(token)

    //spot deletion needs to be implemented in backend
    const deleteSpot = async (id: number) => {
        try {
            const response = await fetch('')
            const result = await response.json()
            console.log(await result)
        } catch (error) {
            console.log(error)
        }
        
    }

    return(
        <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>User: {userData.username}</Text>
            <Text style={{marginTop: 10}}>Spots:</Text>
            <View style={{alignItems: 'flex-start'}}>
            {userData.spots?.map(spot => {
                return <View key={spot.id} style={{padding: 3}}>
                    <Text>{spot.name} - {spot.description}</Text>
                    <Text>Likes: {spot.likes}</Text>
                    <Button title='delete' onPress={() => deleteSpot(spot.id)}></Button>
                </View>
            })}
            </View>
        </SafeAreaView>
    )
}