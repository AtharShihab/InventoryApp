import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './src/LoginScreen';
import ProductScreen from './src/ProductScreen';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLoginState();
  }, []);

  const checkLoginState = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@user');
      if (storedUser !== null) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to load user from storage', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (loggedInUser) => {
    try {
      await AsyncStorage.setItem('@user', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
    } catch (e) {
      console.error('Failed to save user to storage', e);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('@user');
      setUser(null);
    } catch (e) {
      console.error('Failed to remove user from storage', e);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {user ? (
        <ProductScreen user={user} onLogout={handleLogout} />
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});