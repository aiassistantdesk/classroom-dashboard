import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../ui/Input';

const teacherSchema = z.object({
  name: z.string().min(3, 'Full name must be at least 3 characters'),
  subject: z.string().min(2, 'Subject must be at least 2 characters'),
  classStandard: z.string().min(1, 'Class is required'),
  division: z.string().optional(),
});

export type TeacherFormData = z.infer<typeof teacherSchema>;

interface TeacherFormProps {
  onSubmit: (data: TeacherFormData) => void;
  defaultValues?: Partial<TeacherFormData>;
  isSubmitting: boolean;
}

export const TeacherForm: React.FC<TeacherFormProps> = ({ onSubmit, defaultValues, isSubmitting }) => {
  const { control, handleSubmit, formState: { errors } } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues,
  });

  return (
    <View className="p-6 bg-white rounded-2xl">
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.name?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="subject"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Subject"
            placeholder="e.g., Mathematics, English"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.subject?.message}
          />
        )}
      />

      <View className="flex-row space-x-4">
        <View className="flex-1">
          <Controller
            control={control}
            name="classStandard"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Class"
                placeholder="e.g., 10"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.classStandard?.message}
              />
            )}
          />
        </View>
        <View className="flex-1">
          <Controller
            control={control}
            name="division"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Division (Optional)"
                placeholder="e.g., A"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.division?.message}
              />
            )}
          />
        </View>
      </View>

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        className={`mt-6 py-4 rounded-xl ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600'}`}
      >
        <Text className="text-white text-center font-bold text-lg">
          {isSubmitting ? 'Saving...' : 'Save and Continue'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};