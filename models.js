'use strict';
const mongoose =require('mongoose');
mongoose.Promise = global.Promise;

//For 2nd Challenge:
//1) Add author schema XX
//2) Add comment schema XX
//3) Add author pre-hook to populate to find, findOne XX
//4) Change blogpost schema to include array of comments XX
//5) Post requests should contain author_id in JSON object
//6) PUT request only allows update of title and content XX
//7) Add endpoints to create, update, and delete authors
//8) Deploy to Heroku

const authorSchema = mongoose.Schema({
  firstName: 'string',
  lastName: 'string',
  userName: {
    type: 'string',
    unique: true
  }
});

const commentSchema = mongoose.Schema({ content: 'string' });

const blogPostSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
  created: {type: Date, default: Date.now},
  comments: [commentSchema]
});

//MIDDLEWARE
blogPostSchema.pre('findOne', function(next) {
  this.populate('author');
  next();
});

blogPostSchema.pre('find', function(next) {
  this.populate('author');
  next();
});
//

blogPostSchema.virtual('authorName').get(function() {
  return (`${this.author.firstName} ${this.author.lastName}`).trim();
});


// this is an *instance method* which will be available on all instances
// of the model. This method will be used to return an object that only
// exposes *some* of the fields we want from the underlying data
blogPostSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    content: this.content,
    author: this.authorName,
    created: this.created,
    comments: this.comments
  };
};

let Author = mongoose.model('Author', authorSchema);
const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = {Author, BlogPost};
