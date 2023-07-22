import React from "react";
import { View, Text } from "react-native";
import { User } from "../util/types";

type HomepageProps = {
    user: User;
}

//Home screen for logged in users
export default function Homepage(props: HomepageProps) {
    
    return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <Text>Welcome</Text>
            <Text>{props.user.username}</Text>
        </View>
    )
}