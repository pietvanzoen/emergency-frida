const { readdirSync, readFileSync } = require('fs');
const fastify = require('fastify');
const path = require('path');


const fridas = readdirSync('./public/images');
const view = readFileSync('./view.html', 'utf-8');
const fourohfour = readFileSync('./404.html', 'utf-8');


const server = fastify({
  logger: true
});

server.register(require('fastify-static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
})

server.get('/', async (request, reply) => {
  const frida = sample(fridas);
  reply.type('text/html');
  return template(frida);
})

server.get('/-/:id', async (request, reply) => {
  const frida = fridas.find(f => f.startsWith(request.params.id));
  reply.type('text/html');
  if (!frida) {
    reply.code(404);
    return fourohfour;
  }
  return template(frida);
})

server.get('*', async (request, reply) => {
  reply.type('text/html');
  reply.code(404);
  return fourohfour;
});

server.listen(8080, '0.0.0.0', (err, address) => {
 if(err) {
   console.error(err)
   process.exit(1)
 }
 console.log(`Server listening at ${address}`)
})

// server.get('/ping', async (request, reply) => {
//  return 'pong\n'
// })

// server.listen(8080, (err, address) => {
//  if(err) {
//    console.error(err)
//    process.exit(1)
//  }
//  console.log(`Server listening at ${address}`)
// })
//
function template(frida) {
  return view
    .replace('{{src}}', path.join('/public/images', frida))
    .replace('{{permalink}}', permalink(frida));
}

function sample(items) {
   return items[Math.floor(Math.random() * items.length)];
}

function permalink(file) {
  return path.join('/-/', path.parse(file).name);
}
