import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Header: React.FC = () => {
  return (
    <View style={styles.headerContainer}>
      {/* App Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/AppLogo.png')}
          style={styles.logo}
        />
        <Text style={styles.appName}>Factopia</Text> 
      </View>

      {/* Profile and Notification Icons */}
      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={() => console.log('Profile clicked')}>
          <Ionicons name="person-circle" size={30} color="#FFA500" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Notifications clicked')}>
          <Ionicons name="notifications" size={30} color="#FFA500" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 16,
    elevation: 4, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 8,
  },
  appName: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#FFA500',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 16,
  },
});

export default Header;
