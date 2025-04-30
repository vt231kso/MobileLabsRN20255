// components/CreateItemModal.js
import { Modal, View, TextInput, Button, Text } from 'react-native';
import { useState } from 'react';

export default function CreateItemModal({ visible, onClose, onCreate, type, currentPath }) {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  const handleCreate = () => {
    // Якщо це файл, передаємо поточний шлях, назву і вміст
    if (type === 'file') {
      onCreate(currentPath, name, content);
    }
    // Якщо це папка, передаємо поточний шлях і назву папки
    else if (type === 'folder') {
      onCreate(currentPath, name);
    }
    setName('');
    setContent('');
    onClose(); // Закриваємо модальне вікно після створення
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={{ flex: 1, padding: 20 }}>
        <Text>Назва {type === 'folder' ? 'папки' : 'файлу'}:</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={{ borderWidth: 1, marginBottom: 10 }}
        />
        {type === 'file' && (
          <>
            <Text>Вміст файлу:</Text>
            <TextInput
              value={content}
              onChangeText={setContent}
              style={{ borderWidth: 1, height: 100 }}
              multiline
            />
          </>
        )}
        <Button title="Створити" onPress={handleCreate} />
        <Button title="Скасувати" onPress={onClose} />
      </View>
    </Modal>
  );
}
