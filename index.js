const WebSocket = require("ws");

const wsUrl = "wss://api.hyperliquid.xyz/ws";

const socket = new WebSocket(wsUrl);

socket.on("open", () => {
  console.log("WebSocket connection opened");

  const candleSubscription = {
    method: "subscribe",
    subscription: { type: "candle", coin: "BTC", interval: "1h" },
  };
  socket.send(JSON.stringify(candleSubscription));

  const orderBookSubscription = {
    method: "subscribe",
    subscription: { type: "l2Book", coin: "BTC" },
  };
  socket.send(JSON.stringify(orderBookSubscription));
});

socket.on("message", (data) => {
  const message = JSON.parse(data);
  console.log("Received message:", message);

  switch (message.type) {
    case "candleUpdate":
      console.log("Candle Update:", message.data);
      break;
    case "l2BookUpdate":
      console.log("Order Book Update:", message.data);
      break;
  }
});

socket.on("close", () => {
  console.log("WebSocket connection closed");
});
