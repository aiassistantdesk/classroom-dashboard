import React from 'react';
import { View, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
  pressable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onPress,
  pressable = false,
}) => {
  const cardClasses = `bg-white rounded-xl p-4 shadow-sm border border-gray-100 ${className}`;

  if (pressable || onPress) {
    return (
      <TouchableOpacity
        className={`${cardClasses} active:bg-gray-50`}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View className={cardClasses}>{children}</View>;
};
