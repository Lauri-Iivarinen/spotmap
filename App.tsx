import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginLogoutStack from './components/LoginLogoutStack';

export default function App() {
  return (
    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      <LoginLogoutStack></LoginLogoutStack>
    </View>
  );
}

