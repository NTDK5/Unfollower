import { InstagramJSON } from '@/types';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useState } from 'react';

export function useFileUpload(){
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const pickFile = async(): promise<InstagramJson | null> => {
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

            const fileUri = result.assets?.[0]?.uri;
            const fileContent = await FileSystem.readAsStringAsync(fileUri);
            const jsonData: InstagramJSON = JSON.parse(fileContent);
            return jsonData;
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