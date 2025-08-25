import { ToastActionType, ToastCategoryType } from './enums';

export interface PendingSuccessToast {
  action: ToastActionType;
  category: ToastCategoryType;
  name: string;
}
