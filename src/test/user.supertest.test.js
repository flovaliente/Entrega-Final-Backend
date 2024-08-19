import { expect } from "chai";
import mongoose from "mongoose";
import supertest from "supertest";
import * as dotenv from "dotenv";

dotenv.config();

const URI = process.env.URI_TEST;
const requester = supertest("http://localhost:8080");

const User = {
    firstName: "Florencia",
    email: "flovaliente143@gmail.com",
    password: "123"
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


    describe('POST /api/users/register', () => {
        it('Should register a new user', async function () {
            const response = await requester.post('/api/users/register').send(User);
            console.log(response);
        });
    });

    
});