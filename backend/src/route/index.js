require('dotenv').config()

const loginRouter = require('./login')
const feedbackRouter = require('./feedback')
const registerRouter = require('./register')
const productRouter = require('./product')
// const cartRouter = require('./cart')
const orderRouter = require('./order')
const customerRouter = require('./customer')
const staffRouter = require('./staff')
const rcmsRouter = require('./rcms')
const brandRouter = require('./brand')
const branchRouter = require('./branch')
const blogRouter = require('./blog')
const reservationRouter = require('./reservation')
const saleReportRouter = require('./sale_report')
const voucherRouter = require('./voucher')
const cartRouter = require('./cart')

function route(app) {
    app.use('/login', loginRouter)
    app.use('/register', registerRouter)
    app.use('/feedback', feedbackRouter)
    app.use('/product', productRouter)
    app.use('/order', orderRouter)
    app.use('/customer', customerRouter)
    app.use('/staff', staffRouter)
    app.use('/rcms', rcmsRouter)
    app.use('/brand', brandRouter)
    app.use('/branch', branchRouter)
    app.use('/blog', blogRouter)
    app.use('/reservation', reservationRouter)
    app.use('/sale_report', saleReportRouter)
    app.use('/voucher', voucherRouter)
    app.use('/cart', cartRouter)

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