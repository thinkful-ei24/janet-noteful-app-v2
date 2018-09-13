'use strict';

const express = require('express');
const knex = require('../knex');
const router = express.Router();

//========GET ALL TAGS=============
router.get('/', (req,res,next) =>{
  knex.select()
    .from('tags')
    .then(results=> res.json(results))
    .catch(err => {
      next(err);
    });
});

//========GET TAGS BY ID=============
router.get('/:id', (req,res,next) =>{
  const tagID = req.params.id;

  knex.select()
    .from('tags')
    .where({id: `${tagID}`})
    .then(results=> res.json(results))
    .catch(err => {
      next(err);
    });
});




module.exports = router;