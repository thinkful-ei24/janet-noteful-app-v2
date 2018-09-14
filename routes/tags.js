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


// 'use strict';

// const express = require('express');
// const router = express.Router();

// const knex = require('../knex');

// /* ========== GET/READ ALL TAGS ========== */
// router.get('/', (req, res, next) => {
//   knex.select('id', 'name')
//     .from('tags')
//     .then(results => {
//       res.json(results);
//     })
//     .catch(err => {
//       next(err);
//     });
// });

// /* ========== GET/READ SINGLE TAGS ========== */
// router.get('/:id', (req, res, next) => {
//   knex.first('id', 'name')
//     .where('id', req.params.id)
//     .from('tags')
//     .then(result => {
//       if (result) {
//         res.json(result);
//       } else {
//         next();
//       }
//     })
//     .catch(err => {
//       next(err);
//     });
// });

// /* ========== POST/CREATE ITEM ========== */
// router.post('/', (req, res, next) => {
//   const { name } = req.body;

//   /***** Never trust users. Validate input *****/
//   if (!name) {
//     const err = new Error('Missing `name` in request body');
//     err.status = 400;
//     return next(err);
//   }

//   const newItem = { name };

//   knex.insert(newItem)
//     .into('tags')
//     .returning(['id', 'name'])
//     .then((results) => {
//       const result = results[0];
//       res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
//     })
//     .catch(err => {
//       next(err);
//     });
// });

// /* ========== PUT/UPDATE A SINGLE ITEM ========== */
// router.put('/:id', (req, res, next) => {
//   const { name } = req.body;

//   /***** Never trust users. Validate input *****/
//   if (!name) {
//     const err = new Error('Missing `name` in request body');
//     err.status = 400;
//     return next(err);
//   }

//   const updateItem = { name };

//   knex('tags')
//     .update(updateItem)
//     .where('id', req.params.id)
//     .returning(['id', 'name'])
//     .then(([result]) => {
//       if (result) {
//         res.json(result);
//       } else {
//         next(); // fall-through to 404 handler
//       }
//     })
//     .catch(err => {
//       next(err);
//     });
// });

// /* ========== DELETE/REMOVE A SINGLE ITEM ========== */
// router.delete('/:id', (req, res, next) => {
//   knex.del()
//     .where('id', req.params.id)
//     .from('tags')
//     .then(() => {
//       res.status(204).end();

//     })
//     .catch(err => {
//       next(err);
//     });
// });

// module.exports = router;