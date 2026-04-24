import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import stripeRoutes from './routes/stripe.js'
import ordersRoutes from './routes/orders.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))

// Important : le webhook Stripe a besoin du raw body, on le gère avant le JSON parser
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }))

app.use(express.json({ limit: '10mb' }))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/stripe', stripeRoutes)
app.use('/api/orders', ordersRoutes)

app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Erreur serveur',
  })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})