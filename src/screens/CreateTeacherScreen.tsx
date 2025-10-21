import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { TeacherForm, TeacherFormData } from '../components/teachers/TeacherForm';
import { useTeacher } from '../contexts/TeacherContext';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const CreateTeacherScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { email, isProfileComplete, checkProfileCompletion } = useAuth();
  const { saveTeacher } = useTeacher();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Route guard: redirect to profile if setup already complete
  useEffect(() => {
    if (isProfileComplete) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Profile' }],
      });
    }
  }, [isProfileComplete, navigation]);

  const handleCreateTeacher = async (data: TeacherFormData) => {
    if (!email) {
      Alert.alert('Error', 'You must be logged in to create a teacher profile.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newTeacher = {
        id: `teacher_${Date.now()}`, // Generate unique ID
        ...data,
        email, // Pre-fill from login
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveTeacher(newTeacher);
      await checkProfileCompletion(); // Update profile completion status

      Alert.alert('Success', 'Profile created successfully!');

      // Navigate to dashboard
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } catch (error: any) {
      console.error('Error creating teacher:', error);
      Alert.alert('Error', 'Failed to create teacher profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-900">
      <View className="p-6">
        <Text className="text-3xl font-bold text-white mb-2">Welcome!</Text>
        <Text className="text-lg text-gray-400 mb-8">
          Let's set up your teacher profile.
        </Text>
        <TeacherForm
          onSubmit={handleCreateTeacher}
          isSubmitting={isSubmitting}
          initialEmail={email || ''}
        />
      </View>
    </ScrollView>
  );
};
