import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface MenuItemProps {
  id: number;
  name: string;
  price: string;
  onPress: () => void;
}

export default function MenuItem({ id, name, price, onPress }: MenuItemProps) {
  return (
    <View key={id} className='w-1/4 pr-3 pl-0 box-border'>
      <TouchableOpacity onPress={onPress} className='w-full'>
        <View className='w-full flex flex-col rounded-lg gap-2'>
          <View className='overflow-hidden rounded-lg aspect-square'>
            <Image
              source={require('../../assets/images/coffeeTest.png')}
              className='w-full h-full'
              resizeMode='cover'
            />
          </View>
          <View className='px-1'>
            <Text className='font-medium text-base'>{name}</Text>
            <Text className='text-gray-600 text-sm mt-1'>{price}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
