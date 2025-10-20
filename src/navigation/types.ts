import { NavigatorScreenParams } from '@react-navigation/native';

// Root Stack Navigator
export type RootStackParamList = {
  Login: undefined;
  MainTabs: NavigatorScreenParams<TabParamList>;
  StudentDetail: { studentId: string };
  AddStudent: undefined;
  EditStudent: { studentId: string };
};

// Bottom Tab Navigator
export type TabParamList = {
  Dashboard: undefined;
  Students: undefined;
  Settings: undefined;
};

// Type helpers for navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
