module.exports = {
  apps : [{
    script: 'server.js',
    watch: true,
    env:{
      PORT:8000,
      JWT_SECRET: "7aCdTm#$ZnItrn8ap9c2kZgfshgjd",
    }
  }]
};
