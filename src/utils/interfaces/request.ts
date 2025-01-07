import { Request } from 'express';
import { AuthenticatedUser } from './auth';

export interface CustomRequest extends Request {
    user?: AuthenticatedUser;
}
