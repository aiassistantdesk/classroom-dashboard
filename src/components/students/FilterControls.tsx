import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Modal, Select, SelectOption, Button } from '../ui';
import { Filter, X } from 'lucide-react-native';
import { Gender, CasteCategory, BloodGroup } from '../../types/student';

interface FilterControlsProps {
  onFilterChange: (filters: FilterOptions) => void;
  availableClasses: string[];
  availableDivisions: string[];
}

export interface FilterOptions {
  classStandard?: string;
  division?: string;
  gender?: Gender;
  casteCategory?: CasteCategory;
  bloodGroup?: BloodGroup;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  onFilterChange,
  availableClasses,
  availableDivisions,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});

  const classOptions: SelectOption[] = [
    { label: 'All Classes', value: '' },
    ...availableClasses.map((c) => ({ label: `Class ${c}`, value: c })),
  ];

  const divisionOptions: SelectOption[] = [
    { label: 'All Divisions', value: '' },
    ...availableDivisions.map((d) => ({ label: `Division ${d}`, value: d })),
  ];

  const genderOptions: SelectOption[] = [
    { label: 'All Genders', value: '' },
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];

  const categoryOptions: SelectOption[] = [
    { label: 'All Categories', value: '' },
    { label: 'General', value: 'General' },
    { label: 'OBC', value: 'OBC' },
    { label: 'SC', value: 'SC' },
    { label: 'ST', value: 'ST' },
    { label: 'EWS', value: 'EWS' },
    { label: 'Other', value: 'Other' },
  ];

  const bloodGroupOptions: SelectOption[] = [
    { label: 'All Blood Groups', value: '' },
    { label: 'A+', value: 'A+' },
    { label: 'A-', value: 'A-' },
    { label: 'B+', value: 'B+' },
    { label: 'B-', value: 'B-' },
    { label: 'AB+', value: 'AB+' },
    { label: 'AB-', value: 'AB-' },
    { label: 'O+', value: 'O+' },
    { label: 'O-', value: 'O-' },
  ];

  const handleApply = () => {
    // Remove empty filters
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    );
    onFilterChange(activeFilters as FilterOptions);
    setModalVisible(false);
  };

  const handleClear = () => {
    setFilters({});
    onFilterChange({});
    setModalVisible(false);
  };

  const activeFilterCount = Object.values(filters).filter((v) => v !== '').length;

  return (
    <>
      <TouchableOpacity
        className="flex-row items-center bg-white border border-gray-300 rounded-lg px-4 py-3"
        onPress={() => setModalVisible(true)}
      >
        <Filter size={20} color="#6b7280" />
        <Text className="ml-2 text-gray-700 font-medium">
          Filters
          {activeFilterCount > 0 && ` (${activeFilterCount})`}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Filter Students"
        size="lg"
        footer={
          <View className="flex-row space-x-3">
            <View className="flex-1">
              <Button variant="outline" fullWidth onPress={handleClear}>
                Clear All
              </Button>
            </View>
            <View className="flex-1">
              <Button variant="primary" fullWidth onPress={handleApply}>
                Apply Filters
              </Button>
            </View>
          </View>
        }
      >
        <View>
          <Select
            label="Class"
            value={filters.classStandard || ''}
            options={classOptions}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, classStandard: value || undefined }))
            }
          />

          <Select
            label="Division"
            value={filters.division || ''}
            options={divisionOptions}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, division: value || undefined }))
            }
          />

          <Select
            label="Gender"
            value={filters.gender || ''}
            options={genderOptions}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, gender: (value || undefined) as Gender }))
            }
          />

          <Select
            label="Caste Category"
            value={filters.casteCategory || ''}
            options={categoryOptions}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                casteCategory: (value || undefined) as CasteCategory,
              }))
            }
          />

          <Select
            label="Blood Group"
            value={filters.bloodGroup || ''}
            options={bloodGroupOptions}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                bloodGroup: (value || undefined) as BloodGroup,
              }))
            }
          />
        </View>
      </Modal>
    </>
  );
};
