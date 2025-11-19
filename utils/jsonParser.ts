import {InstagramJSON, InstagramUser} from '@/types';

export function extractUsernames(json:InstagramJSON, type:'following' | 'followers'): string[] {
    const data = json[type] || json[`relationships_${type}`] || [] 

    if(!Array.isArray(data)) {
        return []
    }

    return data
        .map((item:InstagramUser) => {
            if(typeof item === 'object' && item.value){
                return item.value;
            }
            if(typeof item === 'string'){
                return item;
            }
            return null;
    }).filter((username): username is string => username !==null)

}