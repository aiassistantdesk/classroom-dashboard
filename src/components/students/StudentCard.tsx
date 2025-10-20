import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Student } from '../../types/student';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { ChevronRight, Edit, Trash2 } from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface StudentCardProps {
  student: Student;
  onDelete?: (student: Student) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({ student, onDelete }) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    navigation.navigate('StudentDetail', { studentId: student.id });
  };

  const handleEdit = (e: any) => {
    e.stopPropagation();
    navigation.navigate('EditStudent', { studentId: student.id });
  };

  const handleDelete = (e: any) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(student);
    }
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100 active:bg-gray-50"
      onPress={handlePress}
    >
      <View className="flex-row items-center">
        {/* Avatar */}
        <Avatar
          name={student.studentFullName}
          photoUrl={student.photoUrl}
          size="lg"
        />

        {/* Student Info */}
        <View className="flex-1 ml-4">
          <Text className="text-gray-900 font-bold text-lg" numberOfLines={1}>
            {student.studentFullName}
          </Text>

          <View className="flex-row items-center mt-1">
            <Text className="text-gray-600 text-sm">Roll No: {student.rollNo}</Text>
            <Text className="text-gray-400 mx-2">•</Text>
            <Text className="text-gray-600 text-sm">
              Class {student.classStandard}-{student.division}
            </Text>
          </View>

          <View className="flex-row items-center mt-2 flex-wrap">
            <Badge variant="primary" className="mr-2">
              {student.gender}
            </Badge>
            <Badge variant="info">
              {student.casteCategory}
            </Badge>
          </View>
        </View>

        {/* Action Icons */}
        <View className="flex-row items-center ml-2">
          <TouchableOpacity
            className="p-2 rounded-lg active:bg-blue-50"
            onPress={handleEdit}
          >
            <Edit size={20} color="#2563eb" />
          </TouchableOpacity>

          <TouchableOpacity
            className="p-2 rounded-lg active:bg-red-50 ml-1"
            onPress={handleDelete}
          >
            <Trash2 size={20} color="#ef4444" />
          </TouchableOpacity>

          <ChevronRight size={20} color="#9ca3af" className="ml-1" />
        </View>
      </View>
    </TouchableOpacity>
  );
};
