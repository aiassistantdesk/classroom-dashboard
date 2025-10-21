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
  const { isAuthenticated, isLoading, error } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600">Loading...</Text>
      </View>
    );
  }

  // Show Firebase setup error if present
  if (error && error.includes('Firebase')) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center px-6">
        <View className="bg-yellow-50 p-6 rounded-2xl border border-yellow-200 max-w-md">
          <Text className="text-2xl font-bold text-yellow-900 mb-4 text-center">
            Firebase Setup Required
          </Text>
          <Text className="text-yellow-800 mb-4 text-center">
            The app needs Firebase to be configured. Please follow the setup guide:
          </Text>
          <Text className="text-yellow-700 text-sm text-center">
            1. Enable Google Authentication in Firebase Console{'\n'}
            2. Create Firestore Database{'\n'}
            3. Deploy Security Rules{'\n\n'}
            See SETUP_CHECKLIST.md for details.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Authenticated" component={AuthenticatedNavigator} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};
