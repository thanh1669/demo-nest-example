/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import * as cors from 'cors';
import * as csurf from 'csurf';
import * as compress from 'compression';
import * as cookieParser from 'cookie-parser';
import * as methodOverride from 'method-override';

import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { environment } from '@app/shared/environments';

/**
 * Swagger Document
 * @param app
 * @param port
 * @param prefix
 */
function appInitSwagger(app, port, prefix) {
    const swaggerDocOptions = new DocumentBuilder()
        .setTitle('Nest Example Api')
        .setDescription('API documentation for Nest Example')
        .setVersion('1.0.0')
        .addServer(`http://localhost:${port}/${prefix}`, 'Development API')
        .addApiKey({ name: 'X-XSRF-TOKEN', type: 'apiKey' }, 'X-XSRF-TOKEN')
        .addBearerAuth()
        .build();
    const swaggerDoc = SwaggerModule.createDocument(
        app,
        swaggerDocOptions
    );
    SwaggerModule.setup(`${prefix}/docs`, app, swaggerDoc, {
        swaggerOptions: {
            docExpansion: 'none',
            filter: true,
            showRequestDuration: true,
        },
    });
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const port = environment.PORT;
    const globalPrefix = 'api';

    // shutdown graceful
    app.enableShutdownHooks();

    // lets you use HTTP verbs such as PUT or DELETE
    // in places where the client doesn't support it
    app.use(methodOverride());

    // gzip compression
    app.use(compress());

    // parse Cookie header and populate
    app.use(cookieParser());

    // cross-site request forgery
    app.use(csurf({ cookie: true }));
    app.use((req, res, next) => { res.cookie('_xsrf', req.csrfToken()), next() });

    // secure apps by setting various HTTP headers
    app.use(helmet());

    // enable CORS - Cross Origin Resource Sharing
    app.use(cors());

    // app register
    Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
    appInitSwagger(app, port, globalPrefix);
    app.setGlobalPrefix(globalPrefix);
    await app.listen(port);
}

bootstrap();
