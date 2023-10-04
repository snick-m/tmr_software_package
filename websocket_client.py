import asyncio
from websockets import client

async def main(): # Due to the nature of websockets library, the program has to be asynchronous.
    async with client.connect("ws://localhost:8765") as websocket:
        print("Connected to server.")

        async for message in websocket: # Whenever a message is received, print it.
            print(message)

        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())