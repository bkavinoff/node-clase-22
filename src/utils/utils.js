//-----------------------------------------------------------------------------------------------
//normalizr:
const { schema, normalize, denormalize } = require("normalizr");

//MessageAuthor Schema:
const author = new schema.Entity("author");
//Message Schema:
const mensaje = new schema.Entity(
  "message",
  { author: author },
  { idAttribute: "_id" }
);
const schemaMensajes = new schema.Entity("mensajes", { mensajes: [mensaje], messageTimestamp: String });

const util = require('util')


function print(objeto){
    console.log(util.inspect(objeto, false, 12, true))
}


const normalizeMessages = (messagesArray) =>{
    const normalizedMessages = normalize(messagesArray, schemaMensajes)

    console.log('-------OBJETO NORMALIZADO:-------')
    print(normalizedMessages)
    console.log(JSON.stringify(normalizedMessages).length)

    console.log('-------OBJETO ORIGINAL:-------')
    console.log(messagesArray)
    console.log(JSON.stringify(messagesArray).length)
    return normalizedMessages
}

const denormalizeMessages = (messagesArray) =>{
    const denormalizedMessages = denormalize(messagesArray, schemaMensajes)

    console.log('-------OBJETO NORMALIZADO:-------')
    print(denormalizedMessages)
    console.log(JSON.stringify(denormalizedMessages).length)

    console.log('-------OBJETO ORIGINAL:-------')
    console.log(messagesArray)
    console.log(JSON.stringify(messagesArray).length)
    return denormalizedMessages
}

module.exports = { normalizeMessages, denormalizeMessages }