import './global.css';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TeacherProvider } from './src/contexts/TeacherContext';
import { StudentProvider } from './src/contexts/StudentContext';
import { RootNavigator } from './src/navigation/RootNavigator';

const linking = {
  prefixes: ['http://localhost:8081'],
  config: {
    screens: {
      Login: {
        path: 'login',
      },
      MainTabs: {
        screens: {
          Dashboard: {
            path: 'dashboard',
          },
          Students: {
            path: 'student-list',
          },
          Settings: {
            path: 'settings',
          },
        },
      },
    },
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <TeacherProvider>
        <StudentProvider>
          <NavigationContainer linking={linking}>
            <RootNavigator />
            <StatusBar style="auto" />
          </NavigationContainer>
        </StudentProvider>
      </TeacherProvider>
    </SafeAreaProvider>
  );
}
