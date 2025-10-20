import React from 'react';
import { View, Alert, Text } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Header } from '../components/layout/Header';
import { useStudents } from '../contexts/StudentContext';
import { StudentForm } from '../components/students/StudentForm';
import { LoadingSpinner } from '../components/ui';
import { CreateStudentInput } from '../types/student';

type EditStudentRouteProp = RouteProp<RootStackParamList, 'EditStudent'>;
type EditStudentNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditStudent'>;

export const EditStudentScreen: React.FC = () => {
  const route = useRoute<EditStudentRouteProp>();
  const navigation = useNavigation<EditStudentNavigationProp>();
  const { studentId } = route.params;
  const { getStudentById, updateStudent } = useStudents();

  const student = getStudentById(studentId);

  const handleSubmit = async (data: CreateStudentInput) => {
    try {
      await updateStudent({ ...data, id: studentId });
      Alert.alert('Success', 'Student updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update student');
      throw error;
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  if (!student) {
    return (
      <View className="flex-1 bg-gray-50">
        <Header
          title="Edit Student"
          showBack
          onBack={() => navigation.goBack()}
        />
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-600 text-base">Student not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Header
        title="Edit Student"
        showBack
        onBack={() => navigation.goBack()}
      />
      <View className="flex-1 p-4">
        <StudentForm
          mode="edit"
          initialData={student}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </View>
    </View>
  );
};
