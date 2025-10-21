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
      await createTeacher(user.uid, {
        ...data,
        email: user.email || '',
        photoUrl: user.photoURL || '',
        academicYear: '2024-2025', // Add a default academic year
      });
      await refreshTeacherData(); // Refresh teacher data after creation
    } catch (error) {
      console.error('Error creating teacher:', error);
      Alert.alert('Error', 'Failed to create teacher profile. Please try again.');
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