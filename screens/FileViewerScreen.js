// screens/FileViewerScreen.js
import { useState, useEffect } from 'react';
import { TextInput, Button, View } from 'react-native';
import * as FileSystem from 'expo-file-system';

export default function FileViewerScreen({ route, navigation }) {
  const { fileUri, fileName } = route.params;
  const [content, setContent] = useState('');

  useEffect(() => {
    FileSystem.readAsStringAsync(fileUri).then(setContent);
  }, []);

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <TextInput multiline style={{ flex: 1, borderWidth: 1, padding: 5 }} value={content} onChangeText={setContent} />
      <Button title="💾 Зберегти" onPress={() => FileSystem.writeAsStringAsync(fileUri, content)} />
    </View>
  );
}
