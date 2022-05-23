const Eris = require("eris");
const firestore = require("firebase-admin/firestore");

Object.defineProperties(Object.prototype, require("./prototypes/Object.js"));
Object.defineProperties(Array.prototype, require("./prototypes/Array.js"));
Object.defineProperties(String.prototype, require("./prototypes/String.js"));

Object.defineProperties(firestore.Firestore.prototype, require("./prototypes/Firestore.js"));
Object.defineProperties(firestore.CollectionReference.prototype, require("./prototypes/Firestore.CollectionReference.js"));
Object.defineProperties(firestore.DocumentReference.prototype, require("./prototypes/Firestore.DocumentReference.js"));

Object.defineProperties(Eris.Interaction.prototype, require("./prototypes/Eris.Interaction.js"));
Object.defineProperties(Eris.CommandInteraction.prototype, require("./prototypes/Eris.CommandInteraction.js"));
Object.defineProperties(Eris.Message.prototype, require("./prototypes/Eris.Message.js"));
Object.defineProperties(Eris.User.prototype, require("./prototypes/Eris.User.js"));
Object.defineProperties(Eris.Guild.prototype, require("./prototypes/Eris.Guild.js"));
Object.defineProperties(Eris.TextChannel.prototype, require("./prototypes/Eris.TextChannel.js"));