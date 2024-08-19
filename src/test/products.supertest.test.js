import { expect } from "chai";
import supertest from "supertest";
import * as dotenv from "dotenv";

dotenv.config();

const URI = process.env.URI_TEST;
const requester = supertest("http://localhost:8080");

const User = {
    email: "flovaliente143@gmail.com"
}

describe("Integration Test Products", function () {
    this.timeout(10000);

    before(async function () {
      await mongoose.connect(URI);
    });

    beforeEach(async function () {
    });

    afterEach(async function () {
    });
  
    after(async function () {
      await mongoose.connection.close();
    });

    let authToken;

    describe('POST /api/users/login', () => {
        it('Login', async function () {
            const response = await requester(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${adminToken}`)
                .attach('thumbnails', 'path/to/sample-image.jpg') // Attach files if necessary
                .field('title', 'New Product')
                .field('description', 'A new test product')
                .field('price', 200)
                .field('stock', 15)
                .field('category', 'New Category')
                .field('code', 'NP123');
            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('_id');
            expect(response.body.title).to.equal('New Product');
        });
    });

    describe('POST /api/products', () => {
        it('should create a new product with Admin role', async function () {
            const response = await requester(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${adminToken}`)
                .attach('thumbnails', 'path/to/sample-image.jpg') // Attach files if necessary
                .field('title', 'New Product')
                .field('description', 'A new test product')
                .field('price', 200)
                .field('stock', 15)
                .field('category', 'New Category')
                .field('code', 'NP123');
            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('_id');
            expect(response.body.title).to.equal('New Product');
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