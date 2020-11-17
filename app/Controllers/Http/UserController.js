'use strict'

const { validateAll } = use('Validator')

const User = use('App/Models/User')

class UserController {

    async show({ params, response, auth }) {

        if (!auth.user.type) {

            const user = await User.query()
                .select([
                    'id',
                    'name',
                    'email',
                    'type',
                ])
                .where('email', params.email)
                .first()

            if (!user)
                return response.status(404).send({
                    error: 'Usuário não encontrado'
                })

            return response.status(200).send(user)

        } else
            return response.status(403).send({
                error: 'Permissão negada',
                message: 'Você não tem permissão para acessar estes dados'
            })
    }

    async store({ request, response }) {

        const errorMessages = {
          'username.required': 'O nome é obrigatório',
          'username.min': 'O nome deve possuir no mínimo 3 caracteres',
          'username.unique': 'Este nome de usuário já está cadastrado',
          'email.required': 'O email é obrigatório',
          'email.email': 'Formato de email inválido',
          'email.unique': 'Este email já está cadastrado',
          'password.required': 'A senha é obrigatória',
          'password.min': 'A senha deve possuir no mínimo 6 caracteres',
        }
    
        const validation = await validateAll(request.all(), {
          username: 'required|unique:users|min:3',
          email: 'required|email|unique:users',
          password: 'required|min:6',
        }, errorMessages)
    
        if (validation.fails()){
          return response.status(400).send({
            errors: validation.messages()
          })
        }
    
          const userData = request.only(['username', 'email', 'password'])
    
          const user = await User.create({ ...userData, type: 'Default' })
    
          return response.status(201).send(user)
    }
}

module.exports = UserController
