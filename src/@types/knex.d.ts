import { Knex } from "knex";

declare module "knex/types/tables" {
  export interface Tables {
    users: {
      id: string;
      name: string;
      email: string;
      created_at: string;
      username: string;
      bio: string;
    };
    transactions: {
      id: string;
      title: string;
      description: string;
      created_at: string | Date;
      user_id: string;
      amount: number;
      receiver: string;
      category: string;
    };
    goals: {
      id: string;
      title: string;
      description: string;
      created_at: string;
      user_id: string;
      current_amount: number;
      wished_amount: number;
      initial_date: string;
      end_date: string;
      category: string;
    };
  }
}
