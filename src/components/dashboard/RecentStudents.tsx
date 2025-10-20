import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Student } from '../../types/student';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { ChevronRight } from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface RecentStudentsProps {
  students: Student[];
}

export const RecentStudents: React.FC<RecentStudentsProps> = ({ students }) => {
  const navigation = useNavigation<NavigationProp>();

  if (students.length === 0) {
    return null;
  }

  return (
    <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <Text className="text-lg font-bold text-gray-900 mb-4">Recent Students</Text>

      <View>
        {students.slice(0, 5).map((student, index) => (
          <TouchableOpacity
            key={student.id}
            className={`flex-row items-center py-3 ${
              index !== students.slice(0, 5).length - 1 ? 'border-b border-gray-100' : ''
            }`}
            onPress={() => navigation.navigate('StudentDetail', { studentId: student.id })}
          >
            <Avatar name={student.studentFullName} photoUrl={student.photoUrl} size="md" />

            <View className="flex-1 ml-3">
              <Text className="text-gray-900 font-semibold text-base" numberOfLines={1}>
                {student.studentFullName}
              </Text>
              <View className="flex-row items-center mt-1">
                <Text className="text-gray-600 text-sm">Roll No: {student.rollNo}</Text>
                <Text className="text-gray-400 mx-2">•</Text>
                <Text className="text-gray-600 text-sm">
                  Class {student.classStandard}-{student.division}
                </Text>
              </View>
            </View>

            <ChevronRight size={20} color="#9ca3af" />
          </TouchableOpacity>
        ))}
      </View>

      {students.length > 5 && (
        <TouchableOpacity
          className="mt-4 items-center py-2"
          onPress={() => navigation.navigate('MainTabs', { screen: 'Students' })}
        >
          <Text className="text-blue-600 font-semibold text-sm">
            View All {students.length} Students
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
