import { ticketModel } from "./models/ticketModel.js";

export default class Ticket{
    createTicket = async (ticket) =>{
        try {
            return await ticketModel.create(ticket);
        } catch (error) {
            console.error('Error de create ticket dao: ', error.message);
            return null;
        }
    }

    getAllTickets = async () =>{
        try {
            return await ticketModel.find().populate('purchaser').populate('products.productId');// ver si le pongo lean() o no
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    getTicketById = async (tid) =>{
        try {
            return await ticketModel.findById(tid);
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    //Este no lo he usado pero podria usarlo para obtener todos los tickets de una persona
    getTicketsByUserEmail = async (email) =>{
        try {
            return await ticketModel.find({ purchaser: email });
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }


}