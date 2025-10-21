import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { TeacherForm, TeacherFormData } from '../components/teachers/TeacherForm';
import { createTeacher } from '../services/firestore';
import { useTeacher } from '../contexts/TeacherContext';

export const CreateTeacherScreen: React.FC = () => {
  const { user } = useAuth();
  const { refreshTeacherData } = useTeacher();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateTeacher = async (data: TeacherFormData) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to create a teacher profile.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Add timeout to prevent hanging forever
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Firestore timeout - database may not be set up')), 10000)
      );

      const createPromise = createTeacher(user.uid, {
        ...data,
        email: user.email || '',
        photoUrl: user.photoURL || '',
        academicYear: '2024-2025', // Add a default academic year
      });

      await Promise.race([createPromise, timeoutPromise]);
      await refreshTeacherData(); // Refresh teacher data after creation
    } catch (error: any) {
      console.error('Error creating teacher:', error);

      if (error.message?.includes('timeout') || error.message?.includes('database')) {
        Alert.alert(
          'Firestore Not Set Up',
          'Please create Firestore database first:\n\n1. Go to Firebase Console\n2. Create Firestore Database\n3. Deploy Security Rules\n\nSee SETUP_CHECKLIST.md for details.'
        );
      } else {
        Alert.alert('Error', 'Failed to create teacher profile. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        <Text className="text-3xl font-bold text-gray-900 mb-2">Welcome!</Text>
        <Text className="text-lg text-gray-600 mb-8">Let's set up your teacher profile.</Text>
        <TeacherForm onSubmit={handleCreateTeacher} isSubmitting={isSubmitting} />
      </View>
    </ScrollView>
  );
};