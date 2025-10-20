import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Alert, Platform, Share } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { useStudents } from '../contexts/StudentContext';
import { useTeacher } from '../contexts/TeacherContext';
import { Button, Modal, ProfileMenu } from '../components/ui';
import {
  Trash2,
  Download,
  Upload,
  AlertTriangle,
  Info,
  Database,
  FolderOpen,
  PlusCircle
} from 'lucide-react-native';
import { exportStudentsToJSON, importStudentsFromJSON } from '../utils/storage';
import { generateId, calculateAge } from '../utils/helpers';
import { Student } from '../types/student';
import { faker } from '@faker-js/faker';

export const SettingsScreen: React.FC = () => {
  const { students, clearAllData, refreshStudents, addStudent } = useStudents();
  const { currentSession } = useTeacher();
  const [clearModalVisible, setClearModalVisible] = useState(false);

  const handleClearData = async () => {
    try {
      await clearAllData();
      setClearModalVisible(false);
      Alert.alert('Success', 'All data cleared successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to clear data');
      console.error(error);
    }
  };

  const handleExportData = async () => {
    try {
      const jsonData = await exportStudentsToJSON();

      if (Platform.OS === 'web') {
        // For web: Download as file
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `students-export-${new Date().getTime()}.json`;
        link.click();
        URL.revokeObjectURL(url);
        Alert.alert('Success', 'Students exported successfully');
      } else {
        // For mobile: Share
        await Share.share({
          message: jsonData,
          title: 'Students Export',
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
      console.error(error);
    }
  };

  const handleImportData = async () => {
    try {
      if (Platform.OS === 'web') {
        Alert.alert('Info', 'Import is available on mobile devices');
        return;
      }

      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
      });

      if (result.canceled) {
        return;
      }

      const fileUri = result.assets[0].uri;
      const content = await FileSystem.readAsStringAsync(fileUri);
      await importStudentsFromJSON(content);
      await refreshStudents();
      Alert.alert('Success', 'Students imported successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to import data: ' + (error as Error).message);
      console.error(error);
    }
  };

  const generateSampleData = async () => {
    try {
      const sampleStudents: Student[] = [];
      for (let i = 0; i < 10; i++) {
        const birthDate = faker.date.between({ from: '2010-01-01', to: '2012-12-31' }).toISOString().split('T')[0];
        const student: Student = {
          id: generateId(),
          rollNo: faker.string.numeric(3),
          registerName: faker.person.fullName(),
          studentFullName: faker.person.fullName(),
          classStandard: faker.helpers.arrayElement(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']),
          division: faker.helpers.arrayElement(['A', 'B', 'C']),
          saralId: `SR${faker.string.numeric(9)}`,
          aparId: `AP${faker.string.numeric(9)}`,
          penNo: `PEN${faker.string.numeric(9)}`,
          aadhaarNo: faker.string.numeric(12),
          studentWeight: faker.number.int({ min: 30, max: 60 }).toString(),
          studentHeight: faker.number.int({ min: 130, max: 160 }).toString(),
          gender: faker.helpers.arrayElement(['male', 'female']),
          birthDate: birthDate,
          age: calculateAge(birthDate),
          bloodGroup: faker.helpers.arrayElement(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
          studentFatherName: faker.person.fullName({ sex: 'male' }),
          studentMotherName: faker.person.fullName({ sex: 'female' }),
          fatherMobileNo: faker.phone.number('##########'),
          motherMobileNo: faker.phone.number('##########'),
          motherTongue: faker.helpers.arrayElement(['English', 'Hindi', 'Marathi', 'Gujarati', 'Tamil']),
          religion: faker.helpers.arrayElement(['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist']),
          caste: faker.helpers.arrayElement(['General', 'OBC', 'SC', 'ST']),
          casteCategory: faker.helpers.arrayElement(['General', 'OBC', 'SC', 'ST']),
          fullAddress: faker.location.streetAddress(true),
          studentBankAccountNo: faker.finance.accountNumber(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        sampleStudents.push(student);
      }

      for (const student of sampleStudents) {
        await addStudent(student);
      }

      Alert.alert('Success', `Added ${sampleStudents.length} sample students`);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate sample data');
      console.error(error);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 flex-row items-center justify-between border-b border-gray-200">
        <View className="flex-row items-center">
          <FolderOpen size={28} color="#3b82f6" />
          <View className="ml-3">
            <Text className="text-xl font-bold text-gray-900">Classroom Manager</Text>
            {currentSession && (
              <Text className="text-xs text-gray-500">
                Class {currentSession.teacher.classStandard}{currentSession.teacher.division ? `-${currentSession.teacher.division}` : ''} • {currentSession.academicYear}
              </Text>
            )}
          </View>
        </View>
        <ProfileMenu />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-6">
          {/* Title */}
          <Text className="text-3xl font-bold text-gray-900 mb-2">Settings</Text>
          <Text className="text-base text-gray-500 mb-8">
            Manage app configuration, data, and utilities.
          </Text>

          {/* Two Column Layout */}
          <View className="flex-row mb-6">
            {/* Left Column */}
            <View className="flex-1 mr-6">
              {/* App Information - Blue */}
              <View className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mb-6">
                <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-4">
                  <Info size={24} color="#3b82f6" />
                </View>
                <Text className="text-xl font-bold text-blue-900 mb-4">App Information</Text>
                <View className="mb-3">
                  <Text className="text-base font-semibold text-blue-900 mb-1">Version 1.2.3</Text>
                  <Text className="text-sm text-blue-600">Current app version</Text>
                </View>
              </View>

              {/* Data Statistics - Green */}
              <View className="bg-green-50 p-6 rounded-2xl border border-green-100">
                <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mb-4">
                  <Database size={24} color="#10b981" />
                </View>
                <Text className="text-xl font-bold text-green-900 mb-4">Data Statistics</Text>
                <View>
                  <Text className="text-3xl font-bold text-green-900 mb-1">{students.length} Students</Text>
                  <Text className="text-sm text-green-600">Total number of students</Text>
                </View>
              </View>
            </View>

            {/* Right Column */}
            <View className="flex-1">
              {/* Data Management - Orange */}
              <View className="bg-orange-50 p-6 rounded-2xl border border-orange-100 mb-6">
                <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center mb-4">
                  <Database size={24} color="#f97316" />
                </View>
                <Text className="text-xl font-bold text-orange-900 mb-4">Data Management</Text>

                <TouchableOpacity
                  onPress={handleExportData}
                  className="bg-white py-3 px-4 rounded-xl border border-orange-200 flex-row items-center mb-3"
                >
                  <Download size={20} color="#f97316" />
                  <Text className="ml-3 text-base font-semibold text-orange-900">Export Students Data (JSON)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleImportData}
                  className="bg-white py-3 px-4 rounded-xl border border-orange-200 flex-row items-center mb-3"
                >
                  <Upload size={20} color="#f97316" />
                  <Text className="ml-3 text-base font-semibold text-orange-900">Import Students Data (JSON)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={generateSampleData}
                  className="bg-white py-3 px-4 rounded-xl border border-orange-200 flex-row items-center"
                >
                  <PlusCircle size={20} color="#f97316" />
                  <Text className="ml-3 text-base font-semibold text-orange-900">Generate Sample Data</Text>
                </TouchableOpacity>
              </View>

              {/* Danger Zone - Red */}
              <View className="bg-red-50 p-6 rounded-2xl border border-red-200">
                <View className="w-12 h-12 bg-red-100 rounded-full items-center justify-center mb-4">
                  <AlertTriangle size={24} color="#ef4444" />
                </View>
                <Text className="text-xl font-bold text-red-900 mb-4">Danger Zone</Text>

                <TouchableOpacity
                  onPress={() => setClearModalVisible(true)}
                  className="bg-red-600 py-3.5 px-4 rounded-xl flex-row items-center justify-center"
                >
                  <Trash2 size={20} color="#fff" />
                  <Text className="ml-3 text-base font-bold text-white">Clear All Data</Text>
                </TouchableOpacity>
                <Text className="text-sm text-red-600 mt-3 text-center">
                  This action is irreversible.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Clear Data Confirmation Modal */}
      <Modal
        visible={clearModalVisible}
        onClose={() => setClearModalVisible(false)}
        title="Clear All Data"
        size="sm"
        footer={
          <View className="flex-row space-x-3">
            <View className="flex-1">
              <Button
                variant="outline"
                fullWidth
                onPress={() => setClearModalVisible(false)}
              >
                Cancel
              </Button>
            </View>
            <View className="flex-1">
              <Button variant="danger" fullWidth onPress={handleClearData}>
                Clear All
              </Button>
            </View>
          </View>
        }
      >
        <View className="items-center py-4">
          <View className="bg-red-100 rounded-full p-4 mb-4">
            <AlertTriangle size={32} color="#ef4444" />
          </View>
          <Text className="text-gray-900 text-base mb-2 text-center font-bold">
            Are you sure?
          </Text>
          <Text className="text-gray-600 text-sm text-center mb-2">
            This will permanently delete all {students.length} student(s) from the database.
          </Text>
          <Text className="text-red-600 text-sm text-center font-semibold">
            This action cannot be undone!
          </Text>
        </View>
      </Modal>
    </View>
  );
};
