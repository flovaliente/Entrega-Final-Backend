import Assert from "assert";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

import userModel from "../dao/models/userModel.js";
import UserDao from "../dao/userDAO.js";

dotenv.config();

const assert = Assert.strict; //Para que las comparaciones sean más estrictas
const URI = process.env.URI_TEST;
const userDao = new UserDao()


describe("Tests User DAO", function () {
    this.timeout(10000);

    let user;

    before(async function () {
      await mongoose.connect(URI);
    });

    beforeEach(async function () {
        user = await userDao.createUser({
            firstName: "Juan",
            lastName: "Perez",
            email: "jperez@example.com",
            password: "123",
            role: "User",
        });
    });

    afterEach(async function () {
        await userModel.deleteMany({});
    });

    after(async function () {
      await mongoose.connection.close();
    });
    

    describe('getUser', () => {
        it("Should get an user by its ID", async function () {
            const foundUser = await userDao.getUser(user._id);

            assert.ok(foundUser, 'User should not be null');
            assert.strictEqual(foundUser._id.toString(), user._id.toString(), "Found user ID should match");
        });
    });

    describe('findUserByIdAndUpdate', () => {
        it("Should create a cart for an user", async function () {
            //Creo un id para el carrito
            const cartId = new mongoose.Types.ObjectId();
            await userDao.findUserByIdAndUpdate(user._id, cartId);
            const updatedUser = await userDao.getUser(user._id);

            assert.strictEqual(typeof updatedUser, "object", "Should return an object type for user")
            assert.ok(updatedUser.cart._id, "Cart user should have an _id property");
            assert.strictEqual(updatedUser.cart.toString(), cartId.toString(), "Cart ID should be created");
        });
    });

    describe("switchRole", function () {
        it("Should switch the user role", async function () {
            let newRole;
            if (user.role == "User"){
                newRole = "Premium";
            }else{
                newRole = "User"
            }
            const updatedUser = await userDao.switchRole(user._id, newRole);

            assert.ok(updatedUser, "Updated user should not be null");
            assert.deepStrictEqual(updatedUser.role, newRole, "User role should be updated");
        });
    });

});