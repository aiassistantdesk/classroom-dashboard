import React, { useState } from 'react';
import { View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useStudents } from '../contexts/StudentContext';
import { FilterOptions, FilterControls, SortControls } from '../components/students';
import { SearchBar, Modal, Button, LoadingSpinner, ProfileMenu } from '../components/ui';
import { UserPlus, AlertTriangle, GraduationCap, Edit2, Trash2, MoreVertical } from 'lucide-react-native';
import { useTeacher } from '../contexts/TeacherContext';
import { Student, StudentSortField, SortOrder } from '../types/student';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const StudentsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { currentSession } = useTeacher();
  const {
    filteredStudents,
    loading,
    setFilters,
    setSortOptions,
    sortOptions,
    filters,
    deleteStudent,
    refreshStudents,
    students,
  } = useStudents();

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Get unique classes and divisions for filters
  const availableClasses = Array.from(new Set(students.map((s) => s.classStandard))).sort();
  const availableDivisions = Array.from(new Set(students.map((s) => s.division))).sort();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters({ ...filters, searchQuery: query });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setFilters({ ...filters, searchQuery: '' });
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleSortChange = (field: StudentSortField, order: SortOrder) => {
    setSortOptions({ field, order });
  };

  const handleDeleteRequest = (student: Student) => {
    setStudentToDelete(student);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (studentToDelete) {
      try {
        await deleteStudent(studentToDelete.id);
        setDeleteModalVisible(false);
        setStudentToDelete(null);
      } catch (error) {
        console.error('Failed to delete student:', error);
      }
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshStudents();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50">
        <LoadingSpinner fullScreen message="Loading students..." />
      </View>
    );
  }

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
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.navigate('AddStudent')}
            className="px-4 py-2 bg-blue-600 rounded-lg flex-row items-center mr-4"
          >
            <UserPlus size={18} color="#fff" />
            <Text className="ml-2 text-sm font-semibold text-white">Add Student</Text>
          </TouchableOpacity>
          <ProfileMenu />
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-6">
          {/* Title */}
          <Text className="text-3xl font-bold text-gray-900 mb-6">Students</Text>

          {/* Search and Controls */}
          <View className="flex-row items-center mb-6">
            <View className="flex-1 mr-3">
              <SearchBar
                value={searchQuery}
                onChangeText={handleSearch}
                onClear={handleClearSearch}
                placeholder="Search students..."
              />
            </View>
            <View className="mr-3">
              <FilterControls
                onFilterChange={handleFilterChange}
                availableClasses={availableClasses}
                availableDivisions={availableDivisions}
              />
            </View>
            <SortControls
              onSortChange={handleSortChange}
              currentField={sortOptions.field}
              currentOrder={sortOptions.order}
            />
          </View>

          {/* Students Grid */}
          {filteredStudents.length > 0 ? (
            <View className="flex-row flex-wrap mb-6">
              {filteredStudents.map((student, idx) => (
                <View
                  key={student.id}
                  className="bg-white p-6 rounded-2xl border border-gray-200 mb-4"
                  style={{ width: '24%', marginRight: idx % 4 === 3 ? 0 : '1.33%' }}
                >
                  {/* Avatar */}
                  <View className="w-16 h-16 rounded-full bg-blue-500 items-center justify-center mb-4">
                    <Text className="text-2xl font-bold text-white">
                      {student.studentFullName.split(' ').map(n => n.charAt(0)).slice(0, 2).join('')}
                    </Text>
                  </View>

                  {/* Student Info */}
                  <Text className="text-lg font-bold text-gray-900 mb-1">
                    {student.studentFullName}
                  </Text>
                  <Text className="text-sm text-gray-500 mb-4">
                    Roll No. {student.rollNo}
                  </Text>

                  {/* Badges */}
                  <View className="flex-row flex-wrap mb-4">
                    <View className="px-2.5 py-1 bg-blue-50 rounded-full mr-2 mb-2">
                      <Text className="text-xs font-medium text-blue-600">
                        Class {student.classStandard}{student.division}
                      </Text>
                    </View>
                    <View className="px-2.5 py-1 bg-purple-50 rounded-full mr-2 mb-2">
                      <Text className="text-xs font-medium text-purple-600">
                        {student.gender === 'male' ? 'Male' : 'Female'}
                      </Text>
                    </View>
                    <View className="px-2.5 py-1 bg-green-50 rounded-full mb-2">
                      <Text className="text-xs font-medium text-green-600">
                        {student.casteCategory}
                      </Text>
                    </View>
                  </View>

                  {/* Actions */}
                  <View className="flex-row items-center">
                    <TouchableOpacity
                      onPress={() => navigation.navigate('EditStudent', { studentId: student.id })}
                      className="flex-1 flex-row items-center justify-center py-2 bg-gray-100 rounded-lg mr-2"
                    >
                      <Edit2 size={16} color="#4b5563" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteRequest(student)}
                      className="flex-1 flex-row items-center justify-center py-2 bg-gray-100 rounded-lg mr-2"
                    >
                      <Trash2 size={16} color="#4b5563" />
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 flex-row items-center justify-center py-2 bg-gray-100 rounded-lg">
                      <MoreVertical size={16} color="#4b5563" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="bg-white rounded-2xl p-12 border-2 border-dashed border-gray-300 items-center">
              <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
                <UserPlus size={32} color="#9ca3af" />
              </View>
              <Text className="text-xl font-semibold text-gray-900 mb-2">No Students Found</Text>
              <Text className="text-sm text-gray-500 text-center mb-6">
                Try adjusting your search or filter to find what you're looking for.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

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
          <Text className="text-center text-gray-900 text-base mb-2">
            Are you sure you want to delete {studentToDelete?.studentFullName}?
          </Text>
          <Text className="text-center text-gray-600 text-sm">
            This action cannot be undone.
          </Text>
        </View>
      </Modal>
    </View>
  );
};
