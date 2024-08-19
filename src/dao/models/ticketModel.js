import mongoose from "mongoose";

const ticketCollection = "tickets";

const { Schema } = mongoose;

const Products = new Schema(
    [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
        quantity: { type: Number },
      },
    ], { _id: false } //para que no cree un nuevo id, ya que el producto ya existe y ya tiene id
);

const ticketSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    products: { type: [Products], default: [] },
    purchaseDateTime: { type : Date, default: Date.now },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true } //contiene el email del usuario
}, { timestamps: true });



export const ticketModel = mongoose.model(ticketCollection, ticketSchema);