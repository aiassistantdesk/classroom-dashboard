import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { X, User, Mail, BookOpen, School, GraduationCap, Calendar, Edit } from 'lucide-react-native';
import { Teacher } from '../../types/teacher';

interface ProfileInfoModalProps {
  visible: boolean;
  teacher: Teacher;
  onClose: () => void;
  onEditProfile: () => void;
  onLogout: () => void;
}

export const ProfileInfoModal: React.FC<ProfileInfoModalProps> = ({
  visible,
  teacher,
  onClose,
  onEditProfile,
  onLogout,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-gray-800 rounded-2xl w-full max-w-md overflow-hidden">
          {/* Header */}
          <View className="bg-blue-600 p-6 flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-white">Profile</Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <X size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Profile Info */}
          <View className="p-6 space-y-4">
            {/* Name */}
            <View className="flex-row items-center">
              <View className="bg-gray-700 p-3 rounded-full mr-4">
                <User size={20} color="#60A5FA" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-400 text-xs">Full Name</Text>
                <Text className="text-white text-base font-semibold">
                  {teacher.name}
                </Text>
              </View>
            </View>

            {/* Email */}
            <View className="flex-row items-center">
              <View className="bg-gray-700 p-3 rounded-full mr-4">
                <Mail size={20} color="#60A5FA" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-400 text-xs">Email</Text>
                <Text className="text-white text-base font-semibold">
                  {teacher.email}
                </Text>
              </View>
            </View>

            {/* Subject */}
            <View className="flex-row items-center">
              <View className="bg-gray-700 p-3 rounded-full mr-4">
                <BookOpen size={20} color="#60A5FA" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-400 text-xs">Subject</Text>
                <Text className="text-white text-base font-semibold">
                  {teacher.subject}
                </Text>
              </View>
            </View>

            {/* School */}
            <View className="flex-row items-center">
              <View className="bg-gray-700 p-3 rounded-full mr-4">
                <School size={20} color="#60A5FA" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-400 text-xs">School</Text>
                <Text className="text-white text-base font-semibold">
                  {teacher.schoolName}
                </Text>
              </View>
            </View>

            {/* Class & Division */}
            <View className="flex-row items-center">
              <View className="bg-gray-700 p-3 rounded-full mr-4">
                <GraduationCap size={20} color="#60A5FA" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-400 text-xs">Class Teacher Of</Text>
                <Text className="text-white text-base font-semibold">
                  Class {teacher.classStandard}
                  {teacher.division ? ` - ${teacher.division}` : ''}
                </Text>
              </View>
            </View>

            {/* Academic Year */}
            <View className="flex-row items-center">
              <View className="bg-gray-700 p-3 rounded-full mr-4">
                <Calendar size={20} color="#60A5FA" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-400 text-xs">Academic Year</Text>
                <Text className="text-white text-base font-semibold">
                  {teacher.academicYear}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="p-6 pt-0 space-y-3">
            <TouchableOpacity
              onPress={onEditProfile}
              className="bg-blue-600 py-4 rounded-xl flex-row items-center justify-center"
            >
              <Edit size={20} color="#fff" />
              <Text className="ml-2 text-white font-bold text-base">
                Edit Profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onLogout}
              className="bg-red-600 py-4 rounded-xl flex-row items-center justify-center"
            >
              <Text className="text-white font-bold text-base">
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
