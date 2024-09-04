function isiOS() {
    let userAgent = navigator.userAgent

    if (/ios|iphone|ipad|ipod/i.test(userAgent)) {
        return true
    }

    return false
}

export default isiOS