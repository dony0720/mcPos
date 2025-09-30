/**
 * 프린터 테스트 컴포넌트
 * - 프린터 연결 상태 확인
 * - 프린터 연결/해제 테스트
 * - 테스트 출력 기능
 * - 실제 영수증 출력 테스트
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';

import { usePrinter } from '../../hooks';
import {
  CashInspectionReceiptData,
  OrderReceiptData,
  PrinterStatus,
} from '../../types';

export default function PrinterTestScreen() {
  const {
    connectPrinter,
    disconnectPrinter,
    printOrderReceipt,
    printCashInspection,
    printTest,
    isConnected,
    isConnecting,
    isPrinting,
    lastError,
    refreshStatus,
  } = usePrinter();

  const [deviceInfo, setDeviceInfo] = useState<any>(null);

  // 컴포넌트 마운트 시 상태 새로고침
  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  // 프린터 연결 핸들러
  const handleConnect = async () => {
    const success = await connectPrinter();
    if (success) {
      Alert.alert('성공', '프린터 연결에 성공했습니다!');
    } else {
      Alert.alert('실패', lastError || '프린터 연결에 실패했습니다.');
    }
  };

  // 프린터 연결 해제 핸들러
  const handleDisconnect = async () => {
    const success = await disconnectPrinter();
    if (success) {
      Alert.alert('성공', '프린터 연결이 해제되었습니다.');
    } else {
      Alert.alert('실패', lastError || '프린터 연결 해제에 실패했습니다.');
    }
  };

  // 테스트 출력 핸들러
  const handleTestPrint = async () => {
    if (!isConnected) {
      Alert.alert('오류', '프린터가 연결되지 않았습니다.');
      return;
    }

    Alert.alert('테스트 출력', '테스트 영수증을 출력하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '출력',
        onPress: async () => {
          const success = await printTest();
          if (success) {
            Alert.alert('성공', '테스트 출력이 완료되었습니다!');
          } else {
            Alert.alert('실패', lastError || '테스트 출력에 실패했습니다.');
          }
        },
      },
    ]);
  };

  // 주문 영수증 테스트 출력
  const handleOrderReceiptTest = async () => {
    if (!isConnected) {
      Alert.alert('오류', '프린터가 연결되지 않았습니다.');
      return;
    }

    const testOrderData: OrderReceiptData = {
      header: {
        storeName: 'MC POS 테스트',
        title: '주문 영수증 테스트',
        dateTime: new Date().toLocaleString('ko-KR'),
        transactionId: '#TEST001',
      },
      orderItems: [
        {
          name: '아메리카노',
          quantity: 2,
          unitPrice: 3000,
          totalPrice: 6000,
          options: ['ICE', '샷추가'],
        },
        {
          name: '카페라떼',
          quantity: 1,
          unitPrice: 3500,
          totalPrice: 3500,
          options: ['HOT'],
          discount: {
            name: '직원할인',
            amount: 500,
          },
        },
      ],
      summary: {
        totalAmount: 9000,
        subtotal: 9500,
        discountAmount: 500,
        finalAmount: 9000,
        paymentMethod: '현금',
      },
      footer: {
        pickupNumber: 'T001',
        orderMethod: '테이크아웃',
      },
    };

    Alert.alert('주문 영수증 테스트', '주문 영수증을 출력하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '출력',
        onPress: async () => {
          const success = await printOrderReceipt(testOrderData);
          if (success) {
            Alert.alert('성공', '주문 영수증 출력이 완료되었습니다!');
          } else {
            Alert.alert('실패', lastError || '주문 영수증 출력에 실패했습니다.');
          }
        },
      },
    ]);
  };

  // 현금 점검 영수증 테스트 출력
  const handleCashInspectionTest = async () => {
    if (!isConnected) {
      Alert.alert('오류', '프린터가 연결되지 않았습니다.');
      return;
    }

    const testCashData: CashInspectionReceiptData = {
      header: {
        storeName: 'MC POS 테스트',
        title: '현금 입금 영수증 테스트',
        dateTime: new Date().toLocaleString('ko-KR'),
        transactionId: '#CASH001',
      },
      cashData: [
        { denomination: '50,000원', quantity: 2, amount: 100000 },
        { denomination: '10,000원', quantity: 5, amount: 50000 },
        { denomination: '5,000원', quantity: 3, amount: 15000 },
        { denomination: '1,000원', quantity: 10, amount: 10000 },
      ],
      summary: {
        totalAmount: 175000,
        inspector: '관리자',
      },
    };

    Alert.alert('현금 점검 테스트', '현금 점검 영수증을 출력하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '출력',
        onPress: async () => {
          const success = await printCashInspection(testCashData);
          if (success) {
            Alert.alert('성공', '현금 점검 영수증 출력이 완료되었습니다!');
          } else {
            Alert.alert('실패', lastError || '현금 점검 영수증 출력에 실패했습니다.');
          }
        },
      },
    ]);
  };

  // 상태 새로고침 핸들러
  const handleRefresh = () => {
    refreshStatus();
    Alert.alert('새로고침', '프린터 상태가 새로고침되었습니다.');
  };

  return (
    <ScrollView className='flex-1 bg-white p-5'>
      <View className='mb-6'>
        <Text className='text-2xl font-bold mb-2'>프린터 테스트</Text>
        <Text className='text-gray-600'>Sewoo SLK-TS100 USB 프린터 테스트</Text>
      </View>

      {/* 프린터 상태 카드 */}
      <View className='bg-gray-50 rounded-lg p-4 mb-6'>
        <View className='flex-row items-center mb-3'>
          <Ionicons
            name={isConnected ? 'checkmark-circle' : 'close-circle'}
            size={24}
            color={isConnected ? '#10B981' : '#EF4444'}
          />
          <Text className='ml-2 text-lg font-semibold'>
            프린터 상태: {isConnected ? '연결됨' : '연결 안됨'}
          </Text>
        </View>

        {isConnecting && (
          <View className='flex-row items-center mb-2'>
            <ActivityIndicator size='small' color='#3B82F6' />
            <Text className='ml-2 text-blue-600'>연결 중...</Text>
          </View>
        )}

        {isPrinting && (
          <View className='flex-row items-center mb-2'>
            <ActivityIndicator size='small' color='#F59E0B' />
            <Text className='ml-2 text-orange-600'>출력 중...</Text>
          </View>
        )}

        {lastError && (
          <View className='bg-red-100 p-3 rounded-lg mb-2'>
            <Text className='text-red-700 text-sm'>{lastError}</Text>
          </View>
        )}
      </View>

      {/* 연결 제어 버튼들 */}
      <View className='mb-6'>
        <Text className='text-lg font-semibold mb-3'>연결 제어</Text>
        <View className='flex-row gap-3'>
          <Pressable
            onPress={handleConnect}
            disabled={isConnected || isConnecting}
            className={`flex-1 py-3 px-4 rounded-lg items-center ${
              isConnected || isConnecting
                ? 'bg-gray-300'
                : 'bg-blue-500'
            }`}
          >
            <View className='flex-row items-center'>
              <Ionicons 
                name='link' 
                size={18} 
                color={isConnected || isConnecting ? '#9CA3AF' : 'white'} 
              />
              <Text
                className={`ml-2 font-medium ${
                  isConnected || isConnecting ? 'text-gray-500' : 'text-white'
                }`}
              >
                연결
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={handleDisconnect}
            disabled={!isConnected}
            className={`flex-1 py-3 px-4 rounded-lg items-center ${
              !isConnected ? 'bg-gray-300' : 'bg-red-500'
            }`}
          >
            <View className='flex-row items-center'>
              <Ionicons 
                name='unlink' 
                size={18} 
                color={!isConnected ? '#9CA3AF' : 'white'} 
              />
              <Text
                className={`ml-2 font-medium ${
                  !isConnected ? 'text-gray-500' : 'text-white'
                }`}
              >
                해제
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      {/* 테스트 출력 버튼들 */}
      <View className='mb-6'>
        <Text className='text-lg font-semibold mb-3'>테스트 출력</Text>
        <View className='gap-3'>
          <Pressable
            onPress={handleTestPrint}
            disabled={!isConnected || isPrinting}
            className={`py-3 px-4 rounded-lg items-center ${
              !isConnected || isPrinting ? 'bg-gray-300' : 'bg-green-500'
            }`}
          >
            <View className='flex-row items-center'>
              <Ionicons 
                name='print' 
                size={18} 
                color={!isConnected || isPrinting ? '#9CA3AF' : 'white'} 
              />
              <Text
                className={`ml-2 font-medium ${
                  !isConnected || isPrinting ? 'text-gray-500' : 'text-white'
                }`}
              >
                기본 테스트 출력
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={handleOrderReceiptTest}
            disabled={!isConnected || isPrinting}
            className={`py-3 px-4 rounded-lg items-center ${
              !isConnected || isPrinting ? 'bg-gray-300' : 'bg-purple-500'
            }`}
          >
            <View className='flex-row items-center'>
              <Ionicons 
                name='receipt' 
                size={18} 
                color={!isConnected || isPrinting ? '#9CA3AF' : 'white'} 
              />
              <Text
                className={`ml-2 font-medium ${
                  !isConnected || isPrinting ? 'text-gray-500' : 'text-white'
                }`}
              >
                주문 영수증 테스트
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={handleCashInspectionTest}
            disabled={!isConnected || isPrinting}
            className={`py-3 px-4 rounded-lg items-center ${
              !isConnected || isPrinting ? 'bg-gray-300' : 'bg-orange-500'
            }`}
          >
            <View className='flex-row items-center'>
              <Ionicons 
                name='cash' 
                size={18} 
                color={!isConnected || isPrinting ? '#9CA3AF' : 'white'} 
              />
              <Text
                className={`ml-2 font-medium ${
                  !isConnected || isPrinting ? 'text-gray-500' : 'text-white'
                }`}
              >
                현금 점검 영수증 테스트
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      {/* 유틸리티 버튼들 */}
      <View>
        <Text className='text-lg font-semibold mb-3'>유틸리티</Text>
        <Pressable
          onPress={handleRefresh}
          className='py-3 px-4 rounded-lg items-center bg-gray-500'
        >
          <View className='flex-row items-center'>
            <Ionicons name='refresh' size={18} color='white' />
            <Text className='ml-2 font-medium text-white'>상태 새로고침</Text>
          </View>
        </Pressable>
      </View>

      {/* 개발자 정보 */}
      <View className='mt-8 p-4 bg-blue-50 rounded-lg'>
        <Text className='text-blue-800 font-semibold mb-2'>개발자 정보</Text>
        <Text className='text-blue-700 text-sm'>
          • 프린터: Sewoo SLK-TS100{'\n'}
          • 연결: USB B타입 (USB OTG){'\n'}
          • 프로토콜: ESC/POS 명령어{'\n'}
          • 라이브러리: react-native-usb-serialport-for-android
        </Text>
      </View>
    </ScrollView>
  );
}