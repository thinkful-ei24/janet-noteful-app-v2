'use strict';
const knex = require('../knex');
const jsonNotes = require ('../db/notes.json');



// const newItem = {
//   title: 'Hello',
//   content: 'content',
//   folder_id: 100 // Add `folderId`
// };
// const noteId = 99;

// knex.insert(newItem).into('notes').returning('id')
//   .then(([id]) => {
//     // Insert related tags into notes_tags table
//     const result = [34, 56, 78].map(tagId => ({ note_id: noteId, tag_id: tagId }));
//     console.log(`insert: ${result} into notes_tags`);
//   })
//   .then(() => {
//     // Select the new note and leftJoin on folders and tags
//     return knex.select('notes.id', 'title', 'content',
//       'folders.id as folder_id', 'folders.name as folderName',
//       'tags.id as tagId', 'tags.name as tagName')
//       .from('notes')
//       .leftJoin('folders', 'notes.folder_id', 'folders.id')
//       .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
//       .leftJoin('tags', 'tags.id', 'notes_tags.tag_id')
//       .where('notes.id', noteId);
//   });




// knex
//   .schema
//   .dropTableIfExists('notes')
//   .then((results)=>{
//     return knex.schema.createTable('notes', (table) => {
//       table.increments('id');
//       table.string('title').notNullable();
//       table.string('content', 1000);
//       table.timestamp('created_at').defaultTo(knex.fn.now());
//     });
//   }).then (results => {
//     knex('notes')
//       .insert(jsonNotes)
//       .debug(false)
//       .then(results => console.log ('notes created'));

//   })
//   .then(results => {
//     let searchTerm = 'gaga';
//     knex
//       .select('notes.id', 'title', 'content')
//       .from('notes')
//       .modify(queryBuilder => {
//         if (searchTerm) {
//           queryBuilder.where('title', 'like', `%${searchTerm}%`);
//         }
//       })
//       .orderBy('notes.id')
//       .then(results => {
//         console.log(JSON.stringify(results, null, 2));
//       })
//       .catch(err => {
//         console.error(err);
//       });
//   })
//   .then (results => {
//     let id = 5;
//     knex
//       .first('notes.id', 'title', 'content')
//       .from('notes')
//       .where({id: `${id}`})
//       .then((results)=> console.log(JSON.stringify(results)));
//   })
//   .then(results => {
//     let title= 'Hello';
//     let content= 'HELLO THIS IS NEW STUFF';
//     let id = 7;
//     knex
//       .select('notes.id', 'title', 'content')
//       .from('notes')
//       .modify(queryBuilder => {
//         if (title && content) {
//           queryBuilder.where({id: `${id}`}).update({title: `${title}`, content: `${content}` });
//         }
//       }).returning(['id', 'title', 'content'])
//       .then(results => {
//         console.log(JSON.stringify(results[0]));
//       });
//   }).then(results => {
//     const newNote = {title: 'Dogs are the best', content: 'Dogs are much better companions than cats'};
//     knex
//       .select('notes.id', 'title', 'content')
//       .from('notes')
//       .modify(queryBuilder => {
//         if (newNote.title && newNote.content) {
//           queryBuilder.insert({title: `${newNote.title}`, content: `${newNote.content}`});
//         }
//       }).returning(['id', 'title', 'content'])
//       .then(results =>  console.log(JSON.stringify(results[0])));
//   }).then(results => {
//     const id = 8;
//     knex
//       .select('notes.id', 'title', 'content')
//       .from('notes')
//       .modify(queryBuilder => {
//         if (typeof id === 'number') {
//           queryBuilder.where({id: `${id}`}).del();
//         }
//       }).returning('title')
//       .then(results => console.log("Deleted" +JSON.stringify(results)));
//   });
