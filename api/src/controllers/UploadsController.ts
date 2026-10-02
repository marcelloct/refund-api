import { type Request, type Response } from 'express';

class UploadsController {
  async create(request: Request, response: Response) {
    return response.json({ message: 'ok' });
  }
}

export { UploadsController };
