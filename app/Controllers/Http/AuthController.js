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
            user_type: user.type,
            data: {
                email: user.email,
                name: user.name,
                ...(data && data.$attributes),
                ...(data && data.$relations)
            }
        })
    }
}

module.exports = AuthController
