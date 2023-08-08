import { Button, TextInput } from "@react-native-material/core";
import React, {useState} from "react";
import { Modal,View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { User } from "../util/types";

interface AddSpotModalProps {
    visible: boolean;
    toggleModal: () => void;
    spotAdded: () => void;
    lon: number;
    lat: number;
    user: User;
    token: string;
}

export default function AddSpotModal(props: AddSpotModalProps) {

    const [spotName, setSpotName] = useState<string>('')
    const [spotDescription, setSpotDescription] = useState<string>('')

    const submitNewSpot = async () => {
        const body = {
            "name": spotName,
            "image": "url",
            "description": spotDescription,
            "lon": props.lon,
            "lat": props.lat, 
            "user": {
                "id": props.user.id
            }
        }
        console.log('spot:')
        console.log(JSON.stringify(body))

        try {
            const response = await fetch("https://spotmapback-4682c78c99fa.herokuapp.com/api/spots", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${props.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
            const result = await response.json()
            console.log(await result)
            if (await result.name === spotName) {
                props.spotAdded()
            }
        } catch (error) {
            console.log(error)
        }
    }

    //close modal
    const cancelSubmit = () => {
        setSpotName('')
        setSpotDescription('')
        props.toggleModal()
    }
    
    return (
        <Modal
            visible={props.visible}
            animationType="slide"
        >
            <View style={{
                marginTop: '35%',
                alignSelf: 'center',
                backgroundColor: 'white',
                borderRadius: 20,
                padding: 60,
                alignItems: 'center',
            }}
            >
                <Text style={{fontSize: 25, marginBottom: 10}}>Add new spot</Text>
                <TextInput style={{ width: 200, borderWidth: 1, marginBottom: 5 }} label='Spot name' value={spotName} onChangeText={(e) => setSpotName(e)}></TextInput>
                <TextInput style={{ width: 200, borderWidth: 1 }} label='Spot description' value={spotDescription} onChangeText={(e) => setSpotDescription(e)}></TextInput>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                    <Button title='submit' onPress={submitNewSpot}></Button>
                    <Button title='cancel' onPress={cancelSubmit}></Button>
                </View>
            </View>
        </Modal>
    )
}