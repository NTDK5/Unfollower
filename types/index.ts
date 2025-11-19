export interface InstagramUser {
    value: string;
    timestamp: number;
}

export interface InstagramJSON{
    following: InstagramUser[];
    followers: InstagramUser[];
    [key:string]: any;
}

export interface ComparisonResult{
    intersection:string[];
    union: string[];
    aOnly: string[];
    bOnly: string[];
}

export interface UploadFiles{
    following: InstagramJSON | null;
    followers: InstagramJSON | null;
}