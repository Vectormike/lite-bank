export class ResponseType<T = any> {
  status?: 'success' | 'error';
  statusCode?: number;
  message: string;
  data?: T | T[];
}