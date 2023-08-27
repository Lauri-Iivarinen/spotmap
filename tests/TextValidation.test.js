import { firstLetterToUpper, validatePassword, validateUsername } from "../util/TextValidation"

test('Validate username, too short', () => {
    expect(validateUsername('user')).toBe(false)
})

test('Validate username, too long', () => {
    expect(validateUsername('usernameljksaflkjhashalkhalkhdfa')).toBe(false)
})

test('Validate username, wrong characters', () => {
    expect(validateUsername('userna%as')).toBe(false)
    expect(validateUsername('use#rnaas')).toBe(false)
})

test('Validate username, OK', () => {
    expect(validateUsername('username')).toBe(true)
})

test('First character is returned in uppercase', () => {
    expect(firstLetterToUpper('cat')).toBe('Cat')
    expect(firstLetterToUpper('DOG')).toBe('DOG')
    expect(firstLetterToUpper('Username')).toBe('Username')
})

test('Validate password, too short', () => {
    expect(validatePassword('passwrd')).toBe(false)
})

test('Validate password, too long', () => {
    expect(validatePassword('passwordpasswordpasswordpasswordpasswordpasswor')).toBe(false)
})

test('Validate password, no capital letter', () => {
    expect(validatePassword('passw0rd!')).toBe(false)
})

test('Validate password, no number', () => {
    expect(validatePassword('Password!')).toBe(false)
})

test('Validate password, no special char', () => {
    expect(validatePassword('Passw0rd')).toBe(false)
})

test('Validate password, no small letter', () => {
    expect(validatePassword('PASSW0RD!')).toBe(false)
})

test('Validate password, ok', () => {
    expect(validatePassword('Passw0rd!')).toBe(true)
})