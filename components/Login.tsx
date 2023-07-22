import React,{useState, useEffect} from "react";
import { View, Text, TextInput, Button } from "react-native";
import { encode, decode } from 'js-base64';
import AsyncStorage from "@react-native-async-storage/async-storage";


type LoginProps = {
    fetchUserData: (token: string) => void;
}

//Need to add module for creating new user -> passwords needs to use bcrypt
export default function Login(props: LoginProps) {

    const [userName, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const saveTokenToStorage = async (token: string) => {
        const action = AsyncStorage.setItem('token', token)
        props.fetchUserData(token)
    }

    //Base 64 encodes password and username
    const fetchToken = async () => {
        try {
            const response = await fetch('https://spotmapback-4682c78c99fa.herokuapp.com/api/token', {
                method: 'POST',
                headers: { Authorization: `Basic ${encode(userName + ':' + password)}` }
            })
            const result = await response.text()
            saveTokenToStorage(await result)
        } catch (error) {
            console.log(error)
        }
    }
    
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>LOGIN</Text>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start',}}>
                <Text>Username</Text>
                <TextInput style={{ width: 200, borderColor: 'black', borderWidth: 1 }} onChangeText={(e) => setUsername(e)}></TextInput>
                <Text>Password</Text>
                <TextInput style={{ width: 200, borderColor: 'black', borderWidth: 1 }} onChangeText={(e) => setPassword(e)} secureTextEntry={true}></TextInput>
                <Button title='login' onPress={() => fetchToken()}></Button>
            </View>
        </View>
    )
}