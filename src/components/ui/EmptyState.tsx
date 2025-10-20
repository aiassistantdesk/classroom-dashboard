import React from 'react';
import { View, Text } from 'react-native';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <View className={`items-center justify-center py-12 px-6 ${className}`}>
      {icon && <View className="mb-4">{icon}</View>}

      <Text className="text-xl font-semibold text-gray-900 text-center mb-2">
        {title}
      </Text>

      {description && (
        <Text className="text-base text-gray-600 text-center mb-6">
          {description}
        </Text>
      )}

      {actionLabel && onAction && (
        <Button onPress={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </View>
  );
};
