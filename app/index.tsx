import { useFileUpload } from '@/hooks/useFileUpload';
import { extractUsernames } from '@/utils/jsonParser';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, View } from 'react-native';
// import { FileUploadButton } from '@/components/FileUploadButton';
import { InstagramJSON } from '@/types';


export default function HomeScreen(){
    const router = useRouter();
    const {pickFile, loading, error} = useFileUpload();
    const [ followingFile, setFollowingFile] = useState<InstagramJSON | null>(null);
    const [ followersFile, setFollowersFile] = useState<InstagramJSON | null>(null);

    const handleFolllowingUpload = async () => {
        const file = await pickFile();

        if(file){
            setFollowingFile(file);
    }
};

    const handleFollowersUpload = async() =>{
        const file = await pickFile();

        if(file){
            setFollowersFile(file);
        }
    };
    const handleCompare = () =>{
        if(!followingFile || !followersFile){
            Alert.alert('Error', 'Please Upload both files first before comparing');
            return;
        }

        const following = extractUsernames(followingFile, 'following');
        const followers = extractUsernames(followersFile, 'followers');

        if(following.length === 0 || followers.length === 0){
            Alert.alert('Error', 'No usernames found in the files');
            return;
        }
        router.push({
            pathname: '/results' as any,
            params: {
                following: JSON.stringify(following),
                followers: JSON.stringify(followers),
            }
        })
    }


    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Unfollower</Text>
                <Text style = {styles.subtitle}>Compare Your Instagram Followers and Following </Text>
            

            <View style={styles.uploadSection}>
                <Text style= {styles.label}>
                    Following List
                </Text>
                {/* <FileUploadButton 
                    onPress={handleFolllowingUpload}
                    loading={loading}
                    fileName= {followingFile ? 'following file loaded' : 'upload Following JSON'}

                /> */}
                <Text style={styles.label} >
                    Followers List 
                </Text>
                {/* <FileUploadButton  
                    onPress={handleFolllowingUpload}
                    loading={loading}
                    fileName = {followersFile ? 'Followers file loaded' : 'Upload Following Json'}

                /> */}

            </View>
            
            <View style = {styles.buttonContainer}>
                <Button 
                    title = 'compare Lists'
                    onPress = {handleCompare}
                    disabled = {!followingFile || !followersFile || loading}
                />
            </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 32,
    },
    uploadSection: {
        marginBottom: 24,
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 16,
    },
    buttonContainer: {
        marginTop: 24,
    },
})
