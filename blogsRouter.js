const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


const {BlogPosts} = require('./models');

// Seed with Blog posts
BlogPosts.create(
  'Dolor duis pariatur', 
  'Anim Lorem eu sunt exercitation anim nostrud exercitation elit qui. Excepteur nulla incididunt labore magna commodo officia pariatur laboris labore. Deserunt laboris pariatur laborum nisi nisi sunt dolore consectetur ipsum Lorem.',
  'Steve Austin');

BlogPosts.create(
  'Exercitation reprehenderit ullamco.',
  'Sunt enim laborum elit sint culpa duis ex ad sint minim eiusmod. Qui id aliquip ut ex veniam pariatur ad exercitation occaecat proident. Et duis veniam in dolor aliquip elit non. Ullamco consequat et non commodo nostrud pariatur enim dolor ad.',
  'Desmond Tutu');

// send back JSON representation of all recipes
// on GET requests to root
router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
  res.status(201).json(item);
});

// Delete blogpost (by id)!
router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted BlogPost item \`${req.params.ID}\``);
  res.status(204).end();
});


router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author', 'id'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog post item \`${req.params.id}\``);
  const updatedItem = BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  });
  res.status(204).end();
})

module.exports = router;