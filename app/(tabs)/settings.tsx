import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { AdminProtectedRoute } from '../../components';
import { createPrinterService } from '../../utils';

/**
 * 설정 화면 컴포넌트
 * - 관리자 전용 설정 화면 (메뉴, 카테고리, 할인 관리)
 * - AdminProtectedRoute로 관리자 권한 검증
 */
export default function Settings() {
  const router = useRouter();
  const [isPrinting, setIsPrinting] = useState(false);

  // USB 장치 확인 함수
  const handleCheckUsbDevices = async () => {
    try {
      console.log('🔌 USB 장치 확인 시작...');
      const printerService = createPrinterService();

      if ('getUsbDevices' in printerService) {
        const devices = await (printerService as any).getUsbDevices();
        console.log('=== USB 장치 목록 ===');
        console.log('장치 수:', devices.length);

        if (devices.length === 0) {
          Alert.alert('USB 장치 없음', 'USB 프린터가 연결되어 있지 않습니다.');
        } else {
          let message = `총 ${devices.length}개의 USB 장치 발견:\n\n`;
          devices.forEach((device: any, index: number) => {
            console.log(
              `${index + 1}. ${device.deviceName || device.devicePath}`
            );
            message += `${index + 1}. ${device.deviceName || 'USB 장치'}\n`;
          });
          Alert.alert('USB 장치 확인', message);
        }
      }
    } catch (error) {
      console.error('❌ USB 확인 오류:', error);
      Alert.alert('오류', 'USB 장치 확인 중 오류가 발생했습니다.');
    }
  };

  // 프린터 테스트 함수
  const handlePrinterTest = async () => {
    setIsPrinting(true);
    try {
      console.log('🖨️ === 프린터 테스트 시작 ===');
      const printerService = createPrinterService();

      // USB 장치 목록 확인
      if ('getUsbDevices' in printerService) {
        const devices = await (printerService as any).getUsbDevices();
        console.log('🔌 USB 장치 목록:', devices);
        console.log('📊 장치 개수:', devices.length);
      }

      console.log('📝 프린터 테스트 출력 시도...');
      const result = await printerService.printTest();

      console.log('✅ 테스트 결과:', result);

      if (result.success) {
        console.log('✓ 프린터 테스트 성공');
        Alert.alert('성공', '프린터 테스트가 완료되었습니다!');
      } else {
        console.log('✗ 프린터 테스트 실패:', result.message);
        Alert.alert('실패', result.message || '프린터 테스트에 실패했습니다.');
      }
    } catch (error) {
      console.error('❌ 프린터 테스트 오류:', error);
      Alert.alert('오류', '프린터 테스트 중 오류가 발생했습니다.');
    } finally {
      setIsPrinting(false);
      console.log('🖨️ === 프린터 테스트 종료 ===');
    }
  };

  // 설정 메뉴 아이템들
  const settingMenuItems = [
    {
      id: 'menu',
      title: '메뉴 관리',
      description: '메뉴 등록, 수정, 삭제',
      icon: 'restaurant-outline' as const,
      onPress: () => {
        router.push('/menuManagement');
      },
    },
    {
      id: 'category',
      title: '카테고리 관리',
      description: '카테고리 추가, 수정, 삭제',
      icon: 'list-outline' as const,
      onPress: () => {
        router.push('/categoryManagement');
      },
    },
    {
      id: 'discount',
      title: '할인 관리',
      description: '할인 정책 설정 및 관리',
      icon: 'pricetag-outline' as const,
      onPress: () => {
        router.push('/discountManagement');
      },
    },
    {
      id: 'staff',
      title: '직원 관리',
      description: '직원 등록, 권한 설정, 근무 관리',
      icon: 'people-outline' as const,
      onPress: () => {
        router.push('/staffManagement');
      },
    },
    {
      id: 'usbCheck',
      title: 'USB 장치 확인',
      description: '연결된 USB 프린터 확인',
      icon: 'hardware-chip-outline' as const,
      onPress: handleCheckUsbDevices,
      isAction: true,
    },
    {
      id: 'printer',
      title: '프린터 테스트',
      description: 'USB 프린터 연결 및 출력 테스트',
      icon: 'print-outline' as const,
      onPress: handlePrinterTest,
      isAction: true,
    },
  ];

  return (
    <AdminProtectedRoute>
      <View className='h-full w-full bg-white flex flex-col'>
        <View className='flex-1 max-w-7xl mx-auto w-full'>
          {/* 헤더 섹션 */}
          <View className='w-full h-[80px] box-border px-[5%] mt-[25px] flex flex-row justify-between items-center'>
            <Text className='text-3xl font-bold text-gray-800'>설정</Text>
          </View>

          {/* 설정 컨텐츠 영역 */}
          <ScrollView className='flex-1 box-border px-[5%] py-4'>
            <View className='flex flex-col gap-5'>
              {settingMenuItems.map(item => (
                <TouchableOpacity
                  key={item.id}
                  className='bg-white border border-gray-200 rounded-xl p-6 shadow-sm active:bg-gray-50'
                  onPress={item.onPress}
                  disabled={item.id === 'printer' && isPrinting}
                >
                  <View className='flex-row items-center'>
                    {/* 아이콘 */}
                    <View className='w-12 h-12 bg-primaryGreen rounded-full justify-center items-center mr-4'>
                      {item.id === 'printer' && isPrinting ? (
                        <ActivityIndicator color='white' />
                      ) : (
                        <Ionicons name={item.icon} size={24} color='white' />
                      )}
                    </View>

                    {/* 텍스트 정보 */}
                    <View className='flex-1'>
                      <Text className='text-lg font-bold text-gray-800 mb-1'>
                        {item.title}
                      </Text>
                      <Text className='text-sm text-gray-500'>
                        {item.id === 'printer' && isPrinting
                          ? '프린터 테스트 중...'
                          : item.description}
                      </Text>
                    </View>

                    {/* 화살표 아이콘 (액션 버튼이 아닌 경우만) */}
                    {!(item as any).isAction && (
                      <Ionicons
                        name='chevron-forward-outline'
                        size={20}
                        color='#9CA3AF'
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* 추가 설정 섹션을 위한 여백 */}
            <View className='h-20' />
          </ScrollView>
        </View>
      </View>
    </AdminProtectedRoute>
  );
}
