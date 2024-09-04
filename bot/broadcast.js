process.on('message', (message) => {
    console.log(`Sent ${message} messages from child process`)
})