export const createCollectionName = (name: string, preFix?: string) => {
    return preFix ? `${preFix}-${name}` : name
}