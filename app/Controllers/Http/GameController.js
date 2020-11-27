'use strict'

const { validateAll } = use('Validator')

const Game = use('App/Models/Game')

class GameController {

    async index({ params, request, response }) {

        const { page = 1, limit = 10 } = request.get()
    
        const games = await Game.query()
        .select([
            'id',
            'name',
            'category',
            'image'
        ])
        .paginate(page, limit)
    
        return response.status(200).send(games)
    }

    async store({ request, response, auth }) {

        if (auth.user.type == 'Adm') {
    
            const errorMessages = {
                'name.required': 'O nome é obrigatório',
                'name.unique': 'Jogo já cadastrado',
                'category.required': 'A categoria é obrigatória',
                'image.required': 'A imagem é obrigatória',
            }
        
            const validation = await validateAll(request.all(), {
                name: 'required|string|unique:games',
                category: 'required|string',
                image: 'required|string',
            }, errorMessages)
        
            if (validation.fails())
                return response.status(400).send({
                errors: validation.messages()
                })
        
            const data = request.only(['name', 'category', 'image'])
        
            const game = await Game.create({ ...data })
        
            return response.status(201).send(game)
    
        } else {
          return response.status(403).send({
            error: 'Permissão negada',
            message: 'Você não tem permissão para criar novos jogos'
          })
        }
    }

    async update({ params, request, response, auth }) {

        if(auth.user.type == 'Adm'){

            const { name, category, image } = request.all()

            const game = await Game.query()
                .where('id', params.game_id)
                .first()
            
            if(name)
                game.name = name
            if(category)
                game.category = category
            if(image)
                game.image = image

            game.save()

            return response.status(200).send({
                success: true,
                message: 'Jogo atualizado com sucesso'
            })

        } else
            return response.status(403).send({
                error: 'Permissão negada',
                message: 'Você não tem permissão para alterar este registro'
            })
    }

    async destroy({ params, response, auth }) {

        if (auth.user.type) {

              const game = await Game.query()
                .where('id', params.game_id)
                .first()
    
              if (game) {
                await game.delete()
                return response.status(204).send()

              }

        } else
            return response.status(403).send({
                error: 'Permissão negada',
                message: 'Você não tem permissão para excluir este registro'
            })
      }

}

module.exports = GameController
