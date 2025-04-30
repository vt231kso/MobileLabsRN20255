// utils/fileHelpers.js
import * as FileSystem from 'expo-file-system';

export const APP_DATA_DIR = FileSystem.documentDirectory + 'AppData/';

export async function ensureAppDataDirExists() {
  const dirInfo = await FileSystem.getInfoAsync(APP_DATA_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(APP_DATA_DIR, { intermediates: true });
  }
}
