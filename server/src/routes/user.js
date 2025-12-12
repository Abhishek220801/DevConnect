import {Router} from 'express'
import { userAuth } from '../middlewares/auth.js';
import ConnectionRequest from '../models/connectionRequest.js';
const userRouter = Router();

userRouter.get('/requests/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'like',
        }).populate("fromUserId", "firstName lastName photoUrl age gender about skills").lean();
        res.json({
            message: "Data fetched successfully",
            data: connectionRequests,
        })
    } catch (err) {
        return res.status(400).send("ERROR : ", err.message);
    }
});

userRouter.get('/connections', userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id, status: "accept"},
                {fromUserId: loggedInUser._id, status: "accept"},
            ]
        })
        res.json({data: connectionRequests});
    } catch (err) {
        return res.status(400).json({"ERROR : ": err.message});
    }

})

export default userRouter;