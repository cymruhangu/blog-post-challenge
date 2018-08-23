'use strict';
const mongoose =require('mongoose');
mongoose.Promise = global.Promise;

// this is our schema to represent a blog post
const blogPostSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  author: {
    firstName: { type: String},
    lastName: {type: String}
  },
  created: {type: Date, default: Date.now}
});


blogPostSchema.virtual('authorString').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});


// this is an *instance method* which will be available on all instances
// of the model. This method will be used to return an object that only
// exposes *some* of the fields we want from the underlying data
blogPostSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    content: this.content,
    author: this.authorString,
    create:this.created
  };
};


const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = {BlogPost};
