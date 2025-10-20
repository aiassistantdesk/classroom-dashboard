import React from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { Student } from '../../types/student';
import { StudentCard } from './StudentCard';
import { EmptyState } from '../ui';
import { Users } from 'lucide-react-native';

interface StudentListProps {
  students: Student[];
  onDelete: (student: Student) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export const StudentList: React.FC<StudentListProps> = ({
  students,
  onDelete,
  onRefresh,
  refreshing = false,
}) => {
  if (students.length === 0) {
    return (
      <EmptyState
        icon={<Users size={48} color="#9ca3af" />}
        title="No students found"
        description="Try adjusting your search or filters"
      />
    );
  }

  return (
    <FlatList
      data={students}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <StudentCard student={item} onDelete={onDelete} />}
      contentContainerStyle={{ paddingBottom: 16 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
    />
  );
};
