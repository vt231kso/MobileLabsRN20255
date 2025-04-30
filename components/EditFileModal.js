// components/EditFileModal.js
import React, { useState, useEffect } from 'react';
import { Modal, View, TextInput, Button, Text } from 'react-native';

export default function EditFileModal({ visible, onClose, filePath, initialContent, onSave }) {
  const [content, setContent] = useState('');

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSave = () => {
    onSave(filePath, content);
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ marginBottom: 10, fontSize: 16 }}>Редагування файлу:</Text>
        <TextInput
          style={{
            flex: 1,
            borderColor: 'gray',
            borderWidth: 1,
            padding: 10,
            textAlignVertical: 'top'
          }}
          multiline
          value={content}
          onChangeText={setContent}
        />
        <Button title="Зберегти" onPress={handleSave} />
        <Button title="Скасувати" onPress={onClose} color="red" />
      </View>
    </Modal>
  );
}
