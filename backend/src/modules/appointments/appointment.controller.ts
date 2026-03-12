import { Request, Response, NextFunction } from 'express';
import { AppointmentService } from './appointment.service';
import { AuthRequest } from '../../middlewares/authMiddleware';

const appointmentService = new AppointmentService();

export class AppointmentController {
  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const appointment = await appointmentService.create(req.body, req.user!.id);
      res.status(201).json({ status: 'success', data: appointment });
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.role === 'ADMIN' ? undefined : req.user!.id;
      const appointments = await appointmentService.findAll(userId);
      res.json({ status: 'success', data: appointments });
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const appointment = await appointmentService.findById(req.params.id as string);
      res.json({ status: 'success', data: appointment });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const appointment = await appointmentService.update(req.params.id as string, req.body);
      res.json({ status: 'success', data: appointment });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await appointmentService.delete(req.params.id as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
