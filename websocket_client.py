import asyncio
from websockets import client

async def main():
    async with client.connect("ws://localhost:8765") as websocket:
        print("Connected to server.")

        async for message in websocket:
            print(message)

        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())