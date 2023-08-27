import React,{useState, useEffect} from "react";
import { View, Text, TextInput, Button } from "react-native";
import { encode } from 'js-base64';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firstLetterToUpper, validatePassword, validateUsername } from "../util/TextValidation";

type LoginProps = {
    fetchUserData: (token: string) => void;
}

//Page for authenticating user, either log in with credentials or create new account
export default function Login(props: LoginProps) {

    const [userName, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [newUser, setNewUser] = useState<boolean>(false)
    const [value, setValue] = useState(' ')//message

    const saveTokenToStorage = async (token: string) => {
        const action = AsyncStorage.setItem('token', token)
        props.fetchUserData(token)
    }

    //Base64 encoded for API call, password is then bcrypted in backend
    const createNewAccount = async () => {
        if (!validateUsername(userName)) {
            setValue('Username must be 5-15 characters long and it cant include spaces or special characters')
            return
        }
        if (!validatePassword(password)) {
            setValue('Valid passowrd must be 8-30 characters long and it must include at least one: small letter, capital letter, number, special character.')
            return
        }
        if (password === confirmPassword) {
            const body = {
                username: firstLetterToUpper(userName),
                passwordHash: encode(password)
            }
            try {
                const response = await fetch('https://spotmapback-4682c78c99fa.herokuapp.com/newuser', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                      },
                      method: "POST",
                      body: JSON.stringify(body)
                })
                const result = await response.text()
                if (await result === 'added') fetchToken()
                else setValue(result)
            } catch (error) {
                console.error(error)
            }
        } else {
            setValue("Passwords don't match")
        }
    }

    //Base 64 encodes password and username for API call
    const fetchToken = async () => {
        try {
            const response = await fetch('https://spotmapback-4682c78c99fa.herokuapp.com/api/token', {
                method: 'POST',
                headers: { Authorization: `Basic ${encode(firstLetterToUpper(userName) + ':' + password)}` }
            })
            const result = await response.text()
            if (await result.length > 0) saveTokenToStorage(await result)
            else setValue('Try again')
        } catch (error) {
            console.log(error)
        }
    }

    const changeForm = () => {
        setConfirmPassword('')
        setPassword('')
        setNewUser(!newUser)
    }
    
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>LOGIN</Text>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text>{value}</Text>
                </View>    
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', }}>
                    
                    <Text>Username</Text>
                    <TextInput style={{ width: 200, borderColor: 'black', borderWidth: 1 }} onChangeText={(e) => setUsername(e)}></TextInput>
                    <Text>Password</Text>
                    <TextInput style={{ width: 200, borderColor: 'black', borderWidth: 1 }} onChangeText={(e) => setPassword(e)} secureTextEntry={true} value={password}></TextInput>
                    {newUser
                        ?
                        <View>
                            <Text>Confirm Password</Text>
                            <TextInput style={{ width: 200, borderColor: 'black', borderWidth: 1 }} onChangeText={(e) => setConfirmPassword(e)} secureTextEntry={true} value={confirmPassword}></TextInput>
                            <Button title='Create new' onPress={() => createNewAccount()}></Button>
                        </View>
                        :
                        <View>
                            <Button title='Login' onPress={() => fetchToken()}></Button>
                        </View>
                    }
                    
                </View>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Button title={newUser? 'Login existing user' : 'Create new account'} onPress={() => changeForm()}></Button>
            </View>
        </View>
    )
}
