import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    userId: {
    type: String,
    required: true,
    },
    title: {
        type: String,
        required: true,
    },
    history:[
        {
            question:{
                type: String,
                required: true,
            },
            answer:{
                type: String,
                required: true,
            },
        }
    ]
},{timestamps: true});

export default mongoose.models.chat || mongoose.model("chat", chatSchema);