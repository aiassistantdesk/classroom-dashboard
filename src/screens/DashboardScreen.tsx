import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStudents } from '../contexts/StudentContext';
import { useTeacher } from '../contexts/TeacherContext';
import { LoadingSpinner, ProfileMenu } from '../components/ui';
import { Users, UserPlus, GraduationCap } from 'lucide-react-native';

export const DashboardScreen: React.FC = () => {
  const { students, loading } = useStudents();
  const { currentSession } = useTeacher();
  const navigation = useNavigation();

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50">
        <LoadingSpinner fullScreen message="Loading dashboard..." />
      </View>
    );
  }

  // Calculate statistics
  const totalStudents = students.length;
  const maleStudents = students.filter((s) => s.gender === 'male').length;
  const femaleStudents = students.filter((s) => s.gender === 'female').length;
  const uniqueClasses = new Set(students.map((s) => s.classStandard)).size;

  // Sort students by created date (most recent first)
  const recentStudents = [...students].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 flex-row items-center justify-between border-b border-gray-200">
        <View className="flex-row items-center">
          <GraduationCap size={28} color="#3b82f6" />
          <View className="ml-3">
            <Text className="text-xl font-bold text-gray-900">EduClassroom</Text>
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
        {/* Dashboard Title */}
        <View className="px-6 py-6 flex-row items-center justify-between">
          <Text className="text-3xl font-bold text-gray-900">Dashboard</Text>
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => navigation.navigate('Students' as never)}
              className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg flex-row items-center mr-3"
            >
              <Users size={18} color="#374151" />
              <Text className="ml-2 text-sm font-medium text-gray-700">View All Students</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('AddStudent' as never)}
              className="px-4 py-2.5 bg-blue-600 rounded-lg flex-row items-center"
            >
              <UserPlus size={18} color="#fff" />
              <Text className="ml-2 text-sm font-semibold text-white">Add New Student</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Statistics Cards - Horizontal Grid */}
        <View className="px-6">
          <View className="flex-row mb-6">
            <View className="flex-1 bg-white p-6 rounded-2xl border border-gray-200 mr-3">
              <Text className="text-sm text-gray-500 mb-1">Total Students</Text>
              <Text className="text-4xl font-bold text-gray-900">{totalStudents}</Text>
            </View>
            <View className="flex-1 bg-white p-6 rounded-2xl border border-gray-200 mr-3">
              <Text className="text-sm text-gray-500 mb-1">Male Students</Text>
              <Text className="text-4xl font-bold text-gray-900">{maleStudents}</Text>
            </View>
            <View className="flex-1 bg-white p-6 rounded-2xl border border-gray-200">
              <Text className="text-sm text-gray-500 mb-1">Female Students</Text>
              <Text className="text-4xl font-bold text-gray-900">{femaleStudents}</Text>
            </View>
          </View>

          {/* Recently Added Students */}
          <Text className="text-2xl font-bold text-gray-900 mb-4">Recently Added Students</Text>

          {recentStudents.length > 0 ? (
            <View className="bg-white rounded-2xl p-8 border border-gray-200 mb-6">
              {recentStudents.map((student, index) => (
                <TouchableOpacity
                  key={student.id}
                  onPress={() => navigation.navigate('StudentDetail' as never, { studentId: student.id } as never)}
                  className={`flex-row items-center py-4 ${index !== recentStudents.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center">
                    <Text className="text-lg font-semibold text-blue-600">
                      {student.studentFullName.split(' ').map(n => n.charAt(0)).slice(0, 2).join('')}
                    </Text>
                  </View>
                  <View className="flex-1 ml-4">
                    <Text className="text-base font-semibold text-gray-900">
                      {student.studentFullName}
                    </Text>
                    <Text className="text-sm text-gray-500">Roll No. {student.rollNo}</Text>
                  </View>
                  <View className="flex-row">
                    <View className="px-3 py-1 bg-blue-50 rounded-full">
                      <Text className="text-xs font-medium text-blue-600">
                        Class {student.classStandard}{student.division}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View className="bg-white rounded-2xl p-12 border border-gray-200 items-center mb-6">
              <Image
                source={{ uri: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik04MCAzMEg0MEM0MCAzMCAzMCAzMCAzMCA0MFY4MEM0MCA5MCA0MCA5MCA1MCA5MEg4MEM5MCA5MCA5MCA5MCA5MCA4MFY0MEM5MCAzMCA4MCAzMCA4MCAzMFoiIGZpbGw9IiNFNUU3RUIiLz4KPC9zdmc+' }}
                style={{ width: 120, height: 120 }}
              />
              <Text className="text-xl font-semibold text-gray-900 mt-4">No students added yet</Text>
              <Text className="text-sm text-gray-500 mt-2 text-center">
                Your recently added students will appear here. Get started by adding a new student to your class list.
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('AddStudent' as never)}
                className="mt-6 px-6 py-3 bg-blue-600 rounded-lg flex-row items-center"
              >
                <UserPlus size={18} color="#fff" />
                <Text className="ml-2 text-sm font-semibold text-white">Add New Student</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
