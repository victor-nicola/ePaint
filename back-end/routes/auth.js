const router = require( "express" ).Router();
const User = require( "../models/user" );
const { registerValidation } = require("../validation");
const bcrypt = require( "bcrypt" );
const jwt = require( "jsonwebtoken" );
const multer = require( "multer" );
var upload = multer( { dest: "assets/profilePics/" } );

router.post( "/login", async( req, res ) => {
    const isUsername = await User.findOne( { username: req.body.userString } );
    if ( !isUsername ) {
        const isEmail = await User.findOne( { email: req.body.userString } );
        if ( isEmail ) {
            const validPassword = await bcrypt.compare( req.body.password, isEmail.password );
            if ( validPassword ) {
                const token = jwt.sign( { _id: isEmail._id }, process.env.TOKEN_SECRET );
                return res.send( token );
            }
            return res.status( 400 ).send( "Password is incorrect!" );
        }
        return res.status( 400 ).send( "Username or email is incorrect!" );
    }
    const validPassword = await bcrypt.compare( req.body.password, isUsername.password );
    if ( !validPassword )
        return res.status( 400 ).send( "Password is incorrect!" );

    const token = jwt.sign( { _id: isUsername._id }, process.env.TOKEN_SECRET );
    return res.send( token );
});

router.post( "/register", upload.single( "image" ), async( req, res ) => { 
    const usernameExists = await User.findOne( { username: req.body.username } );
    if ( usernameExists )
        return res.status( 400 ).send( "Username already exists!" );

    const emailExists = await User.findOne( { email: req.body.email } );
    if ( emailExists )
        return res.status( 400 ).send( "Email already exists!" );
    
    const { error } = registerValidation( req.body );
    if ( error )
        return res.status( 400 ).send( error.details[0].message );

    if ( !req.file )
        return res.status( 400 ).send( "File does not exist!" );
    
    const salt = await bcrypt.genSalt( 10 );
    const hashedPassword = await bcrypt.hash( req.body.password, salt );
    
    const user = new User({ 
        name: req.body.name,
        surname: req.body.surname,
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        image: req.file.path,
        noFollowers: 0,
        noFollowing: 0,
        noPosts: 0
    });
    
    try {
        const savedUser = await user.save();
        res.send( "succes" );
    }
    catch( err ) {
        res.status( 400 ).send( err );
    }
});

module.exports = router;