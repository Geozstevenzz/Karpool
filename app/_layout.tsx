import React, { useState } from 'react';
import { Stack, usePathname, Slot } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Layout = () => {
 
  return (
    <SafeAreaView style={styles.container}>   
      
      <Stack 
        screenOptions={{
            headerShown: false,
            contentStyle: { flex: 1, backgroundColor: 'white' },
          }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Layout;
