import React from 'react';
import { Modal, View, Text, Button, ScrollView } from 'react-native';

export default function FileDetailsModal({ visible, onClose, fileInfo }) {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Деталі</Text>
        <Text style={{ marginVertical: 5 }}>Ім'я: {fileInfo.name}</Text>
        <Text style={{ marginVertical: 5 }}>Шлях: {fileInfo.uri}</Text>
        <Text style={{ marginVertical: 5 }}>Розмір: {fileInfo.size} байт</Text>
        <Text style={{ marginVertical: 5 }}>Чи директорія: {fileInfo.isDirectory ? 'Так' : 'Ні'}</Text>

        {fileInfo.modificationTime && (
          <Text style={{ marginVertical: 5 }}>
            Остання зміна: {new Date(fileInfo.modificationTime * 1000).toLocaleString()}
          </Text>
        )}

        {!fileInfo.isDirectory && fileInfo.content !== undefined && (
          <>
            <Text style={{ marginTop: 15, fontWeight: 'bold' }}>Вміст файлу:</Text>
            <ScrollView style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginTop: 5, height: 200 }}>
              <Text selectable>{fileInfo.content}</Text>
            </ScrollView>
          </>
        )}

        <Button title="Закрити" onPress={onClose} />
      </View>
    </Modal>
  );
}
