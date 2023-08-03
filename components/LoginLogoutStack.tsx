import React,{useState, useEffect} from "react";
import { View, Text } from "react-native";
import Login from "./Login";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from "../util/types";
import NavigationStack from "./NavigationStack";
import { Snackbar } from "@react-native-material/core";


//Stack checks if user is logged in or not and displays correct stack accordingly
export default function LoginLogoutStack() {

    const [loggedIn, setLoggedIn] = useState(false)
    const [fetching, setFetching] = useState(true) //For custom display to show everything only after things are loaded/fetched
    const [userData, setUserData] = useState<User>()
    const [token, setToken] = useState<string>('')
    

    //Fetch userdata with token if it exists, at the same time checks if login session has expired
    const fetchUserDataAndLogin = async (token: string) => {
        setToken(token)
        try {
            const response = await fetch("https://spotmapback-4682c78c99fa.herokuapp.com/api/user", {
            headers: {Authorization: `Bearer ${token}`}
            })
            const result: User = await response.json()
            setUserData(await result)
            setLoggedIn(true)
            setFetching(false)
            
        } catch (error) {
            console.log(error)
            setFetching(false)
        }
    }

    //fetch token from local storage if exists
    const storageFetchUserDetails = async () => {
        const userToken = await AsyncStorage.getItem("token")
        if (await userToken === null) {
            setFetching(false)
        }
        else {
            //setFetching(false)
            fetchUserDataAndLogin(userToken!)
        }
    }

    useEffect(() => {
        storageFetchUserDetails()
    }, [])

    


    if (fetching) {
        return(
            <View style={{flex: 1, justifyContent: "center", alignItems: "center", flexDirection: 'row'}}>
                <Text>Fetching...</Text>
            </View>
        )
    } else {
        return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center", flexDirection: 'row'}}>
                {loggedIn ? <NavigationStack user={userData!} token={token}></NavigationStack> : <Login fetchUserData={fetchUserDataAndLogin}></Login>}
                
            </View>
        )
    }
}