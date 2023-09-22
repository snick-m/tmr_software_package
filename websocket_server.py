import asyncio
from websockets import server

async def websocket_handler(websocket: server.WebSocketServerProtocol):
    print("Client Connected.")

    async for message in websocket:
        for client in websocket.ws_server.websockets:
            await client.send(message)
        print(message)

    print("Client disconnected.")

async def main():
    async with server.serve(websocket_handler, "localhost", 8765):
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())