import { InstagramJSON } from '@/types';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { useState } from 'react';

export interface FileUploadResult {
    data: InstagramJSON;
    filename: string;
}

export function useFileUpload(){
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const pickFile = async(): Promise<FileUploadResult | null> => {
        try{
            setLoading(true);
            setError(null)

            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/json',
                copyToCacheDirectory:true,
            });

            if(result.canceled){
                return null;
            }

            const fileAsset = result.assets?.[0];
            if(!fileAsset){
                return null;
            }

            const fileUri = fileAsset.uri;
            const fileName = fileAsset.name || 'file.json';
            const fileContent = await FileSystem.readAsStringAsync(fileUri);
            const jsonData: InstagramJSON = JSON.parse(fileContent);
            
            return {
                data: jsonData,
                filename: fileName,
            };
        }catch(err){
            const errorMessage = err instanceof Error ? err.message: 'Failed to read file';
            setError(errorMessage)
            return null;
        }finally{
            setLoading(false);
        }
    }
    return { pickFile, loading, error };
}