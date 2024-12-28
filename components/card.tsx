import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Card: React.FC<{ title: string; content: string[] }> = ({ title, content }) => {
  return (
    <View style={cardStyles.card}>
      <Text style={cardStyles.title}>{title}</Text>
      {content.map((item, index) => (
        <Text key={index} style={cardStyles.content}>
          {item}
        </Text>
      ))}
    </View>
  );
};

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    width: '90%',
    elevation: 4, // Adds shadow for Android
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  content: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
});

export default Card;
