import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Header } from '../components/layout/Header';
import { useStudents } from '../contexts/StudentContext';
import { StudentProfile } from '../components/students/StudentProfile';
import { Button, Modal } from '../components/ui';
import { Edit, Trash2, AlertTriangle } from 'lucide-react-native';

type StudentDetailRouteProp = RouteProp<RootStackParamList, 'StudentDetail'>;
type StudentDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'StudentDetail'>;

export const StudentDetailScreen: React.FC = () => {
  const route = useRoute<StudentDetailRouteProp>();
  const navigation = useNavigation<StudentDetailNavigationProp>();
  const { studentId } = route.params;
  const { getStudentById, deleteStudent } = useStudents();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const student = getStudentById(studentId);

  const handleEdit = () => {
    navigation.navigate('EditStudent', { studentId });
  };

  const handleDeleteRequest = () => {
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteStudent(studentId);
      setDeleteModalVisible(false);
      Alert.alert('Success', 'Student deleted successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to delete student');
      console.error(error);
    }
  };

  if (!student) {
    return (
      <View className="flex-1 bg-gray-50">
        <Header
          title="Student Details"
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
        title="Student Details"
        showBack
        onBack={() => navigation.goBack()}
        rightAction={
          <View className="flex-row">
            <TouchableOpacity
              onPress={handleEdit}
              className="p-2 mr-2 rounded-lg active:bg-blue-50"
            >
              <Edit size={24} color="#2563eb" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDeleteRequest}
              className="p-2 rounded-lg active:bg-red-50"
            >
              <Trash2 size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>
        }
      />

      <View className="flex-1 p-4">
        <StudentProfile student={student} />
      </View>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        title="Delete Student"
        size="sm"
        footer={
          <View className="flex-row space-x-3">
            <View className="flex-1">
              <Button
                variant="outline"
                fullWidth
                onPress={() => setDeleteModalVisible(false)}
              >
                Cancel
              </Button>
            </View>
            <View className="flex-1">
              <Button variant="danger" fullWidth onPress={handleConfirmDelete}>
                Delete
              </Button>
            </View>
          </View>
        }
      >
        <View className="items-center py-4">
          <View className="bg-red-100 rounded-full p-4 mb-4">
            <AlertTriangle size={32} color="#ef4444" />
          </View>
          <Text className="text-gray-900 text-base mb-2 text-center">
            Are you sure you want to delete{' '}
            <Text className="font-bold">{student.studentFullName}</Text>?
          </Text>
          <Text className="text-gray-600 text-sm text-center">
            This action cannot be undone.
          </Text>
        </View>
      </Modal>
    </View>
  );
};
