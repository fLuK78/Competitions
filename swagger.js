const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Competition API',
    description: 'API สำหรับจัดการสมาชิก'
  },
  host: 'localhost:4000',
  schemes: ['http'],
  consumes: ['application/json'], 
  produces: ['application/json']  
};

const outputFile = './swagger-output.json';
const routes = ['./src/index.js']; 

swaggerAutogen(outputFile, routes, doc).then(() => {
    console.log("Swagger output generated successfully");
});