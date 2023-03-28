const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const port = process.env.PORT_URL || 3000

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

app.use(cors())

// Require user routes
const requireToken = require('./src/middlewares/AuthTokenRequired')
const userRoutes = require('./src/routes/user.routes')
const authRoutes = require('./src/routes/auth.routes')
const mailRoutes = require('./src/routes/mail.routes')

app.get('/', requireToken, (req, res) => {
    console.log(req.user);
    res.send(req.user);
})

// using as middleware
app.use('/api/v1', authRoutes)
app.use('/api/v1/mailer', mailRoutes)
app.use('/api/v1/users', requireToken, userRoutes)

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});