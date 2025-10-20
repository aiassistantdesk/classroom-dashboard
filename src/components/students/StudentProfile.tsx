import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Student } from '../../types/student';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { InfoRow } from './InfoRow';
import { formatDate, formatPhoneNumber, formatAadhaar } from '../../utils/helpers';

interface StudentProfileProps {
  student: Student;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({ student }) => {
  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      {/* Header with Photo */}
      <View className="bg-white rounded-xl p-6 mb-4 shadow-sm border border-gray-100 items-center">
        <Avatar
          name={student.studentFullName}
          photoUrl={student.photoUrl}
          size="xl"
        />
        <Text className="text-2xl font-bold text-gray-900 mt-4 text-center">
          {student.studentFullName}
        </Text>
        <View className="flex-row items-center mt-2">
          <Text className="text-gray-600 text-base">Roll No: {student.rollNo}</Text>
          <Text className="text-gray-400 mx-2">•</Text>
          <Text className="text-gray-600 text-base">
            Class {student.classStandard}-{student.division}
          </Text>
        </View>
        <View className="flex-row items-center mt-3">
          <Badge variant="primary" className="mr-2">
            {student.gender}
          </Badge>
          <Badge variant="info" className="mr-2">
            Age: {student.age}
          </Badge>
          <Badge variant="success">
            {student.bloodGroup}
          </Badge>
        </View>
      </View>

      {/* Basic Information */}
      <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
        <Text className="text-lg font-bold text-gray-900 mb-4">Basic Information</Text>
        <InfoRow label="Full Name" value={student.studentFullName} />
        <InfoRow label="Register Name" value={student.registerName} />
        <InfoRow label="Roll Number" value={student.rollNo} />
      </View>

      {/* Class Information */}
      <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
        <Text className="text-lg font-bold text-gray-900 mb-4">Class Information</Text>
        <View className="flex-row">
          <View className="flex-1 mr-2">
            <InfoRow label="Class Standard" value={student.classStandard} />
          </View>
          <View className="flex-1 ml-2">
            <InfoRow label="Division" value={student.division} />
          </View>
        </View>
      </View>

      {/* Government IDs */}
      <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
        <Text className="text-lg font-bold text-gray-900 mb-4">Government IDs</Text>
        <InfoRow label="Saral ID" value={student.saralId} />
        <InfoRow label="Apar ID" value={student.aparId} />
        <InfoRow label="PEN Number" value={student.penNo} />
        <InfoRow label="Aadhaar Number" value={formatAadhaar(student.aadhaarNo)} />
      </View>

      {/* Personal Information */}
      <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
        <Text className="text-lg font-bold text-gray-900 mb-4">Personal Information</Text>
        <View className="flex-row">
          <View className="flex-1 mr-2">
            <InfoRow label="Gender" value={student.gender} />
          </View>
          <View className="flex-1 ml-2">
            <InfoRow label="Age" value={student.age} />
          </View>
        </View>
        <InfoRow label="Birth Date" value={formatDate(student.birthDate)} />
        <InfoRow label="Blood Group" value={student.bloodGroup} />
        <InfoRow label="Mother Tongue" value={student.motherTongue} />
        <InfoRow label="Religion" value={student.religion} />
        <InfoRow label="Caste" value={student.caste} />
        <InfoRow label="Caste Category" value={student.casteCategory} />
      </View>

      {/* Physical Attributes */}
      <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
        <Text className="text-lg font-bold text-gray-900 mb-4">Physical Attributes</Text>
        <View className="flex-row">
          <View className="flex-1 mr-2">
            <InfoRow label="Height" value={`${student.studentHeight} cm`} />
          </View>
          <View className="flex-1 ml-2">
            <InfoRow label="Weight" value={`${student.studentWeight} kg`} />
          </View>
        </View>
      </View>

      {/* Family Details */}
      <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
        <Text className="text-lg font-bold text-gray-900 mb-4">Family Details</Text>
        <InfoRow label="Father's Name" value={student.studentFatherName} />
        <InfoRow label="Father's Mobile" value={formatPhoneNumber(student.fatherMobileNo)} />
        <InfoRow label="Mother's Name" value={student.studentMotherName} />
        <InfoRow label="Mother's Mobile" value={formatPhoneNumber(student.motherMobileNo)} />
      </View>

      {/* Address Information */}
      <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
        <Text className="text-lg font-bold text-gray-900 mb-4">Address Information</Text>
        <InfoRow label="Full Address" value={student.fullAddress} fullWidth />
      </View>

      {/* Financial Information */}
      <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
        <Text className="text-lg font-bold text-gray-900 mb-4">Financial Information</Text>
        <InfoRow
          label="Bank Account Number"
          value={student.studentBankAccountNo || 'Not provided'}
        />
      </View>

      {/* Additional Notes */}
      {student.notes && (
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
          <Text className="text-lg font-bold text-gray-900 mb-4">Additional Notes</Text>
          <Text className="text-gray-900 text-base">{student.notes}</Text>
        </View>
      )}

      {/* Metadata */}
      <View className="bg-gray-100 rounded-xl p-4 mb-4">
        <Text className="text-sm text-gray-600 mb-1">
          Created: {formatDate(student.createdAt)}
        </Text>
        <Text className="text-sm text-gray-600">
          Last Updated: {formatDate(student.updatedAt)}
        </Text>
      </View>
    </ScrollView>
  );
};
