import * as DocumentPicker from 'expo-document-picker';
import { Alert } from 'react-native';
import { DocumentUpload } from '../types/applicationTypes';

export const handleDocumentUpload = async (): Promise<DocumentUpload | null> => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      
      // Check file size (limit to 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size && file.size > maxSize) {
        Alert.alert(
          'File Too Large',
          'Please select a file smaller than 10MB.',
          [{ text: 'OK' }]
        );
        return null;
      }

      return {
        uploaded: true,
        fileName: file.name,
        uri: file.uri,
        size: file.size,
        mimeType: file.mimeType,
      };
    }
    return null;
  } catch (error) {
    console.error('Error picking document:', error);
    Alert.alert(
      'Upload Error',
      'There was an error selecting the file. Please try again.',
      [{ text: 'OK' }]
    );
    return null;
  }
};

export const showRemoveDocumentAlert = (
  fileName: string, 
  onConfirm: () => void
): void => {
  Alert.alert(
    'Remove Document',
    `Are you sure you want to remove ${fileName}?`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: onConfirm
      }
    ]
  );
};