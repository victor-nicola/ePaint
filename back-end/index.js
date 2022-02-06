const { request, response } = require("express");
const express = require( "express" );
const app = express();
const mongoose = require( "mongoose" );
const auth = require( "./routes/auth" );
const dotenv = require( "dotenv" );
const userData = require( "./routes/userData" );
const follow = require( "./routes/follow" );
const makePost = require( "./routes/makePost" );

dotenv.config();

// conexiune cu baza de date
mongoose.connect( process.env.DB_CONNECT,
{ useNewUrlParser: true, useUnifiedTopology: true } )
.then( () => console.log( "connected to database" ) )
.catch( err => console.log( err ) );

app.use( express.json() );
app.use( express.urlencoded( { extended: true } ) );

// route
app.use( "/api/user", auth );
app.use( "/api/user", userData );
app.use( "/images", express.static( __dirname ) );
app.use( "/api/user", follow );
app.use( "/api/user", makePost );

app.listen( 3000, () => console.log( "server up and running" ) );