import { FileUploadButton } from '@/components/FileUploadButton';
import { useFileUpload } from '@/hooks/useFileUpload';
import { InstagramJSON } from '@/types';
import { extractUsernames } from '@/utils/jsonParser';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Snackbar, Text, useTheme } from 'react-native-paper';
import Animated, { FadeInUp } from 'react-native-reanimated';


export default function HomeScreen(){
    const theme = useTheme();
    const router = useRouter();
    const {pickFile, loading, error} = useFileUpload();
    const [ followingFile, setFollowingFile] = useState<InstagramJSON | null>(null);
    const [ followersFile, setFollowersFile] = useState<InstagramJSON | null>(null);
    const [ followingFileName, setFollowingFileName] = useState<string | null>(null);
    const [ followersFileName, setFollowersFileName] = useState<string | null>(null);
    const [snackbarVisible, setSnackbarVisible] = useState(false);

    useEffect(() => {
        if (error) {
            setSnackbarVisible(true);
        }
    }, [error]);

    const handleFollowingUpload = async () => {
        const result = await pickFile();

        if(result){
            setFollowingFile(result.data);
            setFollowingFileName(result.filename);
    }
};

    const handleFollowersUpload = async() =>{
        const result = await pickFile();

        if(result){
            setFollowersFile(result.data);
            setFollowersFileName(result.filename);
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
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeInUp.duration(600)} style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text variant="displaySmall" style={[styles.title, { color: theme.colors.onSurface }]}>
                            Unfollower
                        </Text>
                        <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
                            Compare Your Instagram Followers and Following
                        </Text>
                    </View>

                    {/* Info Card */}
                    <Animated.View entering={FadeInUp.delay(100).duration(600)}>
                        <Card style={[styles.infoCard, { backgroundColor: theme.colors.surfaceVariant }]}>
                            <Card.Content>
                                <Text variant="bodyMedium" style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}>
                                    📥 Download your Instagram data from Settings → Privacy and Security → Download Your Information
                                </Text>
                            </Card.Content>
                        </Card>
                    </Animated.View>

                    {/* Upload Section */}
                    <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.uploadSection}>
                        <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                            Upload Files
                        </Text>
                        
                        <View style={styles.uploadContainer}>
                            <Text variant="titleMedium" style={[styles.label, { color: theme.colors.onSurface }]}>
                                Following List
                            </Text>
                            <FileUploadButton 
                                onPress={handleFollowingUpload}
                                loading={loading}
                                fileName={followingFileName || undefined}
                            />
                        </View>

                        <View style={styles.uploadContainer}>
                            <Text variant="titleMedium" style={[styles.label, { color: theme.colors.onSurface }]}>
                                Followers List
                            </Text>
                            <FileUploadButton  
                                onPress={handleFollowersUpload}
                                loading={loading}
                                fileName={followersFileName || undefined}
                            />
                        </View>
                    </Animated.View>
                    
                    {/* Compare Button */}
                    <Animated.View entering={FadeInUp.delay(300).duration(600)} style={styles.buttonContainer}>
                        <Button
                            mode="contained"
                            onPress={handleCompare}
                            disabled={!followingFile || !followersFile || loading}
                            loading={loading}
                            style={styles.compareButton}
                            contentStyle={styles.compareButtonContent}
                            icon="compare"
                        >
                            Compare Lists
                        </Button>
                    </Animated.View>
                </Animated.View>
            </ScrollView>

            {/* Error Snackbar */}
            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
                action={{
                    label: 'Dismiss',
                    onPress: () => setSnackbarVisible(false),
                }}
            >
                {error || 'An error occurred'}
            </Snackbar>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    content: {
        padding: 20,
    },
    header: {
        marginBottom: 32,
        alignItems: 'center',
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        textAlign: 'center',
        marginTop: 8,
    },
    infoCard: {
        marginBottom: 24,
        borderRadius: 16,
        ...Platform.select({
            android: {
                elevation: 2,
            },
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
        }),
    },
    infoText: {
        lineHeight: 22,
    },
    uploadSection: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 20,
    },
    uploadContainer: {
        marginBottom: 20,
    },
    label: {
        fontWeight: '600',
        marginBottom: 12,
        marginTop: 8,
    },
    buttonContainer: {
        marginTop: 16,
        marginBottom: 20,
    },
    compareButton: {
        borderRadius: 12,
        ...Platform.select({
            android: {
                elevation: 4,
            },
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
        }),
    },
    compareButtonContent: {
        paddingVertical: 8,
    },
})
