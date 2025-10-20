import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  children,
  className = '',
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 active:bg-blue-700';
      case 'secondary':
        return 'bg-gray-600 active:bg-gray-700';
      case 'outline':
        return 'bg-transparent border-2 border-blue-600 active:bg-blue-50';
      case 'danger':
        return 'bg-red-600 active:bg-red-700';
      case 'ghost':
        return 'bg-transparent active:bg-gray-100';
      default:
        return 'bg-blue-600 active:bg-blue-700';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 rounded-md';
      case 'md':
        return 'px-4 py-3 rounded-lg';
      case 'lg':
        return 'px-6 py-4 rounded-xl';
      default:
        return 'px-4 py-3 rounded-lg';
    }
  };

  const getTextVariantClasses = () => {
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
        return 'text-white';
      case 'outline':
        return 'text-blue-600';
      case 'ghost':
        return 'text-gray-700';
      default:
        return 'text-white';
    }
  };

  const getTextSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'md':
        return 'text-base';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      className={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50' : ''}
        flex-row items-center justify-center
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? '#2563eb' : '#ffffff'}
        />
      ) : (
        <Text
          className={`
            ${getTextVariantClasses()}
            ${getTextSizeClasses()}
            font-semibold
          `}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};
