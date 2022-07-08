const express=require('express');
const connectdb=require('./config/db')
const app=express();
//connect db
connectdb();

///init middleware
app.use(express.json({ extended: false }));
app.get('/', (req, res) => res.send('API Running'));

//define routes
app.use('/api/user', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/Profile'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server start on port ${PORT}`));