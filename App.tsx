import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginLogoutStack from './components/LoginLogoutStack';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaView style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      <LoginLogoutStack></LoginLogoutStack>
    </SafeAreaView>
  );
}

