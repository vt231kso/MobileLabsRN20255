// /components/FileList.js
import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { getFileInfo, deleteItem } from '../utils/fileHelpers';

export default function FileList({ items, onPressItem, currentPath, refreshList, showDetails }) {
  const handleDelete = (item) => {
    Alert.alert(
      'Підтвердження видалення',
      `Ви впевнені, що хочете видалити "${item.name}"?`,
      [
        { text: 'Скасувати', style: 'cancel' },
        {
          text: 'Видалити',
          style: 'destructive',
          onPress: async () => {
            await deleteItem(currentPath + item.name);
            refreshList();
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity style={styles.item} onPress={() => onPressItem(item)}>
        <Text style={item.isDirectory ? styles.folder : styles.file}>
          {item.name}
        </Text>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={() => showDetails(currentPath + item.name)}>
          <Text style={styles.buttonText}>ℹ️</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => handleDelete(item)}>
          <Text style={styles.buttonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.name}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    paddingHorizontal: 8,
  },
  item: {
    flex: 1,
  },
  folder: {
    fontWeight: 'bold',
    color: '#0077cc',
  },
  file: {
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  buttonText: {
    fontSize: 18,
  },
});
