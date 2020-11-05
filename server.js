const { readdirSync } = require('fs');
const fastify = require('fastify');
const ms = require('ms');
const path = require('path');
const { fourohfour, frida } = require('./views');

const { NODE_ENV } = process.env;

const fridas = readdirSync('./public/images');

const server = fastify({
  logger: true,
});

server.register(require('fastify-static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
  maxAge: ms('1 year'),
  cacheControl: NODE_ENV === 'production',
});

server.get('/', async (request, reply) => {
  const file = sample(fridas);
  reply.type('text/html');
  reply.header('cache-control', 'no-cache');
  return frida(file);
});

server.get('/-/:id', async (request, reply) => {
  const file = fridas.find((f) => f.startsWith(request.params.id));
  reply.type('text/html');
  reply.header('cache-control', 'no-cache');
  if (!file) {
    reply.code(404);
    return fourohfour();
  }
  return frida(file);
});

server.get('*', async (request, reply) => {
  reply.type('text/html');
  reply.code(404);
  return fourohfour();
});

server.listen(8080, '0.0.0.0', (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

function sample(items) {
  return items[Math.floor(Math.random() * items.length)];
}
