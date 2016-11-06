var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');
  res.render('markdown', { title: 'Markdown' });
  console.log("Mark Down Page");
});

module.exports = router;
