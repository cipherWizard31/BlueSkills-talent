const express = require('express')
const dotenv = require('dotenv')
const compAuth= require('./routes/companyAuth')
const empAuth = require('./routes/employeeAuth')
const { verifyToken, verifyUserTable, requireRole } = require('./middlewares/auth')

dotenv.config()
const app = express()


app.use('/api/auth', compAuth)

app.use('/api/auth', empAuth)

app.get('/token-check', verifyToken, (req, res) => {
  res.json({ message: 'Token is valid' })
})

app.get('/company', verifyToken, verifyUserTable, requireRole('company'), (req, res) => {
  res.send('Company only RBAC is running')
})

app.get('/employee', verifyToken, verifyUserTable, requireRole('employee'), (req, res) => {
  res.send('Employee only RBAC is running')
})

const PORT = process.env.PORT || 3000


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});