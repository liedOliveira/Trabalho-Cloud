import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';

const userService = new UserService();

export class UserController {
  async findAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await userService.findAll();
      res.json({ status: 'success', data: users });
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.findById(req.params.id as string);
      res.json({ status: 'success', data: user });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.update(req.params.id as string, req.body);
      res.json({ status: 'success', data: user });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await userService.delete(req.params.id as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
