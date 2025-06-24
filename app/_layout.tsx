import '../global.css';

import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }} />
      {/* <Stack.Screen name="Details" component={DetailsScreen} /> */}
    </Stack>
  );
}
