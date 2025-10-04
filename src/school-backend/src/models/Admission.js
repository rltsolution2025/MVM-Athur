import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    dob: { type: Date, required: true },
    classApplied: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    address: { type: String, required: true },
    parent: { type: String, enum: ["Father", "Mother", "Guardian"], required: true },
    parentName: { type: String, required: true },
    contactNumber: { type: String, required: true, match: /^[0-9]{10}$/ },
    email: { type: String, required: true, match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"] },
    timestamp:{type:Date, default:Date.now}
});

const Admission = mongoose.model("Admission", admissionSchema);

export default Admission;
