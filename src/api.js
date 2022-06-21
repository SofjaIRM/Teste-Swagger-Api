const Hapi = require('@hapi/hapi')
const Joi = require('joi');
const Context = require('./db/strategies/base/contextStrategy')
const MongoDB = require('./db/strategies/mongodb/mongodb')
const HeroSchema = require('./db/strategies/mongodb/schemas/heroisSchema')
const HeroRoute = require('./routes/heroRoutes')

const HapiSwagger = require('hapi-swagger')
const Vision = require('@hapi/vision')
const Inert = require('@hapi/inert')

const app = new Hapi.Server({
    port: 4000
})
function mapRoutes (instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {

    const connection = MongoDB.connect()
    const context = new Context(new MongoDB(connection, HeroSchema))

    const swaggerOptions = {
        info: {
            title: 'Api herois - Ilso Christ',
            version: 'v1.0'
        },
    }

    await app.register([
        Vision,
        Inert,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ])

    app.validator(Joi);

    app.route(
        mapRoutes(new HeroRoute(context), HeroRoute.methods())
    )

    await app.start()
    console.log('server running at', app.info.port)

    return app;
}
module.exports = main()
