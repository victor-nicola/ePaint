const router = require( "express" ).Router();
const jwt = require( "jsonwebtoken" );
const Post = require( "../models/post" );
const User = require( "../models/user" );
const Comment = require( "../models/comment" );
const multer = require( "multer" );
var upload = multer( { dest: "assets/postPics/" } );

router.post( "/makePost", upload.single( "image" ), async( req, res ) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    const user = await User.findById( { _id: decodedToken._id } );
    
    if ( !req.file )
        return res.status( 400 ).send( "File does not exist!" );

    const post = new Post({
        userId: decodedToken._id,
        image: req.file.path,
        caption: req.body.caption,
        likes: 0,
        noComments: 0
    });
    try {
        await post.save();
        await User.updateOne( { _id: decodedToken._id }, { noPosts: user.noPosts + 1 } );
        res.send( "Posted" );
    } catch (error) {
        console.log(error);
    }
});

router.post( "/deletePost", async( req, res ) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    const user = await User.findById( { _id: req.body.post.userId } );
    await User.updateOne( { _id: user._id }, { noPosts: user.noPosts - 1 } );
    await Post.deleteOne( { _id: req.body.post._id } );
    res.send( "Deleted!" );
});

router.post( "/like", async( req, res ) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    await Post.updateOne( { _id: req.body.post._id }, { likes: req.body.post.likes + 1 } );
    res.send( "Liked" );
});

router.post( "/dislike", async( req, res ) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    await Post.updateOne( { _id: req.body.post._id }, { likes: req.body.post.likes - 1 } );
    res.send( "Disliked" );
});

router.post( "/getComments", async( req, res ) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    var comments = await Comment.find( { postId: req.body.post._id } );
    res.send( comments );
});

router.post( "/getReplies", async( req, res ) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    var replies = await Comment.find( { fatherCommentId: req.body.comment._id } );
    res.send( replies );
});

router.post( "/comment", async( req, res ) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    const post = await Post.findById( { _id: req.body.postId } );
    const user = await User.findById( { _id: decodedToken._id } );
    const comm = new Comment({
        user: user,
        postId: req.body.postId,
        text: req.body.text,
        noReplies: 0,
        noLikes: 0
    });
    try {
        await comm.save();
        res.send( "Posted" );
    } catch (error) {
        console.log(error);
    }
    await Post.updateOne( { _id: req.body.postId }, { noComments: post.noComments + 1 } );
});

async function deleteAllChildren( comment, post ) {
    var children = await Comment.find( { fatherCommentId: comment._id } );
    for ( var i = 0; i < comment.noReplies; i ++ ) {
        await Comment.deleteOne( { _id: children[i]._id } );
        await Post.updateOne( { _id: post._id }, { noComments: post.noComments - 1 } );
        post.noComments --;
        deleteAllChildren( children[i], post );
    }
}

router.post( "/deleteComm", async( req, res ) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    await Comment.deleteOne( { _id: req.body.comment._id } );

    const post = await Post.findById( { _id: req.body.comment.postId } );
    await Post.updateOne( { _id: post._id }, { noComments: post.noComments - 1 } );
    post.noComments --;

    deleteAllChildren( req.body.comment, post );

    if ( req.body.comment.fatherCommentId != null ) {
        const fatherComment = await Comment.findById( { _id: req.body.comment.fatherCommentId } );
        console.log( fatherComment );
        await Comment.updateOne( { _id: fatherComment._id }, { noReplies: fatherComment.noReplies - 1 } );
    }

    res.send( "Comment deleted!" );
});

router.post( "/replyToComm", async( req, res ) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    const post = await Post.findById( { _id: req.body.postId } );
    const fathercomm = await Comment.findById( { _id: req.body.fatherCommentId } );
    const comm = new Comment({
        userId: decodedToken._id,
        postId: req.body.postId,
        text: req.body.text,
        fatherCommentId: req.body.fatherCommentId,
        noReplies: 0,
        noLikes: 0
    });
    try {
        await comm.save();
        res.send( "Posted" );
    } catch (error) {
        console.log(error);
    }
    await Post.updateOne( { _id: req.body.postId }, { noComments: post.noComments + 1 } );
    await Comment.updateOne( { _id: req.body.fatherCommentId }, { noReplies: fathercomm.noReplies + 1 } );
});

module.exports = router;