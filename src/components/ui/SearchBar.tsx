import React from 'react';
import { View, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { Search, X } from 'lucide-react-native';

interface SearchBarProps extends TextInputProps {
  onClear?: () => void;
  containerClassName?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onClear,
  placeholder = 'Search...',
  containerClassName = '',
  ...props
}) => {
  return (
    <View className={`relative ${containerClassName}`}>
      <View className="absolute left-3 top-3 z-10">
        <Search size={20} color="#9ca3af" />
      </View>

      <TextInput
        className="bg-white border border-gray-300 rounded-lg pl-10 pr-10 py-3 text-base"
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        value={value}
        onChangeText={onChangeText}
        {...props}
      />

      {value && value.length > 0 && (
        <TouchableOpacity
          className="absolute right-3 top-3 z-10"
          onPress={onClear}
        >
          <X size={20} color="#9ca3af" />
        </TouchableOpacity>
      )}
    </View>
  );
};
