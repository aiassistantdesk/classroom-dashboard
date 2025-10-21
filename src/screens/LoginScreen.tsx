import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen } from 'lucide-react-native';

export const LoginScreen: React.FC = () => {
  const { login, error, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
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

    // Attempt login
    const success = await login(email.trim().toLowerCase(), password, rememberMe);

    if (!success) {
      // Error is set in AuthContext
      console.log('Login failed');
    }
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
            Classroom Dashboard
          </Text>
          <Text className="text-gray-400 text-center">
            Manage your students with ease
          </Text>
        </View>

        {/* Login Form */}
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
            <TextInput
              className="bg-gray-800 text-white px-4 py-3.5 rounded-xl border border-gray-700 focus:border-blue-600"
              placeholder="Enter your password"
              placeholderTextColor="#6B7280"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          {/* Remember Me */}
          <TouchableOpacity
            onPress={() => setRememberMe(!rememberMe)}
            className="flex-row items-center mt-4"
            disabled={isLoading}
          >
            <View
              className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${
                rememberMe ? 'bg-blue-600 border-blue-600' : 'border-gray-600'
              }`}
            >
              {rememberMe && (
                <Text className="text-white text-xs">✓</Text>
              )}
            </View>
            <Text className="text-gray-300">Remember me</Text>
          </TouchableOpacity>

          {/* Error Messages */}
          {(validationError || error) && (
            <View className="bg-red-900/20 border border-red-600 rounded-xl p-3 mt-4">
              <Text className="text-red-400 text-sm">
                {validationError || error}
              </Text>
            </View>
          )}

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            className={`py-4 rounded-xl items-center mt-6 ${
              isLoading ? 'bg-blue-600/50' : 'bg-blue-600'
            }`}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">
                Login
              </Text>
            )}
          </TouchableOpacity>

          {/* Demo Info */}
          <View className="mt-6 bg-gray-800 rounded-xl p-4">
            <Text className="text-gray-400 text-xs text-center">
              Demo Mode: First-time users will be asked to set up their profile.{'\n'}
              Your credentials are stored locally on this device.
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
