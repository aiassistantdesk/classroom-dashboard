import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../navigation/types';
import { BookOpen, Eye, EyeOff } from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const CreateAccountScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { createAccount, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleCreateAccount = async () => {
    // Reset errors
    setValidationError(null);

    // Validation
    if (!email.trim()) {
      setValidationError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setValidationError('Please enter a valid email address');
      return;
    }

    if (!password.trim()) {
      setValidationError('Password is required');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    if (!confirmPassword.trim()) {
      setValidationError('Please confirm your password');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    // Attempt to create account
    const result = await createAccount(email.trim().toLowerCase(), password);

    if (!result.success) {
      setValidationError(result.error || 'Failed to create account');
    }
    // On success, AuthContext will handle navigation via RootNavigator
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-900"
    >
      <View className="flex-1 justify-center px-6">
        {/* Logo/Header */}
        <View className="items-center mb-12">
          <View className="bg-blue-600 rounded-full p-4 mb-4">
            <BookOpen size={48} color="#fff" />
          </View>
          <Text className="text-3xl font-bold text-white mb-2">
            Create Account
          </Text>
          <Text className="text-gray-400 text-center">
            Join Classroom Dashboard and start managing your students
          </Text>
        </View>

        {/* Create Account Form */}
        <View className="space-y-4">
          {/* Email Input */}
          <View>
            <Text className="text-gray-300 mb-2 text-sm font-medium">
              Email Address
            </Text>
            <TextInput
              className="bg-gray-800 text-white px-4 py-3.5 rounded-xl border border-gray-700 focus:border-blue-600"
              placeholder="Enter your email"
              placeholderTextColor="#6B7280"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          {/* Password Input */}
          <View className="mt-4">
            <Text className="text-gray-300 mb-2 text-sm font-medium">
              Password
            </Text>
            <View className="relative">
              <TextInput
                className="bg-gray-800 text-white px-4 py-3.5 rounded-xl border border-gray-700 focus:border-blue-600 pr-12"
                placeholder="Enter your password"
                placeholderTextColor="#6B7280"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#6B7280" />
                ) : (
                  <Eye size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>
            <Text className="text-gray-500 text-xs mt-1">
              Minimum 6 characters
            </Text>
          </View>

          {/* Confirm Password Input */}
          <View className="mt-4">
            <Text className="text-gray-300 mb-2 text-sm font-medium">
              Confirm Password
            </Text>
            <View className="relative">
              <TextInput
                className="bg-gray-800 text-white px-4 py-3.5 rounded-xl border border-gray-700 focus:border-blue-600 pr-12"
                placeholder="Confirm your password"
                placeholderTextColor="#6B7280"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-4"
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color="#6B7280" />
                ) : (
                  <Eye size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Error Messages */}
          {validationError && (
            <View className="bg-red-900/20 border border-red-600 rounded-xl p-3 mt-4">
              <Text className="text-red-400 text-sm">
                {validationError}
              </Text>
            </View>
          )}

          {/* Create Account Button */}
          <TouchableOpacity
            onPress={handleCreateAccount}
            disabled={isLoading}
            className={`py-4 rounded-xl items-center mt-6 ${
              isLoading ? 'bg-blue-600/50' : 'bg-blue-600'
            }`}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View className="mt-6 flex-row justify-center items-center">
            <Text className="text-gray-400">Already have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              disabled={isLoading}
            >
              <Text className="text-blue-500 font-semibold">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
