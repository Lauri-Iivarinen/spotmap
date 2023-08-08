import React, { useEffect, useState } from 'react';
import { Modal,Pressable,Text,View } from 'react-native';
import { Spot, User } from '../util/types';
import { Button } from '@react-native-material/core';
import Icon from "react-native-vector-icons/Ionicons";

interface SpotDetailsModalProps {
    visible: boolean;
    toggleModal: () => void;
    spot: Spot;
    user: User;
    like: boolean;
    dislike: boolean;
}

//Shows more detailed preview of the spot
//name/description/likes/dislikes/in the future potentially comment section
export default function SpotDetailsModal(props: SpotDetailsModalProps){

    const [spot, setSpot] = useState<Spot>(props.spot)
    const [like, setLike] = useState<boolean>(false)
    const [dislike, setDislike] = useState<boolean>(false)

    const doLike = () => {
        setLike(!like)
        if (dislike) setDislike(false)
    }

    const doDislike = () => {
        setDislike(!dislike)
        if (like) setLike(false)
    }

    useEffect(() => {
        setSpot(props.spot)
        setLike(props.like)
        setDislike(props.dislike)
    }, [props.spot, props.like, props.dislike])

    return(
        <Modal visible={props.visible}>
            <View style={{marginTop: '30%', marginBottom: '30%', padding: 5}}>
                <Text style={{fontSize: 40}}>{spot.name}</Text>
                <Text>{spot.description}</Text>
                <View style={{flexDirection: 'row', marginTop: 20}}>
                    <View style={{marginRight: 10, padding: 3, borderWidth: 2, borderRadius: 20, width: 100, borderColor: like? 'green': 'black'}}>
                        <Pressable onPress={doLike} style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                        <Icon name='thumbs-up-outline' size={32} color={like? 'green': 'black'}></Icon>
                            <Text>
                                {spot.likes}
                            </Text>
                        </Pressable>
                    </View>
                    <View style={{padding: 3, borderWidth: 2, borderRadius: 20, width: 100, borderColor: dislike? 'red': 'black'}}>
                        <Pressable onPress={doDislike} style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                        <Icon name='thumbs-down-outline' size={32} color={dislike? 'red': 'black'}></Icon>
                            <Text>
                                {spot.dislikes}
                            </Text>
                        </Pressable>
                    </View>
                </View>
                <Button style={{marginTop: 50}} title='Close' onPress={() => props.toggleModal()}></Button>
            </View>
        </Modal>
    )
}