const express = require('express')
const bodyParser = require('body-parser')

const port = process.env.PORT_URL || 3000

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('This Is Home Page');
})

// Require user routes
const userRoutes = require('./src/routes/user.routes')
const authRoutes = require('./src/routes/auth.routes')

// using as middleware
app.use('/api/v1', authRoutes)
app.use('/api/v1/users', userRoutes)

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});