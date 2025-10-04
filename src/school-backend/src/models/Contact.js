import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    message: { type: String },
    timestamp:{type:Date, default:Date.now}
});

export default mongoose.model("Contact", contactSchema);
