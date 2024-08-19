import { expect } from "chai";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

import { ticketModel } from "../dao/models/ticketModel.js";
import cartModel from "../dao/models/cartModel.js";
import productModel from "../dao/models/productModel.js";
import Ticket from "../dao/ticketDAO.js";

dotenv.config();

const URI = process.env.URI_TEST;
const ticketDao = new Ticket();

describe("Tests Cart DAO", function () {
    this.timeout(10000);

    let ticket;
    let userEmail;
    let productId;

    before(async function () {
      await mongoose.connect(URI);
    });

    beforeEach(async function () {
        userEmail = 'user@gmail.com';
        productId = new mongoose.Types.ObjectId();

        //Creo ticket antes de cada test
        ticket = await ticketDao.createTicket({
            code: '123',
            products: [{ productId, quantity: 2 }],
            purchaser: userEmail,
            amount: 200,
            
        });
    });

    afterEach(async function () {
        await ticketModel.deleteMany({});
    });
  
    after(async function () {
      await mongoose.connection.close();
    });

    describe('createTicket', () => {
        it("Should create a new ticket", async function () {
            //Uso el ticket creado en el beforeEach
            console.log(ticket);
            expect(ticket).to.be.an("object");
            expect(ticket).to.have.property("_id");
            expect(ticket).to.have.property("purchaser");
            expect(ticket.purchaser.toString()).to.equal(userEmail.toString());
            expect(ticket.amount).to.equal(200);
            expect(ticket.products).to.be.an("array").that.has.lengthOf(1);
        });
    });

    describe('getTicketById', () => {
        it("Should retrieve a ticket by its ID", async function () {
            const foundTicket = await ticketDao.getTicketById(ticket._id);

            expect(foundTicket).to.be.an("object");
            expect(foundTicket._id.toString()).to.equal(ticketId.toString());
        });
    });
    
});