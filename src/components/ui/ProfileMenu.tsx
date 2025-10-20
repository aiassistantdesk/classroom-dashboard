import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal as RNModal, ScrollView, Alert, Platform } from 'react-native';
import { useTeacher } from '../../contexts/TeacherContext';
import { User, LogOut, Calendar, BookOpen, School, Mail, Phone, ChevronDown, AlertTriangle } from 'lucide-react-native';
import { Select, SelectOption } from './Select';

export const ProfileMenu: React.FC = () => {
  const { currentSession, logout, changeAcademicYear } = useTeacher();
  const [menuVisible, setMenuVisible] = useState(false);
  const [yearModalVisible, setYearModalVisible] = useState(false);
  const [logoutConfirmVisible, setLogoutConfirmVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState(currentSession?.academicYear || '2024-2025');

  const teacher = currentSession?.teacher;

  if (!teacher) {
    return null;
  }

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      setLogoutConfirmVisible(true);
    } else {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: performLogout,
          },
        ]
      );
    }
  };

  const performLogout = async () => {
    try {
      await logout();
      setMenuVisible(false);
      setLogoutConfirmVisible(false);
    } catch (error) {
      if (Platform.OS === 'web') {
        alert('Failed to logout. Please try again.');
      } else {
        Alert.alert('Error', 'Failed to logout. Please try again.');
      }
    }
  };

  const handleYearChange = async () => {
    try {
      await changeAcademicYear(selectedYear);
      setYearModalVisible(false);
      setMenuVisible(false);
      Alert.alert('Success', `Academic year changed to ${selectedYear}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to change academic year');
    }
  };

  const academicYearOptions: SelectOption[] = [
    { label: '2023-2024', value: '2023-2024' },
    { label: '2024-2025', value: '2024-2025' },
    { label: '2025-2026', value: '2025-2026' },
    { label: '2026-2027', value: '2026-2027' },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <>
      {/* Profile Button */}
      <TouchableOpacity
        onPress={() => setMenuVisible(true)}
        className="flex-row items-center bg-gray-100 rounded-full px-3 py-2"
      >
        {teacher.photoUrl ? (
          <View className="w-10 h-10 rounded-full bg-blue-600 items-center justify-center">
            {/* TODO: Add Image component */}
            <Text className="text-white font-bold text-sm">{getInitials(teacher.name)}</Text>
          </View>
        ) : (
          <View className="w-10 h-10 rounded-full bg-blue-600 items-center justify-center">
            <Text className="text-white font-bold text-sm">{getInitials(teacher.name)}</Text>
          </View>
        )}
        <ChevronDown size={16} color="#6b7280" className="ml-2" />
      </TouchableOpacity>

      {/* Profile Menu Modal */}
      <RNModal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
          className="flex-1 bg-black/50 justify-start items-end pt-20 pr-6"
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View className="bg-white rounded-2xl shadow-2xl w-80">
              {/* Profile Header */}
              <View className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl">
                <View className="flex-row items-center mb-4">
                  <View className="w-16 h-16 rounded-full bg-white items-center justify-center">
                    <Text className="text-blue-600 font-bold text-xl">{getInitials(teacher.name)}</Text>
                  </View>
                  <View className="ml-4 flex-1">
                    <Text className="text-white font-bold text-xl">{teacher.name}</Text>
                    <Text className="text-blue-100 text-sm">{teacher.subject}</Text>
                  </View>
                </View>

                {/* Academic Year Badge */}
                <View className="bg-white/20 rounded-lg px-3 py-2 flex-row items-center">
                  <Calendar size={16} color="#fff" />
                  <Text className="text-white ml-2 font-semibold">
                    Academic Year: {currentSession?.academicYear}
                  </Text>
                </View>
              </View>

              {/* Profile Info */}
              <ScrollView className="p-6 max-h-96">
                {/* Class Info */}
                <View className="mb-4">
                  <View className="flex-row items-center mb-2">
                    <School size={18} color="#3b82f6" />
                    <Text className="ml-2 text-sm font-semibold text-gray-700">Class Teacher</Text>
                  </View>
                  <Text className="text-base text-gray-900 ml-7">
                    Class {teacher.classStandard}
                    {teacher.division ? ` - Division ${teacher.division}` : ''}
                  </Text>
                </View>

                {/* Subject */}
                <View className="mb-4">
                  <View className="flex-row items-center mb-2">
                    <BookOpen size={18} color="#3b82f6" />
                    <Text className="ml-2 text-sm font-semibold text-gray-700">Subject</Text>
                  </View>
                  <Text className="text-base text-gray-900 ml-7">{teacher.subject}</Text>
                </View>

                {/* Email */}
                <View className="mb-4">
                  <View className="flex-row items-center mb-2">
                    <Mail size={18} color="#3b82f6" />
                    <Text className="ml-2 text-sm font-semibold text-gray-700">Email</Text>
                  </View>
                  <Text className="text-base text-gray-900 ml-7">{teacher.email}</Text>
                </View>

                {/* Phone */}
                {teacher.phoneNumber && (
                  <View className="mb-4">
                    <View className="flex-row items-center mb-2">
                      <Phone size={18} color="#3b82f6" />
                      <Text className="ml-2 text-sm font-semibold text-gray-700">Phone</Text>
                    </View>
                    <Text className="text-base text-gray-900 ml-7">{teacher.phoneNumber}</Text>
                  </View>
                )}

                {/* Divider */}
                <View className="border-t border-gray-200 my-4" />

                {/* Change Academic Year Button */}
                <TouchableOpacity
                  onPress={() => {
                    setYearModalVisible(true);
                  }}
                  className="flex-row items-center justify-center bg-blue-50 rounded-xl py-3 mb-3"
                >
                  <Calendar size={20} color="#2563eb" />
                  <Text className="ml-2 text-blue-600 font-semibold">Change Academic Year</Text>
                </TouchableOpacity>

                {/* Logout Button */}
                <TouchableOpacity
                  onPress={handleLogout}
                  className="flex-row items-center justify-center bg-red-50 rounded-xl py-3"
                >
                  <LogOut size={20} color="#dc2626" />
                  <Text className="ml-2 text-red-600 font-semibold">Logout</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </RNModal>

      {/* Academic Year Change Modal */}
      <RNModal
        visible={yearModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setYearModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <Text className="text-2xl font-bold text-gray-900 mb-2">Change Academic Year</Text>
            <Text className="text-gray-600 mb-6">
              Select the academic year you want to view and manage
            </Text>

            <Select
              label="Academic Year"
              value={selectedYear}
              options={academicYearOptions}
              onChange={setSelectedYear}
            />

            <View className="flex-row space-x-3 mt-6">
              <TouchableOpacity
                onPress={() => setYearModalVisible(false)}
                className="flex-1 bg-gray-100 rounded-xl py-3"
              >
                <Text className="text-gray-700 text-center font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleYearChange}
                className="flex-1 bg-blue-600 rounded-xl py-3"
              >
                <Text className="text-white text-center font-semibold">Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </RNModal>

      {/* Logout Confirmation Modal (for Web) */}
      <RNModal
        visible={logoutConfirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutConfirmVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <View className="items-center mb-4">
              <View className="bg-red-100 rounded-full p-4 mb-4">
                <AlertTriangle size={32} color="#dc2626" />
              </View>
              <Text className="text-2xl font-bold text-gray-900 mb-2">Logout</Text>
              <Text className="text-gray-600 text-center">
                Are you sure you want to logout?
              </Text>
            </View>

            <View className="flex-row space-x-3 mt-4">
              <TouchableOpacity
                onPress={() => setLogoutConfirmVisible(false)}
                className="flex-1 bg-gray-100 rounded-xl py-3"
              >
                <Text className="text-gray-700 text-center font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={performLogout}
                className="flex-1 bg-red-600 rounded-xl py-3"
              >
                <Text className="text-white text-center font-semibold">Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </RNModal>
    </>
  );
};
