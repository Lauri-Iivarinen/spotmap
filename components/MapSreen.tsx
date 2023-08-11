import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import MapView, { Callout, Circle, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { User, LocationType, Spot, SpotIdList } from "../util/types";
import { Button, Snackbar } from "@react-native-material/core";
import { SafeAreaView } from 'react-native-safe-area-context';
import AddSpotModal from './AddSpotModal';
import SpotDetailsModal from './SpotDetailsModal';

//Home screen for logged in users
export default function MapScreen({route, navigation}: any) {

    const {token} = route.params

    const [user, setUser] = useState(route.params.user)
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
    const [newSpotMarker, setNewSpotMarker] = useState<boolean>(false)
    const [newSpotLat, setNewSpotLat] = useState<number>(0)
    const [newSpotLon, setNewSpotLon] = useState<number>(0)
    const [spotModalVisible, setSpotModalVisible] = useState<boolean>(false)
    const [snackbarText, setSnackbarText] = useState<string>('')
    const [spotDetailsModalVisible, setSpotDetailsModalVisible] = useState<boolean>(false)
    //Active/Selected spot
    const [spotDetails, setSpotDetails] = useState<Spot>({name: '', id: 0, description: '', likes: 0, dislikes: 0, image: '', lon: 0, lat: 0, comments: []})
    const [like, setLike] = useState<boolean>(false)
    const [dislike, setDislike] = useState<boolean>(false)

    const showSnackbar = (text: string) => {
        setSnackbarText(text)
        setSnackbarVisible(true)
        setTimeout(() => {
            setSnackbarVisible(false)
            setSnackbarText('')
        }, 4000)
    }

    const resetMarkerPos = () => {
        setNewSpotLat(location.coords.latitude)
        setNewSpotLon(location.coords.longitude)
    }

    const fetchSpots = async () => {
        try {
            const response = await fetch("https://spotmapback-4682c78c99fa.herokuapp.com/api/spots")
            const result = await response.json()
            setSpots(await result)
            setErrorMsg('')
        } catch (error) {
            console.log(error)
        }
    }

    const updateUser = async () => {
        try {
            const response = await fetch("https://spotmapback-4682c78c99fa.herokuapp.com/api/user", {
                headers: { Authorization: `Bearer ${token}` }
            })
            const result = await response.json()
            setUser(result)
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
            //resetMarkerPos()
            fetchSpots()
            showSnackbar('Loged in as ' + user.username)
        })();
    }, []);
    
    //First shows marker on map, if marker has been shown and confirmed toggle modal that finished adding sopot
    //(name description for now)
    const addSpot = () => {
        if (!newSpotMarker) {
            resetMarkerPos()
            setNewSpotMarker(true)
        }else {
            setNewSpotMarker(false)
            toggleSpotModal()
        }
    }

    //Update marker coordinates after dragging
    const dragFinished = (e: any) => {
        console.log(e.nativeEvent.coordinate)
        const coords = e.nativeEvent.coordinate
        setNewSpotLat(coords.latitude)
        setNewSpotLon(coords.longitude)
    }

    //Addig spot modal
    const toggleSpotModal = () => {
        if (spotModalVisible) resetMarkerPos()
        setSpotModalVisible(!spotModalVisible)
    }

    const toggleSpotDetailsModal = (likesChanged: boolean) => {
        if(spotDetailsModalVisible){
            setDislike(false)
            setLike(false)
        }
        setSpotDetailsModalVisible(!spotDetailsModalVisible)
        if (likesChanged) {
            updateUser()
            fetchSpots()
        }
    }

    //If POST was succesful inside modal
    const spotAdded = () => {
        toggleSpotModal()
        fetchSpots()
        resetMarkerPos()
        showSnackbar('Spot added succesfully.')
    }

    const cancelAddSpot = () => {
        resetMarkerPos()
        setNewSpotMarker(false)
    }

    const checkForLikes = (spot: Spot) => {
        const foundLike = user.likes.find((like: SpotIdList) => like.id === spot.id)
        if (foundLike !== undefined){
            setLike(true)
            setDislike(false)
            return
        }
        const foundDislike = user.dislikes.find((dislike: SpotIdList) => dislike.id === spot.id)
        if (foundDislike !== undefined){
            setLike(false)
            setDislike(true)
        }
    }

    //Prevents overlap of snackbar and buttons because requires 2 different conditionals
    const buttons = () => !newSpotMarker
        ? <Button
            title='Add spot'
            style={{ width: '100%', height: 50, marginTop: 50, justifyContent: 'center', alignItems: 'center' }}
            onPress={addSpot}
        />
        : <View style={{flexDirection: 'row'}}>
            <Button
                title='Confirm'
                style={{ width: '50%', height: 50, marginTop: 50, justifyContent: 'center', alignItems: 'center' }}
                onPress={addSpot}
            />
            <Button
                title='Cancel'
                style={{ width: '50%', height: 50, marginTop: 50, justifyContent: 'center', alignItems: 'center' }}
                onPress={cancelAddSpot}
            />
        </View>

    if (errorMsg.length > 0) {
        return (<View><Text>{errorMsg}</Text></View>)
    } else {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                {snackbarVisible &&
                    <Snackbar
                        message={snackbarText}
                        style={{width: '100%', height: 50, marginTop: 50}}
                    />
                }
                {!snackbarVisible &&
                    buttons()
                }
                <MapView
                    style={{ width: '100%', height: '100%' }}
                    initialRegion={region}
                    showsUserLocation={true}
                >
                {newSpotMarker &&
                <Marker
                    coordinate={{ latitude: newSpotLat, longitude: newSpotLon }}
                    pinColor='blue'
                    isPreselected={true}
                    draggable
                    onDragEnd={(e) => dragFinished(e)}
                />
                }
                {spots.map((spot, index) => {
                    return (
                        <Marker 
                            key={index} 
                            coordinate={{latitude: spot.lat, longitude: spot.lon}}
                            >
                                <Callout style={{width: 200, height: 60, justifyContent: 'center'}}>
                                    <Text>{spot.name}</Text>
                                    <Text>Likes: {spot.likes}</Text>
                                    <Button title='Show info' onPress={() => {
                                        setLike(false)
                                        setDislike(false)
                                        setSpotDetails(spot)
                                        checkForLikes(spot)
                                        toggleSpotDetailsModal(false)
                                    }}></Button>
                                </Callout>
                        </Marker>
                    )
                })}
                </MapView>
                <AddSpotModal visible={spotModalVisible} toggleModal={toggleSpotModal} spotAdded={spotAdded} lon={newSpotLon} lat={newSpotLat} user={user} token={token}></AddSpotModal>
                <SpotDetailsModal token={token} like={like} dislike={dislike} user={user} visible={spotDetailsModalVisible} toggleModal={toggleSpotDetailsModal} spot={spotDetails!}></SpotDetailsModal>
            </View>
        )
    }
    
}