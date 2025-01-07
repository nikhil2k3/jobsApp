import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const JobCard = ({ item, onBookmark }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.location}</Text>
      <Text>{item.salary}</Text>
      <Text>{item.phone}</Text>
      <Button title="Bookmark" onPress={() => onBookmark(item)} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: 'white',
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default JobCard;
