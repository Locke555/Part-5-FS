const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

const port = 3001 || config.PORT

app.listen(port, () => {
  logger.info(`Server running on port ${port}`)
})