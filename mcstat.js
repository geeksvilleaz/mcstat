const NUM_FIELDS = 6;
const DEFAULT_TIMEOUT_IN_MS = 5000; 

module.exports = {
  init: function(address, port)
  {
    this.address = address;
    this.port = port;

    const net = require('net');
    const start_time = new Date();
    const client = net.connect(port, address, () => {
      this.latency = Math.round(new Date() - start_time);
      const buff = Buffer.from([ 0xFE, 0x01 ]);
      client.write(buff);
    });

    client.setTimeout(DEFAULT_TIMEOUT_IN_MS);

    client.on('data', (data) => {
      if (data != null && data != '') {
        const server_info = data.toString().split("\x00\x00\x00");

        if (server_info != null && server_info.length >= NUM_FIELDS) {
          this.online = true;
          this.version = server_info[2].replace(/\u0000/g,'');
          this.motd = server_info[3].replace(/\u0000/g,'');
          this.current_players = server_info[4].replace(/\u0000/g,'');
          this.max_players = server_info[5].replace(/\u0000/g,'');
        } else {
          this.online = false;
        }
      }

      client.end();
    });

    client.on('timeout', () => {
      client.end();
      process.exit();
    });

    client.on('end', () => {});

    client.on('error', (error) => {
      console.error(error);
    });
  }
};