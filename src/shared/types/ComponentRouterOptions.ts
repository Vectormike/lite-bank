import { Multer } from 'multer';
import { Guards } from '../guards';

export interface GlobalMiddlewares {
    multer?: Multer;
}

export class ComponentRouterOptions<Controller, Validator> {
    controller: Controller;
    guards?: Guards;
    validator?: Validator;
    globalMiddlewares?: GlobalMiddlewares;
}
