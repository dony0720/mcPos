import React from 'react';
import { View } from 'react-native';

import McPos from '../../assets/icon/McPos.svg';

export default function PageHeader() {
  return (
    <View className='w-full h-[80px] mt-[25px] flex flex-row justify-between items-center '>
      <McPos width={100} height={100} />
    </View>
  );
}
