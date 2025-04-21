import React, { useState } from 'react';
import { TextInput, StyleSheet } from 'react-native';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (text) => {
    setQuery(text);
    onSearch(text);
  };

  return (
    <TextInput
      style={styles.searchBar}
      placeholder="Search for products..."
      value={query}
      onChangeText={handleSearch}
    />
  );
};

const styles = StyleSheet.create({
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 8,
  },
});

export default SearchBar;
