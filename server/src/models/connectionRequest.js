import {mongoose, Schema, model} from 'mongoose'

const connectionRequestSchema = new Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        enum: {
            values: ["ignore", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        },
        required: true,
    }
}, {timestamps: true})

const ConnectionRequest = model('ConnectionRequest', connectionRequestSchema);

export default ConnectionRequest;