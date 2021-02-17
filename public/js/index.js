import '../socket.io/socket.io.js'

const socketConnection = window.io()

socketConnection.on('issue', arg => {
  console.log('Fick data från socket!')
})
