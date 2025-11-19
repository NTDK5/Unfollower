import { ComparisonResult } from '@/types';


export function compareLists (listA: string[], listB: string[]): ComparisonResult{
    const setA = new Set(listA);
    const setB = new Set(listB);


    const intersection = listA.filter(username => setB.has(username));
    const union = Array.from( new Set([...listA, ...listB]));
    const aOnly = listA.filter(username => !setB.has(username));
    const bOnly = listB.filter(username => !setA.has(username));

    return { 
        intersection,
        union,
        aOnly,
        bOnly,
    };
}