const app = require('./app')
const express = require('express')
const http = require('http')
const cors = require('cors')
const logger = require('./utils/logger')

app.use(cors())
app.use(express.static('build'))
const server = http.createServer(app)

const PORT = process.env.PORT || 3003

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})