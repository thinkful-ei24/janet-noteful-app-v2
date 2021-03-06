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
    .returning(['id', 'name'])
    .then((results)=> {
      console.log("============");
      console.log(results);
      res.json(results[0]);
    })
    .catch(err => {
      next(err);
    });
});


//========UPDATE TAG NAME=============
router.put('/:id', (req,res,next) =>{
  const tagID = req.params.id;
  const {name}= req.body;

  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  knex.select()
    .from('tags')
    .where({id: `${tagID}`})
    .update({'name' : `${name}`})
    .returning(['id','name'])
    .then(results=> res.json(results))
    .catch(err => {
      next(err);
    });
});

//========CREATE NEW TAG=============
router.post('/', (req,res,next) =>{
  const {name}= req.body;
  
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }
  
  knex.select()
    .from('tags')
    .insert({name:`${name}`})
    .returning(['id','name'])
    .then(results=> {
      res.location(`${req.originalUrl}/${results[0].id}`).status(201).json(results[0]);
    })
    .catch(err => {
      next(err);
    });
});

//========DELETE A TAG BY ID=============

router.delete('/:id', (req, res, next)=>{
  const tagID = req.params.id;

  knex('tags')
    .where({id: `${tagID}`}).del()
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
