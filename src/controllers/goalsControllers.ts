import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { randomUUID } from "crypto";
import { AllFieldsRequiredError } from "../errors/all-fields-required-error";

export class GoalsControllers {
  async create(req: FastifyRequest, res: FastifyReply) {
    const createBodySchema = z.object({
      title: z.string().max(30).optional(),
      description: z.string().max(90).optional(),
      current_amount: z.number().optional(),
      wished_amount: z.number().optional(),
      initial_date: z.string().optional(),
      end_date: z.string().optional(),
      user_id: z.string().optional(),
    })

    const { current_amount, description, end_date, initial_date, title, user_id, wished_amount } = createBodySchema.parse(req.body)

    await knex('goals').insert({
      id: randomUUID(),
      title,
      description,
      current_amount,
      wished_amount,
      initial_date,
      end_date,
      user_id,
    })

    if (!current_amount || !description || !end_date || !initial_date || !title || !user_id || !wished_amount) {
      throw new AllFieldsRequiredError()
    }
    
    return res.status(200).send()
  }

  async index(req: FastifyRequest, res: FastifyReply) {
    const indexParamsSchema = z.object({
      user_id: z.string()
    })

    const { user_id } = indexParamsSchema.parse(req.params)

    const goals = await knex('goals').where({ user_id })

    return res.status(200).send(goals)
  }

  async delete(req: FastifyRequest, res: FastifyReply) {
    const deleteParamsSchema = z.object({
      id: z.string(),
    })

    const { id } = deleteParamsSchema.parse(req.params)

    await knex('goals').where({ id }).delete()

    return res.status(200).send('Objetivo excluído com sucesso!')
  }

  async update(req: FastifyRequest, res: FastifyReply) {
    const updateBodySchema = z.object({
      title: z.string().max(30).optional(),
      description: z.string().max(90).optional(),
      current_amount: z.number().optional(),
      wished_amount: z.number().optional(),
      initial_date: z.string().optional(),
      end_date: z.string().optional(),
    })

    const updateParamsSchema = z.object({
      id: z.string(),
    })

    const { current_amount, wished_amount, title, description, initial_date, end_date } = updateBodySchema.parse(req.body)
    const { id } = updateParamsSchema.parse(req.params)

    const goal = await knex('goals').where({ id }).first()

    goal!.title = title ?? goal!.title
    goal!.description = description ?? goal!.description
    goal!.current_amount = current_amount ?? goal!.current_amount
    goal!.wished_amount = wished_amount ?? goal!.wished_amount
    goal!.initial_date = initial_date ?? goal!.initial_date
    goal!.end_date = end_date ?? goal!.end_date

    await knex('goals').where({ id }).update(goal!)

    return res.status(200).send('Objetivo atualizado com sucesso!')
  }

  async show(req: FastifyRequest, res: FastifyReply) {
    const showParamsSchema = z.object({
      id: z.string(),
    })

    const { id } = showParamsSchema.parse(req.params)

    const goal = await knex('goals').where({ id }).first()

    return res.status(200).send(goal)
  }
}