import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Modal, Button } from '../ui';
import { ArrowUpDown, Check } from 'lucide-react-native';
import { StudentSortField, SortOrder } from '../../types/student';

interface SortControlsProps {
  onSortChange: (field: StudentSortField, order: SortOrder) => void;
  currentField: StudentSortField;
  currentOrder: SortOrder;
}

interface SortOption {
  label: string;
  field: StudentSortField;
}

const sortOptions: SortOption[] = [
  { label: 'Name', field: 'studentFullName' },
  { label: 'Roll Number', field: 'rollNo' },
  { label: 'Age', field: 'age' },
  { label: 'Class', field: 'classStandard' },
];

export const SortControls: React.FC<SortControlsProps> = ({
  onSortChange,
  currentField,
  currentOrder,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedField, setSelectedField] = useState<StudentSortField>(currentField);
  const [selectedOrder, setSelectedOrder] = useState<SortOrder>(currentOrder);

  const handleApply = () => {
    onSortChange(selectedField, selectedOrder);
    setModalVisible(false);
  };

  const currentSortLabel =
    sortOptions.find((opt) => opt.field === currentField)?.label || 'Name';

  return (
    <>
      <TouchableOpacity
        className="flex-row items-center bg-white border border-gray-300 rounded-lg px-4 py-3"
        onPress={() => setModalVisible(true)}
      >
        <ArrowUpDown size={20} color="#6b7280" />
        <Text className="ml-2 text-gray-700 font-medium">
          {currentSortLabel} ({currentOrder === 'asc' ? 'A-Z' : 'Z-A'})
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Sort Students"
        size="md"
        footer={
          <Button variant="primary" fullWidth onPress={handleApply}>
            Apply Sort
          </Button>
        }
      >
        <View>
          <Text className="text-gray-700 font-semibold mb-3">Sort By</Text>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.field}
              className={`flex-row items-center justify-between p-3 rounded-lg mb-2 ${
                selectedField === option.field ? 'bg-blue-50' : 'bg-gray-50'
              }`}
              onPress={() => setSelectedField(option.field)}
            >
              <Text
                className={`text-base ${
                  selectedField === option.field
                    ? 'text-blue-600 font-semibold'
                    : 'text-gray-900'
                }`}
              >
                {option.label}
              </Text>
              {selectedField === option.field && <Check size={20} color="#2563eb" />}
            </TouchableOpacity>
          ))}

          <Text className="text-gray-700 font-semibold mb-3 mt-4">Order</Text>
          <View className="flex-row space-x-3">
            <TouchableOpacity
              className={`flex-1 p-3 rounded-lg ${
                selectedOrder === 'asc' ? 'bg-blue-50' : 'bg-gray-50'
              }`}
              onPress={() => setSelectedOrder('asc')}
            >
              <Text
                className={`text-center font-medium ${
                  selectedOrder === 'asc' ? 'text-blue-600' : 'text-gray-900'
                }`}
              >
                Ascending (A-Z)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 p-3 rounded-lg ${
                selectedOrder === 'desc' ? 'bg-blue-50' : 'bg-gray-50'
              }`}
              onPress={() => setSelectedOrder('desc')}
            >
              <Text
                className={`text-center font-medium ${
                  selectedOrder === 'desc' ? 'text-blue-600' : 'text-gray-900'
                }`}
              >
                Descending (Z-A)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};
