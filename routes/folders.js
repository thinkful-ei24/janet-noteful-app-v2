'use strict';

const express = require('express');
const knex = require('../knex');
const router = express.Router();


router.get('/', (req, res, next) =>{
  knex.select()
    .from('folders')
    .then(results=> res.json(results))
    .catch(err => {
      next(err);
    });
});

router.get('/:id', (req, res, next) =>{
  const id = req.params.id;
  knex.select('')
    .from('folders')
    .where ({id: `${id}`})
    .then(results=> res.json(results))
    .catch(err => {
        next(err);
    });

});


module.exports = router;