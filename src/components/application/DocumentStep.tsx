import { FileText, Upload } from 'lucide-react-native';
import React from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { colors } from '../../theme/colors';
import { DocumentUpload, FormData } from '../../types/applicationTypes';
import { formatFileSize } from '../../utils/applicationUtils';
import { handleDocumentUpload, showRemoveDocumentAlert } from '../../utils/documentUtils';

interface DocumentStepProps {
  formData: FormData;
  updateDocument: (documentType: keyof FormData['documents'], document: DocumentUpload) => void;
}

export const DocumentStep: React.FC<DocumentStepProps> = ({
  formData,
  updateDocument,
}) => {
  const onDocumentUpload = async (documentType: keyof FormData['documents']) => {
    const result = await handleDocumentUpload();
    if (result) {
      updateDocument(documentType, result);
      Alert.alert(
        'Upload Successful',
        `${result.fileName} has been uploaded successfully.`,
        [{ text: 'OK' }]
      );
    }
  };

  const onRemoveDocument = (documentType: keyof FormData['documents']) => {
    const document = formData.documents[documentType];
    if (document.fileName) {
      showRemoveDocumentAlert(document.fileName, () => {
        updateDocument(documentType, { uploaded: false });
      });
    }
  };

  const renderDocumentUploadItem = (
    title: string,
    description: string,
    documentType: keyof FormData['documents'],
    isRequired: boolean = true
  ) => {
    const document = formData.documents[documentType];
    
    return (
      <View style={styles.documentItem}>
        <View style={styles.documentHeader}>
          <Text style={styles.documentTitle}>
            {title} {isRequired && '*'}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.uploadArea,
            document.uploaded && styles.uploadAreaUploaded
          ]}
          onPress={() => onDocumentUpload(documentType)}
          activeOpacity={0.7}
        >
          {!document.uploaded ? (
            <>
              <View style={styles.uploadIcon}>
                <Upload size={32} color={colors.textSecondary} strokeWidth={2.67} />
              </View>
              
              <Text style={styles.uploadText}>{description}</Text>
              
              <View style={styles.uploadButtonContainer}>
                <View style={styles.uploadButton}>
                  <Text style={styles.uploadButtonText}>UPLOAD FILE</Text>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.uploadedContainer}>
              <View style={styles.uploadedIcon}>
                <FileText size={32} color={colors.success} strokeWidth={2} />
              </View>
              
              <Text style={styles.uploadedFileName}>{document.fileName}</Text>
              
              {document.size && (
                <Text style={styles.uploadedFileSize}>
                  {formatFileSize(document.size)}
                </Text>
              )}
              
              <View style={styles.uploadedActions}>
                <TouchableOpacity 
                  style={styles.replaceButton}
                  onPress={() => onDocumentUpload(documentType)}
                >
                  <Text style={styles.replaceButtonText}>REPLACE</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => onRemoveDocument(documentType)}
                >
                  <Text style={styles.removeButtonText}>REMOVE</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.documentFormContainer}>
      <Text style={styles.documentFormTitle}>Documents</Text>
      
      <View style={styles.documentsList}>
        {renderDocumentUploadItem(
          'PSA/NSO Birth Certificate',
          'Click to upload birth certificate',
          'birthCertificate'
        )}
        
        {renderDocumentUploadItem(
          'Transcript of Records/Copy of Grades',
          'Click to upload transcript',
          'transcript'
        )}
        
        {renderDocumentUploadItem(
          "Copy of Student's ID",
          'Upload student identification',
          'studentId'
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  documentFormContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    marginBottom: 16,
  },
  documentFormTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 30,
  },
  documentsList: {
    gap: 24,
  },
  documentItem: {
    gap: 16,
  },
  documentHeader: {
    height: 24,
    justifyContent: 'center',
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 24,
  },
  uploadArea: {
    height: 154,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    position: 'relative',
  },
  uploadIcon: {
    width: 32,
    height: 32,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  uploadButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButton: {
    height: 36,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.35,
    lineHeight: 20,
  },
  uploadAreaUploaded: {
    backgroundColor: colors.gray[50],
    borderColor: colors.success,
  },
  uploadedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  uploadedIcon: {
    width: 32,
    height: 32,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadedFileName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
    paddingHorizontal: 16,
  },
  uploadedFileSize: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  uploadedActions: {
    flexDirection: 'row',
    gap: 12,
  },
  replaceButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  replaceButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.35,
  },
  removeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 6,
  },
  removeButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.error,
    textTransform: 'uppercase',
    letterSpacing: 0.35,
  },
});