import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import { StudentDetailScreen } from '../screens/StudentDetailScreen';
import { AddStudentScreen } from '../screens/AddStudentScreen';
import { EditStudentScreen } from '../screens/EditStudentScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { CreateAccountScreen } from '../screens/CreateAccountScreen';
import { CreateTeacherScreen } from '../screens/CreateTeacherScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { useAuth } from '../contexts/AuthContext';
import { useTeacher } from '../contexts/TeacherContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading, isProfileComplete } = useAuth();
  const { loading: teacherLoading } = useTeacher();

  // Show loading screen while checking auth status
  if (authLoading || (isAuthenticated && teacherLoading)) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-400">Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        // Not logged in - show login and create account screens
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        </>
      ) : !isProfileComplete ? (
        // Logged in but no profile - show teacher setup
        <Stack.Screen name="CreateTeacher" component={CreateTeacherScreen} />
      ) : (
        // Logged in with complete profile - show app
        <>
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen name="StudentDetail" component={StudentDetailScreen} />
          <Stack.Screen name="AddStudent" component={AddStudentScreen} />
          <Stack.Screen name="EditStudent" component={EditStudentScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
