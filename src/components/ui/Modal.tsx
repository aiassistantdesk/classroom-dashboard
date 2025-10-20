import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ModalProps as RNModalProps,
} from 'react-native';
import { X } from 'lucide-react-native';

interface ModalProps extends Omit<RNModalProps, 'visible' | 'onRequestClose'> {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  ...props
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'max-w-sm';
      case 'md':
        return 'max-w-md';
      case 'lg':
        return 'max-w-lg';
      case 'full':
        return 'w-full h-full';
      default:
        return 'max-w-md';
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      {...props}
    >
      <View className="flex-1 bg-black/50 justify-center items-center p-4">
        <View className={`bg-white rounded-2xl w-full ${getSizeClasses()} max-h-5/6`}>
          {/* Header */}
          {title && (
            <View className="px-6 py-4 border-b border-gray-200 flex-row items-center justify-between">
              <Text className="text-xl font-semibold text-gray-900">{title}</Text>
              <TouchableOpacity onPress={onClose} className="p-1">
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
          )}

          {/* Content */}
          <ScrollView className="px-6 py-4" showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>

          {/* Footer */}
          {footer && (
            <View className="px-6 py-4 border-t border-gray-200">{footer}</View>
          )}
        </View>
      </View>
    </RNModal>
  );
};
