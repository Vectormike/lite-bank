import * as ORM from 'knex';
import { Model } from 'objection';
import dotenv from 'dotenv';

dotenv.config();

import * as knexObj from '../../knexfile';

export const knex = ORM.knex(knexObj[process.env.NODE_ENV || 'development']);

export default Model.knex(knex);
