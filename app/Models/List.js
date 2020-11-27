'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class List extends Model {

    user() {
        return this.belongsTo('App/Models/User')
    }

    game() {
        return this.belongsTo('App/Models/Game')
    }

}

module.exports = List
