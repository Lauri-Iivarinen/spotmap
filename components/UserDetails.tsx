import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from '../util/types';
import { Button } from '@react-native-material/core';

export default function UserDetails({route, navigation}: any){
    const {user, token} = route.params
    const [userData, setUserData] = useState<User>(user)

    const updateUser = async () => {
        try {
            const response = await fetch("https://spotmapback-4682c78c99fa.herokuapp.com/api/user", {
                headers: { Authorization: `Bearer ${token}` }
            })
            const result = await response.json()
            setUserData(result)
        } catch (error) {
            console.log(error)
        }
    }
    //Primary key constraints dont allow spots to be deleted yet, needs fixing on backend
    const deleteSpot = async (id: number) => {
        try {
            const response = await fetch(`https://spotmapback-4682c78c99fa.herokuapp.com/api/spots/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            const result = await response.text()
            console.log(await result)
            if (await result === 'success') updateUser()
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>User: {userData.username}</Text>
            <Button title="Refesh" onPress={updateUser}></Button>
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