import ticketService from "../services/ticketService.js";

const createTicket = async (req, res) => {
    try{
        const newTicket = await ticketService.createTicket(req.body);
        res.status(200).send({
            status: 'success',
            payload: newTicket
        });
    }catch (error){
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
}

const getTickets = async (req, res) => {
    try{
        const { limit, page, query, sort } = req.query;
        const tickets = await ticketService.getTickets(limit, page, query, sort);

        res.send({
            status: 'success',
            payload: tickets
        });
    }catch (error){
        res.status(500).send({
            status: 'error',
            message: error.message
        });
    }
}

const getTicketById = async (req, res) => {
    try{
        const { tid } = req.params;

        const ticket = await ticketService.getTicketById(tid);
        if(!ticket){
            throw new Error(`Ticket with id ${tid} does not exist.`);
        }

        res.send({
            status: 'success',
            payload: ticket
        });
    }catch (error){
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
}

export default {
    createTicket,
    getTickets,
    getTicketById
};