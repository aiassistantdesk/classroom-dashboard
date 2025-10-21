import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { useTeacher } from '../contexts/TeacherContext';
import { TeacherForm, TeacherFormData } from '../components/teachers/TeacherForm';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { teacher, updateTeacherProfile } = useTeacher();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateProfile = async (data: TeacherFormData) => {
    setIsSubmitting(true);
    try {
      await updateTeacherProfile(data);
      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!teacher) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center">
        <Text className="text-gray-400">No profile data available</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="px-6 pt-12 pb-6 bg-gray-800">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mb-4"
        >
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-white mb-2">Edit Profile</Text>
        <Text className="text-lg text-gray-400">
          Update your teacher information
        </Text>
      </View>

      {/* Form */}
      <View className="p-6">
        <TeacherForm
          onSubmit={handleUpdateProfile}
          isSubmitting={isSubmitting}
          defaultValues={{
            name: teacher.name,
            email: teacher.email,
            subject: teacher.subject,
            schoolName: teacher.schoolName,
            classStandard: teacher.classStandard,
            division: teacher.division || '',
            academicYear: teacher.academicYear,
          }}
          initialEmail={teacher.email}
        />
      </View>
    </ScrollView>
  );
};
