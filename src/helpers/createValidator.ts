import { NextFunction, Request, RequestHandler, Response } from 'express';
import JoiRoot from '@hapi/joi'; // Typically imported as 'Joi'
import { BadRequestError } from '../errors';
import logger from '../logger';

export interface IValidator {
  validate: RequestHandler;
}

export interface SchemaBuilderOptions {
  /** Determines the property (body, query or params) of the request to validate against the schema map. Defaults to `body` */
  propToValidate?: 'body' | 'query' | 'params';
}

export type JoiSchemaBuilderFunction = (Joi: JoiRoot.Root) => JoiRoot.SchemaMap;

export default function (createSchema: JoiSchemaBuilderFunction, options: SchemaBuilderOptions = {}): IValidator {
  const schema = JoiRoot.object().keys({
    ...createSchema(JoiRoot),
  });

  return {
    validate: (req: Request, res: Response, next: NextFunction) => {
      const result = schema.validate(req[options.propToValidate || 'body']);

      try {
        if (result.error) {
          logger.info('validation error');
          logger.info(result.error);
          throw new BadRequestError(result.error.message);
        }

        req.body = result.value;
        next();
      } catch (error) {
        next(error);
      }
    },
  };
}
