import React from 'react';
import { View } from 'react-native';

import McPosLogo from '../../assets/icon/mcPosLogo.svg';

export default function PageHeader() {
  return (
    <View className='w-full h-[80px] mt-[25px] flex flex-row justify-between items-center '>
      <McPosLogo width={150} height={150} />
    </View>
  );
}
