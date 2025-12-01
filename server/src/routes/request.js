import express from 'express'
const requestRouter = express.Router();

import { userAuth } from '../middlewares/auth.js';

requestRouter.post('/send/interested/:toUserId', userAuth, async(req, res) => {
    try{
        const fromUserId = req.user._id; 
        const toUserId = req.params.toUserId;
        res.send(user.firstName + ' sent the connection request!');
    } catch(err){

    }
})



export default requestRouter;

