import React from "react";
import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Tab One",
          headerRight: () => <Text>Hello</Text>,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "Tab Two",
        }}
      />
    </Tabs>
  );
}
