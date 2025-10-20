import React from 'react';
import { View, Text, Image } from 'react-native';
import { getInitials } from '../../utils/helpers';

interface AvatarProps {
  name: string;
  photoUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  photoUrl,
  size = 'md',
  className = '',
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8';
      case 'md':
        return 'w-12 h-12';
      case 'lg':
        return 'w-16 h-16';
      case 'xl':
        return 'w-24 h-24';
      default:
        return 'w-12 h-12';
    }
  };

  const getTextSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs';
      case 'md':
        return 'text-base';
      case 'lg':
        return 'text-xl';
      case 'xl':
        return 'text-3xl';
      default:
        return 'text-base';
    }
  };

  const initials = getInitials(name);

  // Generate a consistent color based on the name
  const getColorFromName = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-teal-500',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (photoUrl) {
    return (
      <Image
        source={{ uri: photoUrl }}
        className={`${getSizeClasses()} rounded-full ${className}`}
      />
    );
  }

  return (
    <View
      className={`
        ${getSizeClasses()}
        ${getColorFromName(name)}
        rounded-full
        items-center
        justify-center
        ${className}
      `}
    >
      <Text className={`${getTextSizeClasses()} font-semibold text-white`}>
        {initials}
      </Text>
    </View>
  );
};
