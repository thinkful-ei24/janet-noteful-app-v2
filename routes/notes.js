'use strict';

const express = require('express');
const router = express.Router();
//db table is called 'notes'. DB is noteful-app from user dev
const knex = require('../knex');
const hydrateNotes = require('../utils/hydrateNotes');

//=======Get All (and search by query)=======
router.get('/', (req, res, next) => {
  const { searchTerm } = req.query;
  const {folderID} = req.query;
  const {tagID} = req.query;
 
  knex.select('notes.id', 'title', 'content', 'folders.id as folderId', 'folders.name as folderName', 'tags.id as tagId', 'tags.name as tagName')
    .from('notes')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .leftJoin('notes_tags', 'note_id', 'notes.id')
    .leftJoin('tags', 'tags.id', 'tag_id')
    .modify(function (queryBuilder) {
      if (searchTerm) {
        queryBuilder.where('title', 'like', `%${searchTerm}%`);
      }
    })
    .modify(function (queryBuilder) {
      if (folderID) {
        queryBuilder.where('folder_id', folderID);
      }
    })
    .modify(function (queryBuilder) {
      if (tagID) {
        queryBuilder.where('tag_id', tagID);
      }
    })
    .orderBy('notes.id')
    .then(result => {
      if (result) {
        const hydrated = hydrateNotes(result);
        res.json(hydrated[0]);
      } else {
        next();
      }
    })
    .catch(err => next(err));

});

//========== Get a single item==========
// using req.params
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  
  knex.select('notes.id', 'title', 'content', 'folders.id as folderId', 'folders.name as folderName', 'tags.id as tagId', 'tags.name as tagName')
    .from('notes')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .leftJoin('notes_tags', 'note_id', 'notes.id')
    .leftJoin('tags', 'tags.id', 'tag_id')
    .where({'notes.id':`${id}`})
    .then(result => {
      if (result) {
        const hydrated = hydrateNotes(result);
        res.json(hydrated[0]);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});


//========== INSERT A SINGLE ITEM ========== //

router.post('/', (req, res, next) => {
  const { title, content, folderId } = req.body; // Add `folderId` to object destructure

  //const newItem = { title, content, folderID };

  const newItem = {
    title: title,
    content: content,
    folder_id: folderId  // Add `folderId`
  };

 
  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  let noteId;
  // Insert new note, instead of returning all the fields, just return the new `id`
  knex.insert(newItem)
    .into('notes')
    .returning('id')
    .then(([id]) => {
      noteId = id;
      // Using the new id, select the new note and the folder
      return knex.select('notes.id', 'title', 'content', 'folder_id as folderId', 'folders.name as folderName')
        .from('notes')
        .leftJoin('folders', 'notes.folder_id', 'folders.id')
        .where('notes.id', noteId);
    })
    .then(([result]) => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err));
});


/* ========== PUT/UPDATE A SINGLE ITEM ========== */

router.put('/:id', (req, res, next) => {
  const noteId = req.params.id;
  const { title, content, folderID } = req.body;

  const updateItem = {
    title: title,
    content: content,
    folder_id: (folderID) ? folderID : null
  };

  //   /***** Never trust users - validate input *****/
  //   const updateObj = {};
  //   const updateableFields = ['title', 'content', 'folderId'];

  //   updateableFields.forEach(field => {
  //     if (field in req.body) {
  //       updateObj[field] = req.body[field];
  //     }
  //   });

  /***** Never trust users - validate input *****/
  if (!updateItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  knex('notes')
    .update(updateItem)
    .where('id', noteId)
    .then((results) => {
      // Using the noteId, select the note and the folder info
      return knex.select('notes.id', 'title', 'content', 'folder_id as folderId', 'folders.name as folderName')
        .from('notes')
        .leftJoin('folders', 'notes.folder_id', 'folders.id')
        .where('notes.id', noteId);
    })
    .then((results) => {
      // if (result) {
      res.json(results[0]);
      // } 
      // else {
      //   next();
      // }
    })
    .catch(err => {
      next(err);
    });
});

//============ Delete an item==========================
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  
  knex('notes')
    .where({id: `${id}`}).del()
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
