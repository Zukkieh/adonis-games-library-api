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
  return { greeting: 'Hello world, Lucas' }
})

Route.post('user', 'UserController.store').as('user.store')
Route.post('auth', 'AuthController.authenticate').as('auth.authenticate')

Route.group(() => {
  Route.patch('auth/:user_id', 'AuthController.update').as('auth.update')
  Route.get('user/:username', 'UserController.show').as('user.show')
}).middleware('auth')
