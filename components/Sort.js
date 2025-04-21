import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

const Sort = ({ onSort }) => {
  const handleSort = (criteria) => {
    onSort(criteria);
  };

  return (
    <View style={styles.sortContainer}>
      <Button title="Sort by Price" onPress={() => handleSort('price')} />
      <Button title="Sort by Store" onPress={() => handleSort('store')} />
    </View>
  );
};

const styles = StyleSheet.create({
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});

export default Sort;
