import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { randomUUID } from "node:crypto";

export class UserController {
  async create(req: FastifyRequest, res: FastifyReply) {
    const registerBodySchema = z.object({
      name: z.string().min(3).max(30),
      username: z.string().min(3).max(20),
      email: z.string().max(30),
      bio: z.string().max(300),
    });

    const { name, username, email, bio } = registerBodySchema.parse(req.body);

    const userExists = await knex("users").where({ email }).first();

    const usernameAlreadyInUse = await knex('users').where({ username }).first()

    if (userExists) {
      return res.status(409).send("E-mail já em uso!");
    }

    if (usernameAlreadyInUse) {
      return res.status(409).send("Nome de usuário já em uso!");
    }

    await knex("users").insert({
      id: randomUUID(),
      name,
      username,
      email,
      bio,
    });

    return res.status(201).send();
  }

  async delete(req: FastifyRequest, res: FastifyReply) {
    const deleteParamsSchema = z.object({
      id: z.string(),
    });

    const { id } = deleteParamsSchema.parse(req.params);

    const userExists = await knex("users").where({ id }).first();

    if (!userExists) {
      return res.status(400).send("Usuário não encontrado!");
    }

    await knex("users").where({ id }).delete();

    return res.status(200).send("Usuário excluído com sucesso!");
  }

  async index(req: FastifyRequest, res: FastifyReply) {
    const indexQuerySchema = z.object({
      username: z.string(),
    });

    const { username } = indexQuerySchema.parse(req.query);

    const users = await knex("users")
      .whereLike("username", `%${username}%`)
      .orderBy("username");

    if (!users) {
      return res.status(400).send(`No such user ${username}`)
    }

    return res.status(200).send({
      ...users,
      id: undefined,
    });
  }

  async update(req: FastifyRequest, res: FastifyReply) {
    const updateBodySchema = z.object({
      name: z.string().optional(),
      email: z.string().optional(),
      username: z.string().optional(),
      bio: z.string().optional(),
    });

    const updateParamsSchema = z.object({
      id: z.string(),
    });

    const { email, name, username, bio } = updateBodySchema.parse(req.body);

    const { id } = updateParamsSchema.parse(req.params);

    const user = await knex("users").where({ id }).first();

    user!.name = name ?? user!.name;
    user!.email = email ?? user!.email;
    user!.username = username ?? user!.username;
    user!.bio = bio ?? user!.bio;

    if (email) {
      const emailIsInUse = await knex("users").where({ email }).first();

      if (emailIsInUse) {
        return res.status(409).send(`Email ${email} já está em uso!`);
      }
    }

    if (username) {
      const usernameIsInUse = await knex('users').where({ username }).first()

      if (usernameIsInUse) {
        return res.status(409).send(`Nome de usuário ${username} não disponível!`)
      }
    }
    
    await knex("users").where({ id }).update(user!);

    return res.status(200).send("Usuário atualizado com sucesso!");
  }
}
