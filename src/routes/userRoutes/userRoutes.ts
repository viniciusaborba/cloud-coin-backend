import { FastifyInstance } from 'fastify'
import { UserController } from '../../controllers/userControllers'
import { TransactionsControllers } from '../../controllers/transactionsControllers'

export async function userRoutes(app: FastifyInstance) {
  const userController = new UserController()

  app.post('/users', userController.create)
  app.delete('/users/:id', userController.delete)
  app.get('/users', userController.index)
  app.put('/users/:id', userController.update)
}