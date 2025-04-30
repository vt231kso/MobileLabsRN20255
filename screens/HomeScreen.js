import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import * as FileSystem from 'expo-file-system';
import CreateItemModal from '../components/CreateItemModal';
import FileDetailsModal from '../components/FileDetailsModal';
import EditFileModal from "../components/EditFileModal";

export default function HomeScreen() {
  const [currentPath, setCurrentPath] = useState(FileSystem.documentDirectory + 'AppData/');
  const [items, setItems] = useState([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createType, setCreateType] = useState('file');
  const [fileDetailsVisible, setFileDetailsVisible] = useState(false);
  const [fileInfo, setFileInfo] = useState({});
  const [memoryStats, setMemoryStats] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [fileToEditPath, setFileToEditPath] = useState('');
  const [fileToEditContent, setFileToEditContent] = useState('');

  const APPDATA_PATH = FileSystem.documentDirectory + 'AppData/';

  useEffect(() => {
    const checkDirectory = async () => {
      const dirInfo = await FileSystem.getInfoAsync(APPDATA_PATH);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(APPDATA_PATH, { intermediates: true });
      }
      setCurrentPath(APPDATA_PATH);
      loadDirectoryContent(APPDATA_PATH);
      loadMemoryStats();
    };

    checkDirectory();
  }, []);

  const loadDirectoryContent = async (path) => {
    try {
      const files = await FileSystem.readDirectoryAsync(path);
      setItems(files);
    } catch (error) {
      console.error('Error reading directory:', error);
    }
  };

  const loadMemoryStats = async () => {
    const freeSpace = await FileSystem.getFreeDiskStorageAsync();
    const freeSpaceInGB = (freeSpace / (1024 ** 3)).toFixed(2);
    setMemoryStats(freeSpaceInGB);
  };

  const isInsideAppData = (path) => {
    return path.startsWith(APPDATA_PATH);
  };

  const handleCreateItem = async (path, name, content = '') => {
    const itemPath = `${path}${name}${createType === 'file' ? '.txt' : ''}`;
    if (!isInsideAppData(itemPath)) return;

    if (createType === 'file') {
      await FileSystem.writeAsStringAsync(itemPath, content);
    } else if (createType === 'folder') {
      await FileSystem.makeDirectoryAsync(itemPath);
    }
    loadDirectoryContent(currentPath);
  };

  const handleItemPress = async (itemName) => {
    const itemPath = currentPath + itemName;
    const itemInfo = await FileSystem.getInfoAsync(itemPath);

    if (itemInfo.isDirectory) {
      const newPath = itemPath + '/';
      if (isInsideAppData(newPath)) {
        setCurrentPath(newPath);
        loadDirectoryContent(newPath);
      }
    } else {
      handleViewDetails(itemName);
    }
  };

  const handleBackPress = () => {
    // Видаляємо останню частину шляху (поточну папку або файл)
    const withoutTrailingSlash = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath;
    const pathParts = withoutTrailingSlash.split('/');

    // Забезпечуємо, що не вийдемо вище AppData
    const appDataIndex = pathParts.findIndex(part => part === 'AppData');
    if (appDataIndex !== -1 && pathParts.length > appDataIndex + 1) {
      const parentParts = pathParts.slice(0, -1);
      const parentPath = parentParts.join('/') + '/';
      setCurrentPath(parentPath);
      loadDirectoryContent(parentPath);
    }
  };


  const handleDelete = async (itemName) => {
    const itemPath = currentPath + itemName;
    if (!isInsideAppData(itemPath)) return;

    const itemInfo = await FileSystem.getInfoAsync(itemPath);

    if (itemInfo.isDirectory) {
      await FileSystem.deleteAsync(itemPath, { idempotent: true });
    } else {
      await FileSystem.deleteAsync(itemPath);
    }
    loadDirectoryContent(currentPath);
  };

  const handleViewDetails = async (fileName) => {
    const filePath = currentPath + fileName;
    const fileInfo = await FileSystem.getInfoAsync(filePath);

    if (fileInfo.exists && !fileInfo.isDirectory) {
      const fileContent = await FileSystem.readAsStringAsync(filePath);
      setFileInfo({ ...fileInfo, content: fileContent, name: fileName });
      setFileDetailsVisible(true);
    } else if (fileInfo.isDirectory) {
      setFileInfo({ ...fileInfo, name: fileName });
      setFileDetailsVisible(true);
    }
  };

  const handleEditFile = async (fileName) => {
    const filePath = currentPath + fileName;
    const content = await FileSystem.readAsStringAsync(filePath);
    setFileToEditPath(filePath);
    setFileToEditContent(content);
    setEditModalVisible(true);
  };

  const handleSaveEditedFile = async (filePath, newContent) => {
    if (!isInsideAppData(filePath)) return;
    await FileSystem.writeAsStringAsync(filePath, newContent);
    setEditModalVisible(false);
    loadDirectoryContent(currentPath);
  };

  const FolderOrFileButton = ({ item }) => {
    const [isDirectory, setIsDirectory] = useState(null);

    useEffect(() => {
      const checkIfDirectory = async () => {
        const itemPath = currentPath + item;
        const info = await FileSystem.getInfoAsync(itemPath);
        setIsDirectory(info.isDirectory);
      };
      checkIfDirectory();
    }, []);

    const icon = isDirectory ? '📁 ' : '📄 ';

    return (
      <View style={{ marginVertical: 5 }}>
        <Button title={icon + item} onPress={() => handleItemPress(item)} />
        <Button title="Деталі" onPress={() => handleViewDetails(item)} />
        <Button title="Видалити" onPress={() => handleDelete(item)} />
        {!isDirectory && <Button title="Редагувати" onPress={() => handleEditFile(item)} />}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Поточний шлях: {currentPath}</Text>
      <Button title="Назад" onPress={handleBackPress} />
      <Text>Вільна пам'ять: {memoryStats} GB</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <FolderOrFileButton item={item} />}
      />

      <Button title="Створити файл" onPress={() => { setCreateType('file'); setCreateModalVisible(true); }} />
      <Button title="Створити папку" onPress={() => { setCreateType('folder'); setCreateModalVisible(true); }} />

      <CreateItemModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onCreate={handleCreateItem}
        type={createType}
        currentPath={currentPath}
      />
      <FileDetailsModal
        visible={fileDetailsVisible}
        onClose={() => setFileDetailsVisible(false)}
        fileInfo={fileInfo}
      />
      <EditFileModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        filePath={fileToEditPath}
        initialContent={fileToEditContent}
        onSave={handleSaveEditedFile}
      />
    </View>
  );
}
