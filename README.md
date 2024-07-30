# Kindly Webhook, authentication and authorization workflows

Build your first webhook with Kindly! This guide will help you understand how to create a webhook, authenticate it, and authorize it to access your resources.

## Prerequisites

- A Kindly account with a Kindly workspace.
- A trigger dialogue with a slug named `tvmazeresult`, this dialogue can use the context keys `TVShowName`, `TVShowRating`, `TVShowGenre` and `TVShowSummary`.
- A trigger dialogue with a slug named `tvmazeerror`.
- A dialogue that triggers the webhook at `/helloworld`
- A dialogue that triggers the webhook at `/am_i_authenticated`
- A dialogue that triggers the webhook at `/tvmaze` - This dialogue needs a `TVShowName` context key to be set in the chat before being triggered.

## Getting started with local development

Once you're all set up, you can clone this repository to your local machine.

```bash
git clone git@github.com:kindly-ai/webhook-and-authentication-demo.git
```

Make sure you are using Node 18 or higher.

```bash
node -v
```

Install the dependencies.

```bash
npm install
```

Start the server.

```bash
npm start
```

🎉 If everything went smoothly, you should have a webserver running at http://localhost:3001

## Authentication

To validate that the webhook requests are coming from Kindly, we use an HMAC verification algorithm. You need to replace the key inside the `access_control > keys > webhookSignature` file to your own (`Settings > General > Security > Webhook HMAC`)

You can find a demo authentication flow in the `demo` folder. This flow is a simple example of how you can authenticate a user and generate a JWT token to authorize the user to access your resources.

The demo page will prompt you for a bot key. You can find your bot key in the Kindly dashboard under `Connect > Chat client > Kindly Chat`. The bot key is visible in the `HTML code` snippet. The demo page will also prompt you for a user name. This user name is for demonstration purposes and will be used to generate the JWT token. In a real-world scenario, you would use your own authentication system to generate the JWT token's information.

You will also need to use a RSA private/public key pair to sign and verify the JWT token.
For this demo, we have included a private and a public key in the `demo` folder. You will need to paste the public key in the Kindly dashboard under `Settings > Kindly Chat > Authentication`. Of course, in a real-world scenario, do not expose your private keys either in a repository or in your frontend code.

Note: Our system do not allow whitelisting a localhost domain. To fully test the demo page, you need to deploy it to a live server, or use a tool like `ngrok` to expose your local server to the internet.

Resources:

- [Kindly docs: Chat authentication](https://docs.kindly.ai/guides-and-examples/chat-authentication)
- [Kindly docs: Webhook HMAC signature verification](https://docs.kindly.ai/hmac)

## Webhooks

In this demo, we have included a few webhook examples that you can use to experiment with. The webhooks are the following:

- `/webhook/helloworld`: A simple webhook that responds with a `Hello, World!` message.
- `/webhook/tvmaze`: A webhook that fetches information about a TV show from the TVMaze API and triggers a follow up dialogue with the information. The triggered dialogue can make use of context keys to display the information. This webhook requires the `TVShowName` context key to be defined in the chat before being triggered.
- `/webhook/am_i_authenticated`: A webhook that checks if the user is authenticated and responds with a message.

Resources:

- [Kindly docs: Webhooks](https://docs.kindly.ai/webhooks)
- [Kindly docs: Context keys](https://docs.kindly.ai/context-memory)

## Webhook signature verification

Kindly sends a signature in the `Kindly-HMAC` header with each webhook request. This signature is a hash of the request body and your webhook secret. You can use this signature to verify that the request is coming from Kindly.

You can find the secret in the Kindly dashboard under `Settings > General > Security > Webhook HMAC`.

Resources:

- [Kindly docs: Webhook HMAC signature verification](https://docs.kindly.ai/hmac)

## Using ngrok to develop locally

To allow Kindly to access your local server, you can use [ngrok](https://ngrok.com/). Ngrok is a tool that allows you to expose your local server to the internet.

In a new terminal, start `ngrok` so you can tunnel requests from Kindly to your local app:

```bash
ngrok http 3001
```

If you are using a different tool than ngrok, make sure to whitelist them in the `generateJWT.js` file.

Note: This is a simple Express server that listens for incoming requests and responds with a simple message. You can modify the server to experiment your needs. If you do make modifications, make sure to restart the server to see the changes.
