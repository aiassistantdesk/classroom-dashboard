import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import { StudentDetailScreen } from '../screens/StudentDetailScreen';
import { AddStudentScreen } from '../screens/AddStudentScreen';
import { EditStudentScreen } from '../screens/EditStudentScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { useAuth } from '../contexts/AuthContext';
import { useTeacher } from '../contexts/TeacherContext';
import { CreateTeacherScreen } from '../screens/CreateTeacherScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthenticatedNavigator = () => {
  const { teacher, loading } = useTeacher();

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600">Loading teacher profile...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {teacher ? (
        <>
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen name="StudentDetail" component={StudentDetailScreen} />
          <Stack.Screen name="AddStudent" component={AddStudentScreen} />
          <Stack.Screen name="EditStudent" component={EditStudentScreen} />
        </>
      ) : (
        <Stack.Screen name="CreateTeacher" component={CreateTeacherScreen} />
      )}
    </Stack.Navigator>
  );
};

export const RootNavigator: React.FC = () => {
  // Bypass authentication - go directly to the app
  // Firebase authentication disabled for now - using local storage

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="StudentDetail" component={StudentDetailScreen} />
      <Stack.Screen name="AddStudent" component={AddStudentScreen} />
      <Stack.Screen name="EditStudent" component={EditStudentScreen} />
    </Stack.Navigator>
  );
};
