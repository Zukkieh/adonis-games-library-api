'use strict'

const { validateAll } = use('Validator')

const List = use('App/Models/List')
const Game = use('App/Models/Game')
const User = use('App/Models/User')

class ListController {

    async index({ params, request, response }) {

        const { page = 1, limit = 10 } = request.get()

        const list = await List.query()
            .select([])
            .where('user_id', params.user_id)
            .with('game', s => {
                s.select('*')
            })
            .paginate(page, limit)

        return response.status(200).send(list)
    }
    
    async store({ request, response, auth }) {

        if (auth.user.type) {

            const errorMessages = {
                'game_id.required': 'O id do jogo é obrigatório',
                'user_id.required': 'O id do usuário é obrigatório',
            }
        
            const validation = await validateAll(request.all(), {
                game_id: 'required|number',
                user_id: 'required|number',
            }, errorMessages)
        
            if (validation.fails())
                return response.status(400).send({
                errors: validation.messages()
                })

            const { user_id, game_id } = request.all()

            const gameExist = await List.query()
                .where('game_id', game_id)
                .where('user_id', user_id)
                .first()

            const game = await Game.query()
                .where('id', game_id)
                .first()

            const user = await User.query()
                .where('id', user_id)
                .first()

            if(user.id !== auth.user.id)
                return response.status(400).send({
                    errors: 'Você não pode adicionar um jogo nessa lista'
                })
            if(!game.name)
                return response.status(400).send({
                    errors: 'Jogo não existe mais'
                })
            if(gameExist)
                return response.status(400).send({
                    errors: 'Jogo já está na lista'
                })
        
            const data = request.only(['user_id', 'game_id'])
        
            const list = await List.create({ ...data })
        
            return response.status(201).send(list)
    
        } else {
          return response.status(403).send({
            error: 'Permissão negada',
            message: 'Você não tem permissão para adicionar jogos à lista'
          })
        }
    }

    async destroy({ params, response, auth }) {

        if (auth.user.type) {

              const list = await List.query()
                .where('id', params.list_id)
                .first()
    
              if (list) {
                await list.delete()
                return response.status(204).send()

              }

        } else
            return response.status(403).send({
                error: 'Permissão negada',
                message: 'Você não tem permissão para excluir este registro'
            })
      }
}

module.exports = ListController
