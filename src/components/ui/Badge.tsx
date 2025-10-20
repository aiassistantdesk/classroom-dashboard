import React from 'react';
import { View, Text } from 'react-native';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-100 text-blue-700';
      case 'success':
        return 'bg-green-100 text-green-700';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700';
      case 'danger':
        return 'bg-red-100 text-red-700';
      case 'info':
        return 'bg-cyan-100 text-cyan-700';
      case 'default':
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <View className={`px-2 py-1 rounded-full ${className}`}>
      <Text className={`text-xs font-medium ${getVariantClasses()}`}>
        {children}
      </Text>
    </View>
  );
};
