'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ListSchema extends Schema {
  up () {
    this.create('lists', (table) => {
      table.increments()
      table.integer('user_id').unsigned().notNullable()
        .references('id').inTable('users')
        .onUpdate('CASCADE').onDelete('CASCADE')
      table.integer('game_id').unsigned().notNullable()
        .references('id').inTable('games')
        .onUpdate('CASCADE').onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('lists')
  }
}

module.exports = ListSchema
