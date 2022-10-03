const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 6000
const {MONGOURI} = require('./config/keys');

app.use(express.json());
require('./models/user');
require('./models/post');
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));

mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
});
mongoose.connection.on('connected',()=>{
    console.log('Connected to Mongo');
});
mongoose.connection.on('error',(err)=>{
    console.log('Error connecting: ',err);
});

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path=require('path')
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT, ()=>{
    console.log('Server: ',PORT);
})