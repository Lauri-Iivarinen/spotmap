import React, {useState, useEffect} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from './MapSreen';
import { User } from '../util/types';
import UserDetails from './UserDetails';

type MapScreenProps = {
  user: User;
  token: string
}

export default function NavigationStack(props: MapScreenProps){
    const Tab = createBottomTabNavigator();
  
    return (
        <Tab.Navigator initialRouteName='Map'>
          <Tab.Screen name="Map" component={MapScreen} initialParams={{user: props.user, token: props.token}}/>
          <Tab.Screen name="User" component={UserDetails} initialParams={{user: props.user, token: props.token}} />
        </Tab.Navigator>
      );
}