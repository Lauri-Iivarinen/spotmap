import React, { useEffect, useState } from 'react';
import { FlatList, Modal,Pressable,Text,View } from 'react-native';
import { Spot, User, Comment } from '../util/types';
import { Button, TextInput } from '@react-native-material/core';
import Icon from "react-native-vector-icons/Ionicons";

interface SpotDetailsModalProps {
    visible: boolean;
    toggleModal: (likeChanged: boolean) => void;
    spot: Spot;
    user: User;
    like: boolean;
    dislike: boolean;
    token: string;
}

//Shows more detailed preview of the spot
//name/description/likes/dislikes/in the future potentially comment section
export default function SpotDetailsModal(props: SpotDetailsModalProps){

    const [spot, setSpot] = useState<Spot>(props.spot)
    const [like, setLike] = useState<boolean>(false)
    const [dislike, setDislike] = useState<boolean>(false)
    const [likesChanged, setLikesChanged] = useState<boolean>(false)
    const [comment, setComment] = useState<string>('')
    const [comments, setComments] = useState<Comment[]>([])

    const postLike = async (likeType: string) => {
        try {
            const response = await fetch(`https://spotmapback-4682c78c99fa.herokuapp.com/api/spots/${likeType}/${spot.id}`, {
                headers: { Authorization: `Bearer ${props.token}` },
                method: 'POST'
            })
            const result = await response.json()
            if (await result.id === spot.id) {
                setSpot(result)
                setLikesChanged(true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const doLike = async () => {
        setLike(!like)
        if (dislike) setDislike(false)
        postLike('like')
    }

    const doDislike = async () => {
        setDislike(!dislike)
        if (like) setLike(false)
       postLike('dislike')
    }

    useEffect(() => {
        setSpot(props.spot)
        setLike(props.like)
        setDislike(props.dislike)
        setComments(props.spot.comments)
    }, [props.spot, props.like, props.dislike])

    const sendComment = async () => {
        const body = {
            "spot": {
                "id": spot.id
            },
            "comment": comment,
            "user": {
                "id": props.user.id
            }
        }
        if (comment.trim().length === 0) return//Dont spam empty comments

        try {
            const response = await fetch('https://spotmapback-4682c78c99fa.herokuapp.com/api/comments', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${props.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
            const result = await response.text()
            if (await result === 'idk') {
                //Response of idk needs to be changed and backend needs implementation for single spot fetch so comment section can be updated
                setComment('')
                setLikesChanged(true)
            }
        } catch (error) {
            console.log(error)
        }
    }

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
                <View style={{backgroundColor: 'rgb(220,220,255)', padding: 2, borderWidth: 1, marginTop: 10}}>
                    <Text>Comments:</Text>
                    <FlatList
                        data={comments}
                        renderItem={({ item }) => <View style={{padding: 3, borderWidth: 1, borderRadius: 10, margin: 2, backgroundColor: 'white'}}>
                            <Text>{item.user.username}: {item.comment}</Text>
                        </View>}
                    ></FlatList>
                    <TextInput style={{marginTop: 5, padding: 5}} onChangeText={(e) => setComment(e)} value={comment} label='Add comment'></TextInput>
                    <Button title="Comment" onPress={sendComment}></Button>
                </View>
                <Button style={{marginTop: 50}} title='Close' onPress={() => props.toggleModal(likesChanged)}></Button>
            </View>
        </Modal>
    )
}