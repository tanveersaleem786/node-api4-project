// code away!
const express = require('express');
const  logger = require('./middleware/logger.js')
const userRouter = require('./users/userRouter.js');
const postRouter = require('./posts/postRouter.js');
require('dotenv').config();

const server = express();
const port = process.env.PORT || 4000;

server.use(express.json());
server.use('/api/users/',userRouter);
server.use('/api/posts/',postRouter);
server.use(logger({format : "long"}))

server.get('/',(req,res) => {
   res.status(200).json({
       message: `Welcome to ${process.env.COHORT}`
   })
})

server.use((req, res) => {
	res.status(404).json({
		message: "Route was not found",
	})
})

server.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({
        error: "Something went wrong"
    })
})

server.listen(port,() => {
    console.log(`Server running at http://localhost:${port}`)
    //console.log(`Output for Cross ENV COHORT:${process.env.COHORT}`)
})


