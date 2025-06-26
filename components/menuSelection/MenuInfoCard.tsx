import React from 'react';
import { Image, Text, View } from 'react-native';

import QuantitySelector from './QuantitySelector';

/**
 * 메뉴 정보 카드 컴포넌트
 * - 메뉴의 이미지, 이름, 가격 정보와 수량 선택 기능을 제공
 */

// Props 인터페이스
interface MenuInfoCardProps {
  menuItem: {
    id: number;
    name: string;
    price: string;
  };
  quantity: number;
  setQuantity: (quantity: number) => void;
}

export default function MenuInfoCard({
  menuItem,
  quantity,
  setQuantity,
}: MenuInfoCardProps) {
  return (
    <View className='flex-row mb-6'>
      {/* 메뉴 이미지 섹션 */}
      <View className='w-36 h-36 rounded-lg overflow-hidden mr-4'>
        <Image
          source={require('../../assets/images/coffeeTest.png')}
          className='w-full h-full'
          resizeMode='cover'
        />
      </View>

      {/* 메뉴 정보 및 수량 선택 섹션 */}
      <View className='flex-1 justify-between'>
        {/* 메뉴 기본 정보 */}
        <View className='flex-1 gap-3'>
          <Text className='text-xl font-semibold'>{menuItem.name}</Text>
          <Text className='text-gray-600 text-lg'>{menuItem.price}</Text>
        </View>

        {/* 수량 선택 컨트롤 */}
        <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
      </View>
    </View>
  );
}
