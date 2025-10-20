import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Platform, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { GraduationCap } from 'lucide-react-native';

export const LoginScreen: React.FC = () => {
  const { login, isLoading, error } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (error) {
      const message = error || 'Failed to sign in';
      if (Platform.OS === 'web') {
        alert('Sign In Failed: ' + message);
      } else {
        Alert.alert('Sign In Failed', message);
      }
    }
  }, [error]);

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await login();
    } catch (err) {
      console.error('Sign in error:', err);
    } finally {
      setIsSigningIn(false);
    }
  };

  const loading = isLoading || isSigningIn;

  return (
    <View className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 justify-center items-center px-6">
      <View className="w-full max-w-md">
        {/* Header */}
        <View className="items-center mb-12">
          <View className="bg-blue-600 p-4 rounded-full mb-4">
            <GraduationCap size={48} color="#ffffff" />
          </View>
          <Text className="text-4xl font-bold text-gray-900">EduClassroom</Text>
          <Text className="text-lg text-gray-600 mt-2">Teacher Dashboard</Text>
        </View>

        {/* Main Card */}
        <View className="bg-white rounded-2xl p-8 shadow-lg">
          <Text className="text-2xl font-bold text-gray-900 text-center mb-3">
            Welcome Back
          </Text>
          <Text className="text-gray-600 text-center mb-8">
            Sign in with your Google account to manage your classroom
          </Text>

          {/* Google Sign-In Button */}
          <TouchableOpacity
            onPress={handleGoogleSignIn}
            disabled={loading}
            className={`bg-white border-2 border-gray-300 py-4 px-6 rounded-xl flex-row items-center justify-center ${
              loading ? 'opacity-50' : ''
            }`}
            style={{ elevation: 2 }}
          >
            {loading ? (
              <ActivityIndicator color="#3b82f6" />
            ) : (
              <>
                <View className="mr-3">
                  <Text className="text-2xl">🔐</Text>
                </View>
                <Text className="text-gray-900 text-lg font-semibold">
                  Sign in with Google
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Info Section */}
          <View className="mt-8 p-4 bg-blue-50 rounded-xl">
            <Text className="text-sm text-blue-900 font-semibold mb-2">
              Why Google Sign-In?
            </Text>
            <Text className="text-sm text-blue-800 leading-5">
              • Your data is securely stored in the cloud{'\n'}
              • Access from any device, anywhere{'\n'}
              • Automatic sync across all your devices{'\n'}
              • Works offline with automatic sync
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View className="mt-8">
          <Text className="text-center text-gray-600 text-sm">
            Secure authentication powered by Firebase
          </Text>
        </View>
      </View>
    </View>
  );
};
