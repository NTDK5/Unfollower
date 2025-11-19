import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export async function exportListToFile(
  usernames: string[],
  filename: string
): Promise<void> {
  const content = usernames.join('\n');
  const fileUri = FileSystem.documentDirectory + filename;

  try {
    await FileSystem.writeAsStringAsync(fileUri, content, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    } else {
      console.log('Sharing not available. File saved to:', fileUri);
    }
  } catch (error) {
    console.error('Error exporting file:', error);
    throw error;
  }
}