let socket = null;

export const connectSocket = () => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    socket = new WebSocket('ws://172.20.10.2:3000');
  }
};

export const sendMessageSocket = (mensaje) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(mensaje));
  }
};

export const subscribeToMessages = (callback) => {
  if (!socket) return;
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    callback(data);
  };
};


export { socket };
