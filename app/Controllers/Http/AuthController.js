'use strict'

const Hash = use('Hash')
const { validateAll } = use('Validator')

const User = use('App/Models/User')

class AuthController {

    async authenticate({ request, response, auth }) {

        const errorMessages = {
            'email.required': 'O email é obrigatório',
            'password.required': 'A senha é obrigatória'
        }

        const validation = await validateAll(request.all(), {
            email: 'required|string',
            password: 'required|string'
        }, errorMessages)

        if (validation.fails())
            return response.status(400).send({
                errors: validation.messages()
            })

        const { email, password } = request.all()

        const { token } = await auth.attempt(email, password)

        const user = await User.query()
            .where('email', email)
            .first()

        if (user.deleted)
            return response.status(401).send({
                error: 'Permissão negada',
                message: 'Este usuário foi excluído'
            })

        let data

        // if (user.type == 'Adm')
        //     data = await user.coordinator().with('course').fetch()

        // else if (user.type == 'Default')
        //     data = await user.student().with('course')
        //         .with('monitoring', monitor => {
        //             monitor.select(['id', 'workload', 'semester', 'subject_id', 'student_id'])
        //                 .where('deleted', false)
        //         }).fetch()

        return response.status(200).send({
            token,
            type: user.type,
            data: {
                id: user.id,
                email: user.email,
                username: user.username,
                ...(data && data.$attributes),
                ...(data && data.$relations)
            }
        })
    }
    async update({ params, request, response, auth }) {

        const errorMessages = {
            'password.required': 'As senhas são obrigatórias',
            'password.old.required': 'A senha atual é obrigatória',
            'password.new.required': 'A nova senha é obrigatória',
            'password.new.different': 'A nova senha deve ser diferente da atual',
            'password.old.min': 'A senha atual possui no mínimo 6 caracteres',
            'password.new.min': 'A nova senha deve possuir no mínimo 6 caracteres'
        }

        const validation = await validateAll(request.all(), {
            password: 'required|object',
            'password.old': 'required|string|min:6',
            'password.new': 'required|string|min:6|different:password.old',
        }, errorMessages)

        if (validation.fails())
            return response.status(400).send({
                errors: validation.messages()
            })

        const { password } = request.all()

        if (auth.user.id == params.user_id) {

            const user = await User.query()
                .where('id', params.user_id)
                .first()

            const isSame = await Hash.verify(password.old, user.password)

            if (!isSame)
                return response.status(400).send({
                    error: 'Senha inválida',
                    message: 'A senha atual está incorreta'
                })

            user.password = password.new
            await user.save()

            return response.status(200).send({
                success: true,
                message: 'Usuário atualizado com sucesso'
            })

        } else
            return response.status(403).send({
                error: 'Permissão negada',
                message: 'Você não tem permissão para alterar este registro'
            })
    }
}

module.exports = AuthController
