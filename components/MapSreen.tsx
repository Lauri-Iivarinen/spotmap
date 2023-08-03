import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { User, LocationType, Spot } from "../util/types";
import { Snackbar } from "@react-native-material/core";
import { SafeAreaView } from 'react-native-safe-area-context';

//Home screen for logged in users
export default function MapScreen({route, navigation}: any) {

    const {user, token} = route.params

    const [location, setLocation] = useState<LocationType | any>(null);
    const [errorMsg, setErrorMsg] = useState<any>('waiting');
    const [region, setRegion] = useState<any>({
        latitude: 60.2,
        longitude: 24.93,
        latitudeDelta: 0.03,
        longitudeDelta: 0.022,
    });
    const [spots, setSpots] = useState<Spot[]>([])
    const [snackbarVisible, setSnackbarVisible] = useState(false)

    const toggleSnackbar = () => {
        setSnackbarVisible(true)
        setTimeout(() => setSnackbarVisible(false), 4000)
    }

    const fetchSpots = async () => {
        try {
            const response = await fetch("https://spotmapback-4682c78c99fa.herokuapp.com/api/spots")
            const result = await response.json()
            console.log('SPOTS:')
            console.log(await result)
            setSpots(await result)
            setErrorMsg('')
        } catch (error) {
            console.log(error)
        }
        
    }

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
    
            const location: any = await Location.getCurrentPositionAsync({});
            setLocation(location);
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.03,
                longitudeDelta: 0.022
            })
            fetchSpots()
            toggleSnackbar()
        })();
      }, []);

    if (errorMsg.length > 0) {
        return (<View><Text>{errorMsg}</Text></View>)
    } else {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                {snackbarVisible &&
                    <Snackbar
                        message={'Loged in as ' + user.username}
                        style={{width: '100%', marginTop: 50}}
                    />
                }
                <MapView
                    style={{ width: '100%', height: '100%' }}
                    initialRegion={region}
                    showsUserLocation={true}
                >
                {spots.map((spot, index) => {
                    return (<Marker key={index} title={spot.name} description={spot.description} coordinate={{latitude: spot.lat, longitude: spot.lon}}></Marker>)
                })}
                </MapView>
            </View>
        )
    }
    
}