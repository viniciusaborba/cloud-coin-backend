import { FastifyInstance } from "fastify";
import { GoalsControllers } from "../../controllers/goalsControllers";

export async function goalsRoutes(app: FastifyInstance) {
  const goalsControllers = new GoalsControllers()

  app.post('/goals', goalsControllers.create)
  app.delete('/goals/:id', goalsControllers.delete)
  app.put('/goals/:id', goalsControllers.update)
  app.get('/goals/:id', goalsControllers.show)
  app.get('/goals/index/:user_id', goalsControllers.index)
}