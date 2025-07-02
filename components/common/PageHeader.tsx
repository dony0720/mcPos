import React from "react";
import { View } from "react-native";
import McPosLogo from "../../assets/icon/mcPosLogo.svg";

interface PageHeaderProps {
  children?: React.ReactNode;
}

export default function PageHeader({ children }: PageHeaderProps) {
  return (
    <View className="w-full h-[80px] box-border mt-[25px] flex flex-row justify-between items-center">
      <McPosLogo width={150} height={150} />
      {children && <View>{children}</View>}
    </View>
  );
}
