import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { User, LocationType, Spot } from "../util/types";
import { Button, Snackbar } from "@react-native-material/core";
import { SafeAreaView } from 'react-native-safe-area-context';
import AddSpotModal from './AddSpotModal';

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
    const [newSpotMarker, setNewSpotMarker] = useState<boolean>(false)
    const [newSpotLat, setNewSpotLat] = useState<number>(0)
    const [newSpotLon, setNewSpotLon] = useState<number>(0)
    const [modalVisible, setModalVisible] = useState<boolean>(false)

    const toggleSnackbar = () => {
        setSnackbarVisible(true)
        setTimeout(() => setSnackbarVisible(false), 4000)
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
            resetMarkerPos()
            fetchSpots()
            toggleSnackbar()
        })();
    }, []);
    
    //First shows marker on map, if marker has been shown and confirmed toggle modal that finished adding sopot
    //(name description for now)
    const addSpot = () => {
        if (!newSpotMarker) setNewSpotMarker(true)
        else {
            setNewSpotMarker(false)
            toggleModal()
        }
    }

    //Update marker coordinates after dragging
    const dragFinished = (e: any) => {
        console.log(e.nativeEvent.coordinate)
        const coords = e.nativeEvent.coordinate
        setNewSpotLat(coords.latitude)
        setNewSpotLon(coords.longitude)
    }

    const toggleModal = () => {
        if (modalVisible) resetMarkerPos()
        setModalVisible(!modalVisible)
    }

    //If POST was succesful inside modal
    const spotAdded = () => {
        toggleModal()
        fetchSpots()
        resetMarkerPos()
    }

    const cancelAddSpot = () => {
        resetMarkerPos()
        setNewSpotMarker(false)
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
                        message={'Loged in as ' + user.username}
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
                    return (<Marker key={index} title={spot.name} description={spot.description} coordinate={{latitude: spot.lat, longitude: spot.lon}}></Marker>)
                })}
                </MapView>
                <AddSpotModal visible={modalVisible} toggleModal={toggleModal} spotAdded={spotAdded} lon={newSpotLon} lat={newSpotLat} user={user} token={token}></AddSpotModal>
            </View>
        )
    }
    
}