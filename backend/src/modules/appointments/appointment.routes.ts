import { Router } from 'express';
import { AppointmentController } from './appointment.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { validate } from '../../middlewares/validate';
import { createAppointmentSchema, updateAppointmentSchema } from './appointment.schema';

const router = Router();
const appointmentController = new AppointmentController();

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Criar novo agendamento
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, date]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Agendamento criado
 */
router.post('/', authMiddleware, validate(createAppointmentSchema), appointmentController.create);

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Listar agendamentos
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de agendamentos
 */
router.get('/', authMiddleware, appointmentController.findAll);

/**
 * @swagger
 * /api/appointments/{id}:
 *   get:
 *     summary: Buscar agendamento por ID
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Agendamento encontrado
 *       404:
 *         description: Agendamento não encontrado
 */
router.get('/:id', authMiddleware, appointmentController.findById);

/**
 * @swagger
 * /api/appointments/{id}:
 *   put:
 *     summary: Atualizar agendamento
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, CANCELLED]
 *     responses:
 *       200:
 *         description: Agendamento atualizado
 */
router.put('/:id', authMiddleware, validate(updateAppointmentSchema), appointmentController.update);

/**
 * @swagger
 * /api/appointments/{id}:
 *   delete:
 *     summary: Cancelar agendamento
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Agendamento removido
 */
router.delete('/:id', authMiddleware, appointmentController.delete);

export { router as appointmentRoutes };
