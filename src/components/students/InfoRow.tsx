import React from 'react';
import { View, Text } from 'react-native';

interface InfoRowProps {
  label: string;
  value: string | number | undefined;
  fullWidth?: boolean;
}

export const InfoRow: React.FC<InfoRowProps> = ({ label, value, fullWidth = false }) => {
  return (
    <View className={`${fullWidth ? 'mb-4' : 'mb-3'}`}>
      <Text className="text-gray-600 text-sm font-medium mb-1">{label}</Text>
      <Text className="text-gray-900 text-base">
        {value || 'Not provided'}
      </Text>
    </View>
  );
};
