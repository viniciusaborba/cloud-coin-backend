import { FastifyInstance } from "fastify";
import { TransactionsControllers } from "../../controllers/transactionsControllers";

export async function transactionsRoutes(app: FastifyInstance) {
  const transactionsControllers = new TransactionsControllers()
  
  app.post('/transactions', transactionsControllers.create)
  app.get('/transactions/:user_id', transactionsControllers.index)
  app.delete('/transactions/:id', transactionsControllers.delete)
  app.get('/transactions/summary/:user_id', transactionsControllers.summary)
  app.put('/transactions/update/:id', transactionsControllers.update)
}