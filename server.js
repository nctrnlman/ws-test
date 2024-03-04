const WebSocket = require('ws');

const ws = new WebSocket('wss://ws.aevo.xyz');

const subscribeOrderBook = (symbol) => {
  const subscribeMsg = {
    op: 'subscribe',
    data: [`orderbook:${symbol}`],
  };

  ws.send(JSON.stringify(subscribeMsg));
};

const handleOrderBookMessage = (message) => {
  const data = JSON.parse(message);

  if (data.channel && data.channel.startsWith('orderbook')) {
    if (data.data.type === 'snapshot') {
      console.log('Order Book Snapshot:', data.data);
    } else if (data.data.type === 'update') {
      console.log('Order Book Update:', {
        channel: data.channel,
        type: data.data.type,
        instrument_id: data.data.instrument_id,
        instrument_name: data.data.instrument_name,
        instrument_type: data.data.instrument_type,
        bids: data.data.bids,
        asks: data.data.asks,
        last_updated: data.data.last_updated,
        checksum: data.data.checksum,
      });
    }
  }
};

ws.on('open', () => {
  console.log('WebSocket connection opened');

  subscribeOrderBook('ETH-PERP');
});

ws.on('message', (message) => {
  handleOrderBookMessage(message);
});

ws.on('close', () => {
  console.log('WebSocket connection closed');
});

ws.on('error', (error) => {
  console.error('WebSocket connection error:', error);
});
