const { readdirSync, readFileSync } = require('fs');
const fastify = require('fastify');
const path = require('path');
const ms = require('ms');

const BASE_TITLE = 'Emergency Frida';

const fridas = readdirSync('./images');
const layoutHtml = readFileSync('./layout.html', 'utf-8');
const viewHtml = readFileSync('./view.html', 'utf-8');
const fourohfourHtml = readFileSync('./404.html', 'utf-8');


const server = fastify({
  logger: true
});

server.register(require('fastify-static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
  maxAge: ms('1 hour')
})

server.register(require('fastify-static'), {
  root: path.join(__dirname, 'images'),
  prefix: '/images/',
  maxAge: ms('1 week'),
  decorateReply: false
})

server.get('/', async (request, reply) => {
  const frida = sample(fridas);
  reply.type('text/html');
  return view(frida);
})

server.get('/-/:id', async (request, reply) => {
  const frida = fridas.find(f => f.startsWith(request.params.id));
  reply.type('text/html');
  if (!frida) {
    reply.code(404);
    return fourohfour();
  }
  return view(frida);
})

server.get('*', async (request, reply) => {
  reply.type('text/html');
  reply.code(404);
  return fourohfour();
});

server.listen(8080, '0.0.0.0', (err, address) => {
 if(err) {
   console.error(err)
   process.exit(1)
 }
 console.log(`Server listening at ${address}`)
})

function view(frida) {
  return layoutHtml
    .replace('{{title}}', BASE_TITLE)
    .replace('{{body}}', viewHtml)
    .replace('{{src}}', path.join('/images', frida))
    .replace('{{permalink}}', permalink(frida));
}

function fourohfour() {
  return layoutHtml
    .replace('{{title}}', `${BASE_TITLE} - 404`)
    .replace('{{body}}', fourohfourHtml)
}

function sample(items) {
   return items[Math.floor(Math.random() * items.length)];
}

function permalink(file) {
  return path.join('/-/', path.parse(file).name);
}
