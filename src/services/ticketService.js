import TicketRepository from "../dao/repositories/TicketRepository.js";

const ticketManager = new TicketRepository();

const createTicket = async (ticket) =>{
    try {
        console.log("Ticket info from Repository: ", ticket);
        return await ticketManager.createTicket(ticket);
    } catch (error) {
        throw new Error(error.message);
    }
}

const getTickets = async (limit, page, query, sort) =>{
    try {
        return await ticketManager.getTickets(limit, page, query, sort);
    } catch (error) {
        throw new Error(error.message);
    }
}

const getTicketById = async (tid) =>{
    try {
        return await ticketManager.getTicketById(tid);
    } catch (error) {
        throw new Error(error.message);
    }
}


export default {
    createTicket,
    getTickets,
    getTicketById
};