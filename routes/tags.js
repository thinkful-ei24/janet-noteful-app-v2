'use strict';

const express = require('express');
const knex = require('../knex');
const router = express.Router();


router.get('/', (req,res,next) =>{
  knex.select()
    .from('tags')
    .then(results=> res.json(results))
    .catch(err => {
      next(err);
    });
});




module.exports = router;