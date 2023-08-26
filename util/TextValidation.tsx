export const validateUsername = (text: string) => {
    if (text.trim().length < 5) {
        return false
    }
    if (text.trim().length > 15) {
        return false
    }
    const chars = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (chars.test(text)) {
        return false
    }
    return true
}

export const firstLetterToUpper = (string: string) => {
    const firstChar = string[0]
    const stringEnd = string.substr(1, (string.length - 1))
    
    return firstChar.toUpperCase() + stringEnd
}