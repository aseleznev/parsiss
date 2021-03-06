export default {
    type: 'postgres',
    name: 'default',
    url: process.env.TYPEORM_URL,
    host: process.env.TYPEORM_HOST,
    port: parseInt(process.env.TYPEORM_PORT),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    schema: process.env.TYPEORM_SCHEMA,
    entities: ['src/**/*.entity.ts'],
    migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN === 'true',
    synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
    debug: process.env.TYPEORM_DEBUG === 'true',
    dropSchema: process.env.TYPEORM_DROP_SCHEMA === 'true',
    logging: process.env.TYPEORM_LOGGING === 'true'
};
