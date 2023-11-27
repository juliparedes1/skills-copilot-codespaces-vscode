// Create web server 
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Comment = require('./models/comment');
const CommentService = require('./services/commentService');
const commentService = new CommentService();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/comment');
mongoose.connection.on('error', (err) => {
    console.error(err);
    console.log('MongoDB connection error. Please make sure MongoDB is running.');
    process.exit();
});

// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Set port
const port = process.env.PORT || 8080;

// Create router
const router = express.Router();

// Middleware to use for all requests
router.use((req, res, next) => {
    console.log('Something is happening.');
    next();
});

// Test route to make sure everything is working
router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the comment api!'
    });
});

// Routes for comments
router.route('/comments')

    // Create a comment
    .post((req, res) => {
        commentService.createComment(req, res);
    })

    // Get all comments
    .get((req, res) => {
        commentService.getAllComments(req, res);
    });

// Routes for comment by id
router.route('/comments/:comment_id')

    // Get comment by id
    .get((req, res) => {
        commentService.getCommentById(req, res);
    })

    // Update comment by id
    .put((req, res) => {
        commentService.updateCommentById(req, res);
    })

    // Delete comment by id
    .delete((req, res) => {
        commentService.deleteCommentById(req, res);
    });

// Register routes
app.use('/api', router);

// Start server
app.listen(port);
console.log('Server started on port ' + port);