import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Menu, ArrowLeft } from 'lucide-react-native';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  onMenuPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBack,
  rightAction,
  onMenuPress,
}) => {
  return (
    <View
      className={`
        bg-white border-b border-gray-200
        ${Platform.OS === 'web' ? 'shadow-sm' : ''}
      `}
    >
      <View className="px-4 py-4 flex-row items-center justify-between">
        {/* Left side */}
        <View className="flex-row items-center flex-1">
          {showBack && onBack ? (
            <TouchableOpacity onPress={onBack} className="mr-3">
              <ArrowLeft size={24} color="#111827" />
            </TouchableOpacity>
          ) : onMenuPress ? (
            <TouchableOpacity onPress={onMenuPress} className="mr-3">
              <Menu size={24} color="#111827" />
            </TouchableOpacity>
          ) : null}

          <Text className="text-xl font-bold text-gray-900" numberOfLines={1}>
            {title}
          </Text>
        </View>

        {/* Right side */}
        {rightAction && <View>{rightAction}</View>}
      </View>
    </View>
  );
};
