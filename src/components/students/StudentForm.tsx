import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { Input, Select, SelectOption, Button, Avatar } from '../ui';
import { studentSchema, StudentFormData } from '../../utils/validation';
import { Student, CreateStudentInput } from '../../types/student';
import { calculateAge } from '../../utils/helpers';
import { useTeacher } from '../../contexts/TeacherContext';
import { Camera } from 'lucide-react-native';

interface StudentFormProps {
  mode: 'add' | 'edit';
  initialData?: Student;
  onSubmit: (data: CreateStudentInput) => Promise<void>;
  onCancel: () => void;
}

export const StudentForm: React.FC<StudentFormProps> = ({
  mode,
  initialData,
  onSubmit,
  onCancel,
}) => {
  const { currentSession } = useTeacher();
  const [loading, setLoading] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | undefined>(initialData?.photoUrl);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: initialData
      ? {
          rollNo: initialData.rollNo,
          registerName: initialData.registerName,
          studentFullName: initialData.studentFullName,
          classStandard: initialData.classStandard,
          division: initialData.division,
          academicYear: initialData.academicYear,
          saralId: initialData.saralId,
          aparId: initialData.aparId,
          penNo: initialData.penNo,
          aadhaarNo: initialData.aadhaarNo,
          studentWeight: initialData.studentWeight,
          studentHeight: initialData.studentHeight,
          gender: initialData.gender,
          birthDate: initialData.birthDate,
          bloodGroup: initialData.bloodGroup,
          studentFatherName: initialData.studentFatherName,
          studentMotherName: initialData.studentMotherName,
          fatherMobileNo: initialData.fatherMobileNo,
          motherMobileNo: initialData.motherMobileNo,
          motherTongue: initialData.motherTongue,
          religion: initialData.religion,
          caste: initialData.caste,
          casteCategory: initialData.casteCategory,
          fullAddress: initialData.fullAddress,
          studentBankAccountNo: initialData.studentBankAccountNo || '',
          photoUrl: initialData.photoUrl,
          notes: initialData.notes,
        }
      : {
          classStandard: currentSession?.teacher.classStandard || '',
          division: currentSession?.teacher.division || '',
          academicYear: currentSession?.academicYear || '',
        },
  });

  // Watch birth date to auto-calculate age
  const birthDate = watch('birthDate');

  useEffect(() => {
    if (birthDate) {
      try {
        const age = calculateAge(birthDate);
        // Age will be calculated on submit
      } catch (error) {
        // Invalid date
      }
    }
  }, [birthDate]);

  const pickImage = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Note', 'Image upload is available on mobile devices');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permission');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
      setValue('photoUrl', result.assets[0].uri);
    }
  };

  const onFormSubmit = async (data: StudentFormData) => {
    setLoading(true);
    try {
      const submitData: CreateStudentInput = {
        ...data,
        photoUrl: photoUri,
      };
      await onSubmit(submitData);
    } catch (error) {
      Alert.alert('Error', 'Failed to save student');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Select options
  const genderOptions: SelectOption[] = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];

  const categoryOptions: SelectOption[] = [
    { label: 'General', value: 'General' },
    { label: 'OBC', value: 'OBC' },
    { label: 'SC', value: 'SC' },
    { label: 'ST', value: 'ST' },
    { label: 'EWS', value: 'EWS' },
    { label: 'Other', value: 'Other' },
  ];

  const bloodGroupOptions: SelectOption[] = [
    { label: 'A+', value: 'A+' },
    { label: 'A-', value: 'A-' },
    { label: 'B+', value: 'B+' },
    { label: 'B-', value: 'B-' },
    { label: 'AB+', value: 'AB+' },
    { label: 'AB-', value: 'AB-' },
    { label: 'O+', value: 'O+' },
    { label: 'O-', value: 'O-' },
  ];

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      {/* Photo Section */}
      <View className="items-center mb-6">
        <TouchableOpacity onPress={pickImage} className="relative">
          <Avatar
            name={watch('studentFullName') || 'Student'}
            photoUrl={photoUri}
            size="xl"
          />
          <View className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2">
            <Camera size={20} color="#ffffff" />
          </View>
        </TouchableOpacity>
        <Text className="text-gray-600 text-sm mt-2">Tap to change photo</Text>
      </View>

      {/* Section 1: Basic Information */}
      <Text className="text-lg font-bold text-gray-900 mb-3">Basic Information</Text>

      <Controller
        control={control}
        name="studentFullName"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Student Full Name"
            value={value}
            onChangeText={onChange}
            error={errors.studentFullName?.message}
            required
            placeholder="Enter full name"
          />
        )}
      />

      <Controller
        control={control}
        name="registerName"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Register Name"
            value={value}
            onChangeText={onChange}
            error={errors.registerName?.message}
            required
            placeholder="Enter register name"
          />
        )}
      />

      <Controller
        control={control}
        name="rollNo"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Roll Number"
            value={value}
            onChangeText={onChange}
            error={errors.rollNo?.message}
            required
            placeholder="Enter roll number"
          />
        )}
      />

      {/* Section 2: Class Information */}
      <Text className="text-lg font-bold text-gray-900 mb-3 mt-4">Class Information</Text>

      <View className="flex-row space-x-3">
        <View className="flex-1">
          <Controller
            control={control}
            name="classStandard"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Class Standard"
                value={value}
                onChangeText={onChange}
                error={errors.classStandard?.message}
                required
                placeholder="e.g., 10"
                editable={mode === 'add'}
              />
            )}
          />
        </View>
        <View className="flex-1">
          <Controller
            control={control}
            name="division"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Division"
                value={value}
                onChangeText={onChange}
                error={errors.division?.message}
                required
                placeholder="e.g., A"
                editable={mode === 'add'}
              />
            )}
          />
        </View>
      </View>

      <Controller
        control={control}
        name="academicYear"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Academic Year"
            value={value}
            onChangeText={onChange}
            error={errors.academicYear?.message}
            required
            placeholder="e.g., 2024-2025"
            editable={false}
          />
        )}
      />

      {/* Section 3: Government IDs */}
      <Text className="text-lg font-bold text-gray-900 mb-3 mt-4">Government IDs</Text>

      <Controller
        control={control}
        name="saralId"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Saral ID"
            value={value}
            onChangeText={onChange}
            error={errors.saralId?.message}
            required
            placeholder="Enter Saral ID"
          />
        )}
      />

      <Controller
        control={control}
        name="aparId"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Apar ID"
            value={value}
            onChangeText={onChange}
            error={errors.aparId?.message}
            required
            placeholder="Enter Apar ID"
          />
        )}
      />

      <Controller
        control={control}
        name="penNo"
        render={({ field: { onChange, value } }) => (
          <Input
            label="PEN Number"
            value={value}
            onChangeText={onChange}
            error={errors.penNo?.message}
            required
            placeholder="Enter PEN number"
          />
        )}
      />

      <Controller
        control={control}
        name="aadhaarNo"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Aadhaar Number"
            value={value}
            onChangeText={onChange}
            error={errors.aadhaarNo?.message}
            required
            placeholder="Enter 12-digit Aadhaar"
            keyboardType="number-pad"
            maxLength={12}
          />
        )}
      />

      {/* Section 4: Personal Information */}
      <Text className="text-lg font-bold text-gray-900 mb-3 mt-4">Personal Information</Text>

      <Controller
        control={control}
        name="gender"
        render={({ field: { onChange, value } }) => (
          <Select
            label="Gender"
            value={value}
            options={genderOptions}
            onChange={onChange}
            error={errors.gender?.message}
            required
          />
        )}
      />

      <Controller
        control={control}
        name="birthDate"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Birth Date"
            value={value}
            onChangeText={onChange}
            error={errors.birthDate?.message}
            required
            placeholder="YYYY-MM-DD"
            helperText="Format: YYYY-MM-DD (e.g., 2010-05-15)"
          />
        )}
      />

      <Controller
        control={control}
        name="bloodGroup"
        render={({ field: { onChange, value } }) => (
          <Select
            label="Blood Group"
            value={value}
            options={bloodGroupOptions}
            onChange={onChange}
            error={errors.bloodGroup?.message}
            required
          />
        )}
      />

      <Controller
        control={control}
        name="motherTongue"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Mother Tongue"
            value={value}
            onChangeText={onChange}
            error={errors.motherTongue?.message}
            required
            placeholder="Enter mother tongue"
          />
        )}
      />

      <Controller
        control={control}
        name="religion"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Religion"
            value={value}
            onChangeText={onChange}
            error={errors.religion?.message}
            required
            placeholder="Enter religion"
          />
        )}
      />

      <Controller
        control={control}
        name="caste"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Caste"
            value={value}
            onChangeText={onChange}
            error={errors.caste?.message}
            required
            placeholder="Enter caste"
          />
        )}
      />

      <Controller
        control={control}
        name="casteCategory"
        render={({ field: { onChange, value } }) => (
          <Select
            label="Caste Category"
            value={value}
            options={categoryOptions}
            onChange={onChange}
            error={errors.casteCategory?.message}
            required
          />
        )}
      />

      {/* Section 5: Physical Attributes */}
      <Text className="text-lg font-bold text-gray-900 mb-3 mt-4">Physical Attributes</Text>

      <View className="flex-row space-x-3">
        <View className="flex-1">
          <Controller
            control={control}
            name="studentHeight"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Height (cm)"
                value={value}
                onChangeText={onChange}
                error={errors.studentHeight?.message}
                required
                placeholder="e.g., 150"
                keyboardType="decimal-pad"
              />
            )}
          />
        </View>
        <View className="flex-1">
          <Controller
            control={control}
            name="studentWeight"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Weight (kg)"
                value={value}
                onChangeText={onChange}
                error={errors.studentWeight?.message}
                required
                placeholder="e.g., 45"
                keyboardType="decimal-pad"
              />
            )}
          />
        </View>
      </View>

      {/* Section 6: Family Details */}
      <Text className="text-lg font-bold text-gray-900 mb-3 mt-4">Family Details</Text>

      <Controller
        control={control}
        name="studentFatherName"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Father's Name"
            value={value}
            onChangeText={onChange}
            error={errors.studentFatherName?.message}
            required
            placeholder="Enter father's full name"
          />
        )}
      />

      <Controller
        control={control}
        name="fatherMobileNo"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Father's Mobile Number"
            value={value}
            onChangeText={onChange}
            error={errors.fatherMobileNo?.message}
            required
            placeholder="Enter 10-digit mobile"
            keyboardType="phone-pad"
            maxLength={10}
          />
        )}
      />

      <Controller
        control={control}
        name="studentMotherName"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Mother's Name"
            value={value}
            onChangeText={onChange}
            error={errors.studentMotherName?.message}
            required
            placeholder="Enter mother's full name"
          />
        )}
      />

      <Controller
        control={control}
        name="motherMobileNo"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Mother's Mobile Number"
            value={value}
            onChangeText={onChange}
            error={errors.motherMobileNo?.message}
            required
            placeholder="Enter 10-digit mobile"
            keyboardType="phone-pad"
            maxLength={10}
          />
        )}
      />

      {/* Section 7: Address */}
      <Text className="text-lg font-bold text-gray-900 mb-3 mt-4">Address Information</Text>

      <Controller
        control={control}
        name="fullAddress"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Full Address"
            value={value}
            onChangeText={onChange}
            error={errors.fullAddress?.message}
            required
            placeholder="Enter complete address"
            multiline
            numberOfLines={3}
          />
        )}
      />

      {/* Section 8: Financial Information */}
      <Text className="text-lg font-bold text-gray-900 mb-3 mt-4">Financial Information</Text>

      <Controller
        control={control}
        name="studentBankAccountNo"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Bank Account Number"
            value={value}
            onChangeText={onChange}
            error={errors.studentBankAccountNo?.message}
            placeholder="Enter bank account number (optional)"
            keyboardType="number-pad"
          />
        )}
      />

      {/* Section 9: Additional Notes */}
      <Text className="text-lg font-bold text-gray-900 mb-3 mt-4">Additional Notes</Text>

      <Controller
        control={control}
        name="notes"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Notes"
            value={value}
            onChangeText={onChange}
            error={errors.notes?.message}
            placeholder="Any additional notes (optional)"
            multiline
            numberOfLines={4}
          />
        )}
      />

      {/* Action Buttons */}
      <View className="flex-row space-x-3 mt-6 mb-8">
        <View className="flex-1">
          <Button variant="outline" fullWidth onPress={onCancel}>
            Cancel
          </Button>
        </View>
        <View className="flex-1">
          <Button
            variant="primary"
            fullWidth
            onPress={handleSubmit(onFormSubmit)}
            loading={loading}
          >
            {mode === 'add' ? 'Add Student' : 'Save Changes'}
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};
