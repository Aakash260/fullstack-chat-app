 import express from 'express';
import authRouter from './routes/authRouter.js';
import messageRouter from './routes/messageRouter.js';
import cors from 'cors';
import "dotenv/config"
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import { io,server,app } from './lib/socket.js';
import path from 'path'; 
const PORT= process.env.PORT;
const __dirname = path.resolve();
app.use(express.json());
app.use(cors({credentials:true,origin:'http://localhost:5173'}));
app.use(cookieParser());
app.use('/api/auth',authRouter);
app.use('/api/messages',messageRouter)

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname,'../frontend/dist')));
    app.get('*',(req,res)=>{
        res.sendFile(path.join(__dirname,'../frontend','dist','index.html'));
    })  }

server.listen(PORT, () => {
    console.log('Server is running on port ',PORT);
    connectDB();
})

