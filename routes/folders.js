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
    .then(results=> res.json(results[0]))
    .catch(err => {
      next(err);
    });
});

router.put('/:id', (req, res, next) =>{
//   const updateFolderObj = {};
//   const updateableFields = ['name'];
  const id = req.params.id;
  const {name}= req.body;
  const bodyId= req.body.id;
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }
  if (bodyId!==id) {
    const err = new Error('Request parameter id does not match the body id.');
    err.status = 400;
    return next(err);
  }
  knex.select('')
    .from('folders')
    .where ({id: `${id}`})
    .update({name: `${name}`})
    .returning(['id', 'name'])
    .then(results=> res.json(results))
    .catch(err => {
      next(err);
    });

});


router.post('/', (req, res, next) =>{
  const { name } = req.body;
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  knex.select('')
    .from('folders')
    .insert({name: `${name}`})
    .returning(['id', 'name'])
    .then(results=> res.json(results))
    .catch(err => {
      next(err);
    });
    
});

module.exports = router;