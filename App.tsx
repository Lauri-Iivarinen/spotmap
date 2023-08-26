import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginLogoutStack from './components/LoginLogoutStack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <NavigationContainer>
          <LoginLogoutStack></LoginLogoutStack>
      </NavigationContainer>
    </SafeAreaView>
  );
}

