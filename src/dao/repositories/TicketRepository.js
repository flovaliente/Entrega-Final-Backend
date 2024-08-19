import TicketDao from "../ticketDAO.js";

class TicketRepository {
    constructor(){
        this.ticketDao = new TicketDao();
    }
    
    async createTicket(ticket){
        try {
            let code = await this.generateTicketCode();
            let result = await this.ticketDao.createTicket({ ...ticket, code });
            console.log(`Ticket created successfully.`);
            return result;
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error creating ticket.`);
        }
    }

    async generateTicketCode() {
        try {
          return Math.floor(Math.random() * 1000) + 1;
        } catch (error) {
          console.error(error.message);
          throw new Error("Error generating code.");
        }
      }

    async getTickets(){
        try {
            return await this.ticketDao.getAllTickets();
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error finding tickets.`);
        }
    }

    async getTicketById(tid){
        try {
            const ticket = await this.ticketDao.getTicketById(tid);
            if(!ticket)
                throw new Error(`Ticket with id: ${tid} do not exist.`);
            return ticket;
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error trying to find ticket.`);
        }
    }

}

export default TicketRepository;