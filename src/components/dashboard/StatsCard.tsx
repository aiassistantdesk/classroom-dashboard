import React from 'react';
import { View, Text } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  iconColor = '#2563eb',
  iconBgColor = '#dbeafe',
}) => {
  return (
    <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-gray-600 text-sm font-medium mb-1">{title}</Text>
          <Text className="text-gray-900 text-2xl font-bold">{value}</Text>
        </View>
        <View
          className="w-12 h-12 rounded-full items-center justify-center"
          style={{ backgroundColor: iconBgColor }}
        >
          <Icon size={24} color={iconColor} />
        </View>
      </View>
    </View>
  );
};
