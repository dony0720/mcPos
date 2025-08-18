import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import McPosLogo from '../assets/icon/mcPosLogo.svg';
import { CashInspectionModal } from '../components';
import { useCashStore } from '../stores';
import { CashDrawerMoneyItem } from '../types';

const OPENING_CASH_KEY = '@mcpos_opening_cash_set';

export default function HomeScreen() {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isOpeningCashSet, setIsOpeningCashSet] = useState<boolean | null>(
    null
  );

  // 현금 스토어 사용
  const { cashDrawer, updateCashDrawer } = useCashStore();

  // 앱 시작 시 시재 설정 여부 확인
  useEffect(() => {
    checkOpeningCashStatus();
  }, []);

  const checkOpeningCashStatus = async () => {
    try {
      const status = await AsyncStorage.getItem(OPENING_CASH_KEY);
      setIsOpeningCashSet(status === 'true');
    } catch (error) {
      console.error('시재 설정 상태 확인 실패:', error);
      setIsOpeningCashSet(false);
    }
  };

  const handleStartPress = () => {
    // 무조건 시재 점검 모달 표시
    setIsModalVisible(true);
  };

  const handleOpeningCashConfirm = async (
    updatedCashData: CashDrawerMoneyItem[]
  ) => {
    try {
      // 현금 서랍 데이터 업데이트
      updateCashDrawer(updatedCashData);

      // 시재 설정 완료 상태 저장
      await AsyncStorage.setItem(OPENING_CASH_KEY, 'true');
      setIsOpeningCashSet(true);

      // 메인 화면으로 이동
      router.push('/(tabs)');
    } catch (error) {
      console.error('시재 설정 상태 저장 실패:', error);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  // 로딩 중일 때는 빈 화면 표시
  if (isOpeningCashSet === null) {
    return (
      <View className='h-full w-full bg-white flex justify-center items-center'>
        <Text className='text-gray-500'>로딩 중...</Text>
      </View>
    );
  }

  return (
    <View className='h-full w-full box-border px-[20%] bg-white flex flex-col items-center justify-center'>
      <View className='flex justify-center items-center'>
        <McPosLogo className='w-full h-full' />
      </View>
      <LottieView
        source={require('../assets/animation/mcCoffee.json')}
        autoPlay
        loop
        style={{ width: 400, height: 400 }}
      />

      <Pressable
        role='button'
        className='w-full h-[80px] flex justify-center items-center bg-primaryGreen rounded-lg'
        onPress={handleStartPress}
      >
        <Text className='text-white text-3xl font-bold'>Start</Text>
      </Pressable>

      {/* 시재 점검 모달 */}
      <CashInspectionModal
        visible={isModalVisible}
        onClose={handleModalClose}
        onConfirm={handleOpeningCashConfirm}
        initialData={cashDrawer}
      />
    </View>
  );
}
