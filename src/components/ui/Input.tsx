import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  required,
  helperText,
  containerClassName = '',
  className = '',
  ...props
}) => {
  return (
    <View className={`mb-4 ${containerClassName}`}>
      {label && (
        <Text className="text-gray-700 text-sm font-medium mb-1">
          {label}
          {required && <Text className="text-red-600"> *</Text>}
        </Text>
      )}
      <TextInput
        className={`
          border rounded-lg px-4 py-3 text-base
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${props.editable === false ? 'bg-gray-100' : 'bg-white'}
          ${className}
        `}
        placeholderTextColor="#9ca3af"
        {...props}
      />
      {error && <Text className="text-red-600 text-sm mt-1">{error}</Text>}
      {helperText && !error && (
        <Text className="text-gray-500 text-sm mt-1">{helperText}</Text>
      )}
    </View>
  );
};
