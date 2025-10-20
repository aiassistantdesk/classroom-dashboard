import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import { StudentDetailScreen } from '../screens/StudentDetailScreen';
import { AddStudentScreen } from '../screens/AddStudentScreen';
import { EditStudentScreen } from '../screens/EditStudentScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { useTeacher } from '../contexts/TeacherContext';
import { View, ActivityIndicator, Text } from 'react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, loading } = useTeacher();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600">Loading...</Text>
      </View>
    );
  }

  // Render different navigators based on auth state
  if (!isAuthenticated) {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="StudentDetail" component={StudentDetailScreen} />
      <Stack.Screen name="AddStudent" component={AddStudentScreen} />
      <Stack.Screen name="EditStudent" component={EditStudentScreen} />
    </Stack.Navigator>
  );
};
