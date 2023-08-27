export const validateUsername = (text: string) => {
    if (text.trim().length < 5 || text.trim().length > 15) {
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

export const validatePassword = (string: string) => {
    if (string.trim().length < 7 || string.trim().length > 30) {
        return false
    }
    const chars = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    const small = /[a-z]/
    const large = /[A-Z]/
    const numbers = /[0-9]/

    if (chars.test(string) && small.test(string) && large.test(string) && numbers.test(string)) return true

    return false
}