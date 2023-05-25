# Metriport

Metriport is FOSS! Yay! That's all.

1. Login
2. Go to "Developers"
3. Toggle "Sandbox" on
4. Click "Generate secret key"
5. Copy the key

From now on, when I say "make the request", click the "copy" button for the curl and replace `api.metriport.com` with `api.sandbox.metriport.com`

6. Go to https://docs.metriport.com/devices-api/api-reference/user/create-user. Under "Authorization", enter your secret key. Under "Query", enter some name. I am "evan". Make note of the userId
7. Go to https://docs.metriport.com/devices-api/api-reference/user/create-connect-token, and fill it out in a similar manner. Put the userId in the query, instead of the username. Run it, and make note of the token.
8. Navigate to https://connect.metriport.com/?token={token}&sandbox=true, and complete the OAuth flow.

If you so choose, you may complete a sanity check by running the request here: https://docs.metriport.com/devices-api/api-reference/user/get-connected-providers

```
{"connectedProviders":["garmin"]}
```

You're all set. Add

```
METRI_SECRET=...
METRI_USER=...
```

to your `.env`. Suprisingly pleasant experience. The first provider will be used.
