const http = require('http');
const url = require('url');
const stat = require('./mcstat');

http.createServer(function(req, res) {
  
  const reqUrlString = req.url;
  const urlObj = url.parse(reqUrlString, true, false);
  let output = '';

  if (urlObj.path === '/mcstat') {
    stat.init('billbailey.xyz', 25565, function (result) {
      if (stat.online) {
        output = `
          Server is online running version ${stat.version} with ${stat.current_players} out of ${stat.max_players} players.
          Message of the day: ${stat.motd}
          Latency: ${stat.latency}ms
        `;
      } else {
        output = 'Server is offline!'
      }

      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end(output);
    });
  }
}).listen(3000, '127.0.0.1');

console.log('Server running on http://127.0.0.1:3000');
