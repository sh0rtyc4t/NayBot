# Nay

A Discord bot using [Eris](https://github.com/abalabahaha/eris/) library, Nay is a bot focused on bringing entertainment and fun to its servers.

# How do i run the bot?

### Requirements

* [NodeJS](https://nodejs.org/) >= **16.0.0**
* [NPM](https://npmjs.com) >= **8.0.0**
* [Firebase Realtime Database](https://firebase.google.com/)

### Preparation

##### Download

Download this repository and enter from the main folder using:
```sh
git clone https://github.com/sh0rtyc4t/NayBot.git && cd NayBot
```
or download the [zip file](https://github.com/sh0rtyc4t/NayBot/archive/refs/heads/main.zip) and extract.

##### Install Dependencies

In project folder, use:
```sh
npm install
# or
yarn install
```
and wait while dependencies are installed.

### Adaptation

in the `NayBot/config/` folder, create the file `security.json` using the following template:
```json
{
    "BOT-NAME": {
        "firebaseConfig": {
            // YOUR FIREBASE CONFIG OBJECT
        },

        "token": "BOT-TOKEN",

        "prefix": "BOT-PREFIX"
    },

    "any": {
        // OPTIONAL OBJECTS FOR ANY INSTANCE
    }
}
```

Replace "nay", in the `index.js` for your bot name used in the template above. If you have a test bot, create a second object using the same template as above.

### Running

With everything ready, you can start the bot on the main instance using `npm start`, or on a development instance using `npm run dev` (nodemon is required).

# ESlint

The eslint configuration used in the project is in the `.eslintrc.json` file. For validation, use the `npm run validate` script

# Licence

Refer to the [LICENSE](https://github.com/sh0rtyc4t/NayBot/blob/main/LICENSE) file.
