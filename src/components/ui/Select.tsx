import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Platform,
} from 'react-native';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  containerClassName?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select an option',
  error,
  required,
  disabled = false,
  containerClassName = '',
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setModalVisible(false);
  };

  return (
    <View className={`mb-4 ${containerClassName}`}>
      {label && (
        <Text className="text-gray-700 text-sm font-medium mb-1">
          {label}
          {required && <Text className="text-red-600"> *</Text>}
        </Text>
      )}

      <TouchableOpacity
        className={`
          border rounded-lg px-4 py-3
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100' : 'bg-white'}
        `}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
      >
        <Text
          className={`text-base ${
            selectedOption ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          {displayValue}
        </Text>
      </TouchableOpacity>

      {error && <Text className="text-red-600 text-sm mt-1">{error}</Text>}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl max-h-96">
            <View className="p-4 border-b border-gray-200 flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-gray-900">
                {label || 'Select'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text className="text-blue-600 text-base font-medium">Done</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`p-4 border-b border-gray-100 ${
                    item.value === value ? 'bg-blue-50' : ''
                  }`}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text
                    className={`text-base ${
                      item.value === value
                        ? 'text-blue-600 font-semibold'
                        : 'text-gray-900'
                    }`}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};
