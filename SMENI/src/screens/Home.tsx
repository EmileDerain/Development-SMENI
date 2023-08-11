import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import colors from '../assets/colors/colors';

const Home = () => {
  return (
    <KeyboardAwareScrollView style={styles.container}>
      {/* En-tête */}
      <SafeAreaView style={styles.header}>
        <Text style={styles.headerText}>Welcome to SMENI Application!</Text>
      </SafeAreaView>

      {/* Contenu */}
      <SafeAreaView style={styles.content}>
        <Text style={styles.contentText}>This page is still in development.</Text>
      </SafeAreaView>

      {/* Pied de page */}
      <SafeAreaView style={styles.footer}>
        <Text style={styles.footerText}>© 2023 SMENI</Text>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: 'pink',
    padding: 16,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  contentText: {
    fontSize: 16,
    color: colors.default,
    },

  footer: {
    padding: 8,
    alignItems: 'center',
  },
  footerText: {
    color: colors.textLight,
  },
});

export default Home;
