import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { randomUUID } from "crypto";

export class TransactionsControllers {
  async create(req: FastifyRequest, res: FastifyReply) {
    const createBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
      user_id: z.string(),
      description: z.string(),
      receiver: z.string(),
      category: z.string(),
      month: z.string(),
      day: z.string(),
      year: z.string(),
    });

    const {
      amount,
      title,
      type,
      user_id,
      description,
      receiver,
      category,
      month,
      day,
      year,
    } = createBodySchema.parse(req.body);

    const formatedDay = day.padStart(2, "0");
    const formatedMonth = month.padStart(2, "0");

    await knex("transactions").insert({
      id: randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
      user_id,
      description,
      receiver,
      category,
      created_at: new Date(`${year}-${formatedMonth}-${formatedDay}T03:24:00`),
    });

    return res.status(201).send();
  }

  async index(req: FastifyRequest, res: FastifyReply) {
    const showParamsSchema = z.object({
      user_id: z.string(),
    });

    const { user_id } = showParamsSchema.parse(req.params);

    const show = await knex("transactions").where({ user_id });

    return res.status(200).send(show);
  }

  async delete(req: FastifyRequest, res: FastifyReply) {
    const deleteParamsSchema = z.object({
      id: z.string(),
    });

    const { id } = deleteParamsSchema.parse(req.params);

    await knex("transactions").where({ id }).delete();

    return res.status(200).send("Transação excluída com sucesso!");
  }

  async update(req: FastifyRequest, res: FastifyReply) {
    const updateBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      description: z.string(),
      category: z.string(),
      receiver: z.string(),
    });

    const updateParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { title, amount, description, category, receiver } =
      updateBodySchema.parse(req.body);
    const { id } = updateParamsSchema.parse(req.params);

    const transaction = await knex("transactions").where({ id }).first();

    transaction!.description = description ?? transaction!.description;
    transaction!.title = title ?? transaction!.title;
    transaction!.amount = amount ?? transaction!.amount;
    transaction!.category = category ?? transaction!.category;
    transaction!.receiver = receiver ?? transaction!.receiver;

    await knex("transactions").where({ id }).update(transaction!);

    return res.status(200).send("Transação atualizada com sucesso!");
  }

  async summary(req: FastifyRequest, res: FastifyReply) {
    const summaryParamsSchema = z.object({
      user_id: z.string(),
    });

    const { user_id } = summaryParamsSchema.parse(req.params);

    const summary = await knex("transactions")
      .where({ user_id })
      .sum("amount", { as: "amount" })
      .first();

    return { summary };
  }
}
