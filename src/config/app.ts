export default {
  port: process.env.NODE_PORT || 3000,
  development: process.env.NODE_ENV == 'development',
  accessToken: process.env.ACCESS_TOKEN,
  isProduction() {
    return this.get('express.NODE_ENV') === 'production';
  }
};
