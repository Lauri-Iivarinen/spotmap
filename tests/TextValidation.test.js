import { firstLetterToUpper, validateUsername } from "../util/TextValidation"

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
    expect(firstLetterToUpper('dog')).toBe('Dog')
    expect(firstLetterToUpper('Username')).toBe('Username')
})