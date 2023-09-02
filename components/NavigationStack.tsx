import React, {useState, useEffect} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from './MapSreen';
import { User } from '../util/types';
import UserDetails from './UserDetails';
import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Header, Text } from '@rneui/themed';

type MapScreenProps = {
  user: User;
  token: string;
  logout: () => void;
}

export default function NavigationStack(props: MapScreenProps){
    const Tab = createBottomTabNavigator();
  
  return (
    <SafeAreaProvider>
       <Header
        ViewComponent={LinearGradient} // Don't forget this!
        linearGradientProps={{
          colors: ['white', 'rgb(180,180,250)'],
          start: { x: 0, y: 1 },
          end: { x: 0, y: 0 },
        }}
        leftComponent={<View style={{flexDirection: 'row', alignItems: 'center'}}><Icon name="person"></Icon><Text style={{marginLeft: 5}}>{ props.user.username}</Text></View>}
        centerComponent={<View></View>}
        rightComponent={<Icon name="log-out" size={24} onPress={props.logout}></Icon>}
      />
        <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color }) => {
            let iconName;

            if (route.name === 'Map') {
              iconName = 'map'
            } else if (route.name === 'My spots') {
              iconName = 'person'
            } else {
              iconName = 'help'
            }
            return <Icon name={iconName} color={color} size={20}/>;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
        initialRouteName='Map'>
          <Tab.Screen
            name="Map"
            component={MapScreen}
            initialParams={{
              user: props.user,
              token: props.token
            }}
            />
        <Tab.Screen
          name="My spots"
          component={UserDetails}
          initialParams={{
            user: props.user,
            token: props.token,
          }}
        />
        </Tab.Navigator>
        </SafeAreaProvider>
      );
}