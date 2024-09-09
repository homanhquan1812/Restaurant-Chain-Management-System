require('dotenv').config()

const loginRouter = require('./login')
const feedbackRouter = require('./feedback')
const registerRouter = require('./register')
const productRouter = require('./product')
const orderRouter = require('./order')
const staffRouter = require('./staff')
const dataHandlingRouter = require('./datahandling')

function route(app) {
    app.use('/login', loginRouter)
    app.use('/register', registerRouter)
    app.use('/feedback', feedbackRouter)
    app.use('/product', productRouter)
    app.use('/order', orderRouter)
    app.use('/staff', staffRouter)
    app.use('/datahandling', dataHandlingRouter)

    const env = process.env.NODE_ENV
    
    console.log(`Environment: ${env}`)

    // Error handling middleware
    app.use((err, req, res, next) => {
        console.error(err.stack)

        if (env === 'development') {
            res.status(500).json({
                message: err.stack.split('\n').map(line => line.trim())
            })
        } else {
            res.status(500).json({
                message: 'Something went wrong!'
            })
        }
    })
}

module.exports = route