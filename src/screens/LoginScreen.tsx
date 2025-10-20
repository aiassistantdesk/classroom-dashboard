import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { useTeacher } from '../contexts/TeacherContext';
import { GraduationCap, Mail, Lock, User, BookOpen, Calendar } from 'lucide-react-native';
import { Input } from '../components/ui';

type AuthMode = 'login' | 'signup';

export const LoginScreen: React.FC = () => {
  const { login, teachers } = useTeacher();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Signup fields
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [classStandard, setClassStandard] = useState('');
  const [division, setDivision] = useState('');
  const [academicYear, setAcademicYear] = useState('2024-2025');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      if (Platform.OS === 'web') {
        alert('Please enter both email and password');
      } else {
        Alert.alert('Error', 'Please enter both email and password');
      }
      return;
    }

    try {
      setIsLoggingIn(true);
      await login({ email: email.trim(), password });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid email or password';
      if (Platform.OS === 'web') {
        alert('Login Failed: ' + message);
      } else {
        Alert.alert('Login Failed', message);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignup = async () => {
    // For now, just show message that admin needs to create accounts
    const message = 'Account creation is managed by the school administrator. Please contact your administrator to create an account.';
    if (Platform.OS === 'web') {
      alert(message);
    } else {
      Alert.alert('Account Creation', message);
    }
  };

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="flex-1 justify-center items-center px-6 py-12">
        {/* Header */}
        <View className="items-center mb-10">
          <GraduationCap size={64} color="#3b82f6" />
          <Text className="text-3xl font-bold text-gray-900 mt-4">EduClassroom</Text>
          <Text className="text-lg text-gray-600 mt-2">Teacher Portal</Text>
        </View>

        {/* Mode Toggle */}
        <View className="flex-row bg-white rounded-lg p-1 mb-6 w-full max-w-md">
          <TouchableOpacity
            onPress={() => setMode('login')}
            className={`flex-1 py-3 rounded-md ${
              mode === 'login' ? 'bg-blue-600' : 'bg-white'
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                mode === 'login' ? 'text-white' : 'text-gray-600'
              }`}
            >
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setMode('signup')}
            className={`flex-1 py-3 rounded-md ${
              mode === 'signup' ? 'bg-blue-600' : 'bg-white'
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                mode === 'signup' ? 'text-white' : 'text-gray-600'
              }`}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        {/* Login Form */}
        {mode === 'login' && (
          <View className="w-full max-w-md">
            <View className="bg-white rounded-lg p-6 shadow-sm mb-4">
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="teacher@school.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
              />

              <TouchableOpacity
                onPress={handleLogin}
                disabled={isLoggingIn}
                className={`bg-blue-600 py-4 rounded-lg mt-4 ${
                  isLoggingIn ? 'opacity-50' : ''
                }`}
              >
                <Text className="text-white text-center text-lg font-semibold">
                  {isLoggingIn ? 'Logging in...' : 'Login'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Demo Accounts */}
            <View className="bg-white rounded-lg p-6 shadow-sm">
              <Text className="text-lg font-semibold text-gray-900 mb-3">
                Demo Accounts
              </Text>
              <Text className="text-sm text-gray-600 mb-4">
                Click on any account to auto-fill credentials
              </Text>
              <ScrollView className="space-y-2">
                {teachers.slice(0, 4).map((teacher, index) => (
                  <TouchableOpacity
                    key={teacher.id}
                    onPress={() => handleDemoLogin(teacher.email, 'password123')}
                    className="border border-gray-200 rounded-lg p-4 mb-2"
                  >
                    <Text className="font-semibold text-gray-900">
                      {teacher.name}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {teacher.subject} • Class {teacher.classStandard}
                      {teacher.division ? `-${teacher.division}` : ''}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1">
                      {teacher.email}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Text className="text-xs text-gray-500 mt-3 text-center">
                Password for all demo accounts: password123
              </Text>
            </View>
          </View>
        )}

        {/* Signup Form */}
        {mode === 'signup' && (
          <View className="w-full max-w-md">
            <View className="bg-white rounded-lg p-6 shadow-sm">
              <Text className="text-lg font-semibold text-gray-900 mb-4">
                Create Teacher Account
              </Text>

              <Input
                label="Full Name"
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
              />
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="teacher@school.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Create a password"
                secureTextEntry
              />
              <Input
                label="Subject"
                value={subject}
                onChangeText={setSubject}
                placeholder="e.g., Mathematics, Science"
              />
              <Input
                label="Class Standard"
                value={classStandard}
                onChangeText={setClassStandard}
                placeholder="e.g., 7, 8, 9"
                keyboardType="numeric"
              />
              <Input
                label="Division (Optional)"
                value={division}
                onChangeText={setDivision}
                placeholder="e.g., A, B, C"
              />
              <Input
                label="Academic Year"
                value={academicYear}
                onChangeText={setAcademicYear}
                placeholder="e.g., 2024-2025"
              />

              <TouchableOpacity
                onPress={handleSignup}
                className="bg-blue-600 py-4 rounded-lg mt-4"
              >
                <Text className="text-white text-center text-lg font-semibold">
                  Create Account
                </Text>
              </TouchableOpacity>

              <View className="mt-4 p-4 bg-blue-50 rounded-lg">
                <Text className="text-sm text-blue-800 text-center">
                  Account creation is managed by your school administrator. Please
                  contact them to set up your teacher account.
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};
