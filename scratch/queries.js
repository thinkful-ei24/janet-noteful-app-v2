'use strict';
const knex = require('../knex');
const jsonNotes = require ('../db/notes.json');

knex
  .schema
  .dropTableIfExists('notes')
  .then((results)=>{
    return knex.schema.createTable('notes', (table) => {
      table.increments('id');
      table.string('title').notNullable();
      table.string('content', 1000);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  }).then (results => {
    knex('notes')
      .insert(jsonNotes)
      .debug(false)
      .then(results => console.log ('notes created'));

  })
  .then(results => {
    let searchTerm = 'gaga';
    knex
      .select('notes.id', 'title', 'content')
      .from('notes')
      .modify(queryBuilder => {
        if (searchTerm) {
          queryBuilder.where('title', 'like', `%${searchTerm}%`);
        }
      })
      .orderBy('notes.id')
      .then(results => {
        console.log(JSON.stringify(results, null, 2));
      })
      .catch(err => {
        console.error(err);
      });
    

  });
  


