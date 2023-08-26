import React, {useState, useEffect} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from './MapSreen';
import { User } from '../util/types';
import UserDetails from './UserDetails';
import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';

type MapScreenProps = {
  user: User;
  token: string
}

export default function NavigationStack(props: MapScreenProps){
    const Tab = createBottomTabNavigator();
  
  
  const header = <View><Icon name="flame"></Icon></View>
  
  return (
    <SafeAreaProvider>
        <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color }) => {
            let iconName;

            if (route.name === 'Map') {
              iconName = 'map'
            } else if (route.name === 'User') {
              iconName = 'person'
            } else {
              iconName = 'help'
            }
            return <Icon name={iconName} color={color}/>;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
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
          name="User"
          component={UserDetails}
          initialParams={{
            user: props.user,
            token: props.token
          }}
        />
        </Tab.Navigator>
        </SafeAreaProvider>
      );
}