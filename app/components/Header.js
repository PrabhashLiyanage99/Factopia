import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FontAwesome, Ionicons } from 'react-native-vector-icons'; 

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/AppLogo.png')}
          style={styles.logo}
        />
        <Text style={styles.appName}>Factopia</Text>
      </View>
      <View style={styles.iconsContainer}>
        <TouchableOpacity
          onPress={() => console.log('Profile clicked')}
          activeOpacity={0.7}
          style={styles.iconTouchable}
        >
          <FontAwesome name="user" size={24} color="white" /> 
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => console.log('Notifications clicked')}
          activeOpacity={0.7}
          style={styles.iconTouchable}
        >
          <Ionicons name="notifications-outline" size={24} color="white" /> 
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
    elevation: 4, 
    shadowColor: '#000', 
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
  iconTouchable: {
    marginLeft: 16,
    padding: 8,
    borderRadius: 8,
    color: '#FFA500'
  
  },
});

export default Header;
