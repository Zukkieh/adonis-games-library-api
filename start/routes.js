'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world, Lucas!' }
})

Route.post('user', 'UserController.store').as('user.store')
Route.post('auth', 'AuthController.authenticate').as('auth.authenticate')

Route.group(() => {
  Route.patch('auth/:user_id', 'AuthController.update').as('auth.update')
  Route.get('user/:username', 'UserController.show').as('user.show')
  Route.post('game', 'GameController.store').as('game.store')
  Route.patch('game/:game_id', 'GameController.update').as('game.update')
  Route.get('game', 'GameController.index').as('game.index')
  Route.delete('game/:game_id', 'GameController.destroy').as('game.destroy')
  Route.post('list', 'ListController.store').as('list.store')
  Route.get('list/:user_id', 'ListController.index').as('list.index')
  Route.delete('list/:list_id', 'ListController.destroy').as('list.destroy')
}).middleware('auth')
