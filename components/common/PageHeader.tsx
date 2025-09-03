import React from 'react';
import { View } from 'react-native';

import McPos from '../../assets/icon/McPos.svg';

interface PageHeaderProps {
  children?: React.ReactNode;
}

export default function PageHeader({ children }: PageHeaderProps) {
  return (
    <View className='w-full h-[80px] box-border mt-[25px] flex flex-row justify-between items-center'>
      <McPos width={100} height={100} />
      {children && <View>{children}</View>}
    </View>
  );
}
