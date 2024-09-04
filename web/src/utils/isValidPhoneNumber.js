function isValidPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, '')
    const regex = /^[78]\d{10}$/
    return regex.test(cleaned)
}

export default isValidPhoneNumber