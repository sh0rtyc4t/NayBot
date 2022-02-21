# Nay

A Discord bot using [Eris](https://github.com/abalabahaha/eris/) library, Nay is a bot focused on bringing entertainment and fun to its servers.

# How do i run the bot?

### Requirements

* [NodeJS](https://nodejs.org/) >= **16.0.0***
* [NPM](https://npmjs.com) >= **8.0.0***
* [Firebase Firestore Database](https://firebase.google.com/)

**It may work on versions below the list, however, NOT TESTED*

### Preparation

#### Download

Download this repository and enter from the main folder using:
```sh
git clone https://github.com/sh0rtyc4t/NayBot.git && cd NayBot
```
or download the [zip file](https://github.com/sh0rtyc4t/NayBot/archive/refs/heads/main.zip) and extract.

#### Install Dependencies

In project folder, use:
```sh
npm install
# or
yarn install
```
and wait while dependencies are installed.

### Adaptation

In the `NayBot/config/` folder, create the file `security.json` using the following template:
```json
{
    "BOT-NAME": {
        "firebaseConfig": {
            // YOUR FIREBASE SERVICE ACCOUNT CREDENTIALS OBJECT
        },

        "token": "BOT-TOKEN",

        "prefix": "BOT-PREFIX"
    },

    "any": {
        // OPTIONAL OBJECTS FOR ANY INSTANCE
    }
}
```

If you want, replace "nay" in the `index.js` for your bot name used in the template above.

If you have a test bot, create a second object using the same template as above.

In the `NayBot/config/` folder, create the file `settings.json` using the following template:

```json
{
    "intents": 0, // YOUR BOT INTENTS

    "shardAmount": 1, // QUANTITY OF SHARDS OF YOUR BOT

    "owners": [], // YOUR ID AND OTHER DEVELOPERS, IF ANY

    "devGuilds": [], // YOURS TEST GUILDS IDS

    "dmLogChannel": "", // YOUR DMS LOG CHANNEL IDS

    "alertsLogChannel": "", // YOUR ERRORS AND WARNINGS LOG CHANNEL ID

    "guildsLogChannel": "", // YOUR GUILDS LOG CHANNEL ID

    "serversCountChannel": "", // YOUR SERVERS COUNT CHANNEL ID
    
    "membersCountChannel": "", // YOUR MEMBERS COUNT CHANNEL ID

    "baseColor": "", // BOT BASECOLOR FOR EMBEDS IN HEX

    "urls": {
        "botServerInvite": "", // YOUR BOT SERVER INVITE URL
        "botRepoUrl": "" // YOUR BOR REPOSITORY URL
    }
}
```

### Running

With everything ready, you can start the bot on the main instance using `npm start`, or on a development instance using `npm run dev` (nodemon is required).

# ESlint

The eslint configuration used in the project is in the `.eslintrc.json` file. For validation, use the `npm run validate` script. To fix all fixable errors, use `npm run lint`

# Licence

Refer to the [LICENSE](https://github.com/sh0rtyc4t/NayBot/blob/main/LICENSE) file.
