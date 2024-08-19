import { Router } from 'express';

import ticketController from '../controllers/ticketController.js';

const router = Router();

// Get all tickets
router.get('/', ticketController.getTickets);

// Get ticket by id
router.get('/:tid', ticketController.getTicketById);

// Create ticket
router.post('/', ticketController.createTicket);

export default router;