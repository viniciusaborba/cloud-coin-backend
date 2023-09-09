import fastify from 'fastify'
import { userRoutes } from './routes/userRoutes/userRoutes'
import { transactionsRoutes } from './routes/transactionsRoutes/transactionsRoutes'
import { goalsRoutes } from './routes/goalsRoutes/goalsRoutes'
import cors from '@fastify/cors'

export const app = fastify()

app.register(cors)

app.register(userRoutes)
app.register(transactionsRoutes)
app.register(goalsRoutes)