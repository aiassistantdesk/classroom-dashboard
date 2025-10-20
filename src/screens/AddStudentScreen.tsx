import React from 'react';
import { View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Header } from '../components/layout/Header';
import { useStudents } from '../contexts/StudentContext';
import { StudentForm } from '../components/students/StudentForm';
import { CreateStudentInput } from '../types/student';

type AddStudentNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddStudent'>;

export const AddStudentScreen: React.FC = () => {
  const navigation = useNavigation<AddStudentNavigationProp>();
  const { addStudent } = useStudents();

  const handleSubmit = async (data: CreateStudentInput) => {
    try {
      await addStudent(data);
      Alert.alert('Success', 'Student added successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add student');
      throw error;
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Header
        title="Add Student"
        showBack
        onBack={() => navigation.goBack()}
      />
      <View className="flex-1 p-4">
        <StudentForm mode="add" onSubmit={handleSubmit} onCancel={handleCancel} />
      </View>
    </View>
  );
};
