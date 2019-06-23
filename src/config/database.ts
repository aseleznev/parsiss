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
  entities: process.env.TYPEORM_ENTITIES.split(','),
  migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN === 'true',
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true'
};
