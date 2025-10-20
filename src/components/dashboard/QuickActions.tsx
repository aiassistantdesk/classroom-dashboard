import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Button } from '../ui/Button';
import { UserPlus, Users } from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const QuickActions: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <Text className="text-lg font-bold text-gray-900 mb-4">Quick Actions</Text>

      <View className="space-y-3">
        <Button
          variant="primary"
          fullWidth
          onPress={() => navigation.navigate('AddStudent')}
        >
          <View className="flex-row items-center justify-center">
            <UserPlus size={20} color="#ffffff" style={{ marginRight: 8 }} />
            <Text className="text-white font-semibold text-base">Add New Student</Text>
          </View>
        </Button>

        <View className="h-3" />

        <Button
          variant="outline"
          fullWidth
          onPress={() => navigation.navigate('MainTabs', { screen: 'Students' })}
        >
          <View className="flex-row items-center justify-center">
            <Users size={20} color="#2563eb" style={{ marginRight: 8 }} />
            <Text className="text-blue-600 font-semibold text-base">View All Students</Text>
          </View>
        </Button>
      </View>
    </View>
  );
};
