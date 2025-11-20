import { InstagramJSON } from '@/types';

export function extractUsernames(json:InstagramJSON | any, type:'following' | 'followers'): string[] {
    // Handle case where JSON is an array directly (followers format)
    if(Array.isArray(json)) {
        return json
            .map((item: any) => {
                // For followers: extract from string_list_data[0].value
                if(item?.string_list_data?.[0]?.value) {
                    return item.string_list_data[0].value;
                }
                return null;
            })
            .filter((username): username is string => username !== null);
    }

    // Handle case where JSON is an object
    let data: any[] = [];
    
    if(type === 'following') {
        // For following: look for relationships_following
        data = json?.relationships_following || json?.following || [];
    } else {
        // For followers: look for followers key or check if it's an array
        data = json?.followers || [];
    }

    if(!Array.isArray(data)) {
        return [];
    }

    return data
        .map((item: any) => {
            // For following: use title field
            if(type === 'following' && item?.title) {
                return item.title;
            }
            
            // For followers: extract from string_list_data[0].value
            if(item?.string_list_data?.[0]?.value) {
                return item.string_list_data[0].value;
            }
            
            // Fallback: check if item has value directly
            if(item?.value) {
                return item.value;
            }
            
            // Fallback: check if item is a string
            if(typeof item === 'string') {
                return item;
            }
            
            return null;
        })
        .filter((username): username is string => username !== null);
}