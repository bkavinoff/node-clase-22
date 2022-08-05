const socket = io()
//------------------------------------------------------------------------------------
//NORMALIZR
//MessageAuthor Schema:
const author = new normalizr.schema.Entity(
    "author",
    {},
    { idAttribute: "userEmail" }
    );
//Message Schema:
const mensaje = new normalizr.schema.Entity(
    "message",
    { author: author },
    { idAttribute: "id" }
);
const schemaMensajes = new normalizr.schema.Entity(
    "mensajes", 
    { mensajes: [mensaje], messageTimestamp: String },
    { idAttribute: "id" }
    );

const normalizeMessages = (messagesArray) =>{
    const normalizedMessages = new normalizr.normalize(
        messagesArray, 
        schemaMensajes,
        messagesArray.entities)

    console.log('-------OBJETO NORMALIZADO:-------')
    console.log(JSON.stringify(normalizedMessages))
    console.log(JSON.stringify(normalizedMessages).length)

    console.log('-------OBJETO ORIGINAL:-------')
    console.log(JSON.stringify(messagesArray))
    console.log(JSON.stringify(messagesArray).length)
    return normalizedMessages
}

const denormalizeMessages = (messagesArray) =>{
    const denormalizedMessages = new normalizr.denormalize(messagesArray, schemaMensajes)

    console.log('-------OBJETO DENORMALIZADO:-------')
    console.log(JSON.stringify(denormalizedMessages))
    console.log(JSON.stringify(denormalizedMessages).length)

    console.log('-------OBJETO ORIGINAL:-------')
    console.log(JSON.stringify(messagesArray))
    console.log(JSON.stringify(messagesArray).length)
    return denormalizedMessages
}

//------------------------------------------------------------------------------------


//productos:
const addProductFormContainer = document.querySelector('#addProductFormContainer')
const addProductForm = document.querySelector('#addProductForm')

const txtNombreProd = document.querySelector('#txtNombreProd')
const txtThumbnailProd = document.querySelector('#txtThumbnailProd')
const txtPriceProd = document.querySelector('#txtPriceProd')
const txtDescripcionProd = document.querySelector('#txtDescripcionProd')
const txtCodigoProd = document.querySelector('#txtCodigoProd')
const txtStockProd = document.querySelector('#txtStockProd')

const productsPool = document.querySelector('#productsPool')

//productos-Test:
const productsPoolTest = document.querySelector('#productsPoolTest')

//chat:
const spanCompresionMensajes = document.querySelector('#spanCompresionMensajes')
const addMessageForm = document.querySelector('#addMessageForm')

const txtUserEmail = document.querySelector('#txtUserEmail')
const txtUserName = document.querySelector('#txtUserName')
const txtUserLastName = document.querySelector('#txtUserLastName')
const txtUserAge = document.querySelector('#txtUserAge')
const txtUserAlias = document.querySelector('#txtUserAlias')
const txtUserAvatar = document.querySelector('#txtUserAvatar')
const txtUserMessage = document.querySelector('#txtUserMessage')
const chatPool = document.querySelector('#chatPool')

//EVENT LISTENERS
addProductForm.addEventListener('submit', event => {
    event.preventDefault()
    const productInfo = {
        nombre:txtNombreProd.value, 
        thumbnail:txtThumbnailProd.value, 
        precio:txtPriceProd.value, 
        descripcion:txtDescripcionProd.value,
        codigo:txtCodigoProd.value,
        stock:txtStockProd.value,
        timestamp:getTimesTamp()
    }
    console.log('click en enviar producto')
    SendNewProduct(productInfo)
})

addMessageForm.addEventListener('submit', event => {
    event.preventDefault()

    //obtengo la fecha y hora
    const messageDateTime = getTimesTamp()

    const messageInfo = {
        author:{
            userEmail:txtUserEmail.value,
            userName:txtUserName.value,
            userLastName:txtUserLastName.value,
            userAge:txtUserAge.value,
            userAlias:txtUserAlias.value,
            userAvatar:txtUserAvatar.value
        },
        message:{
            message:txtUserMessage.value,
            messageTimestamp:messageDateTime
        }
    }

    console.log('click en enviar producto')
    SendNewMessage(messageInfo)
})

//FUNCTIONS 

function getTimesTamp(){
    let [date, time] = new Date().toLocaleString('en-GB').split(', ');
    const messageDateTime = date + ' - ' + time;
    return messageDateTime
}

function RenderProduct(products){
    fetch('./ListadoPoductos.hbs').then(response =>{
        response.text().then(plantilla =>{
            //vacío el contenedor de productos
            productsPool.innerHTML = "" 

            //cargo los productos recibidos
            products.forEach(prod =>{
                const template = Handlebars.compile(plantilla)
                const html = template(prod)
                productsPool.innerHTML += html
            }) 
        })
    })
}

function RenderProductTest(products){
    fetch('./ListadoPoductos.hbs').then(response =>{
        response.text().then(plantilla =>{
            //vacío el contenedor de productos
            productsPoolTest.innerHTML = "" 

            //cargo los productos recibidos
            products.forEach(prod =>{
                const template = Handlebars.compile(plantilla)
                const html = template(prod)
                productsPoolTest.innerHTML += html
            }) 
        })
    })
}

function RenderAddProductForm(){
    fetch('./addProductForm.hbs').then(response =>{
        response.text().then(plantilla =>{
            const template = Handlebars.compile(plantilla)
            const html = template(plantilla)
            addProductFormContainer.innerHTML = html
        })
    })
}

function RenderMessages(messagesInfo){
    console.log('Objeto recibido:')
    console.log(messagesInfo)


    //normalizr:
    const denormalizedMessages = denormalizeMessages(messagesInfo)

    const msj = Object.entries(denormalizedMessages.entities.mensajes.undefined)

    if (msj != 'No hay mensajes'){
        const html = msj.map((msg) => {
            let m = msg[1]
            return (`<div>
            <img src=${m.author.userAvatar} style="width:25px;">
            <strong style="color:blue">${m.author.userEmail} </strong>
            <span style="color:brown">[${m.message.messageTimestamp}]: </span>
            <em style="color:green">${m.message.message}</em>
            </div>`)
        }).join(' ')
        chatPool.innerHTML=html
    }

    const comprimido = JSON.stringify(messagesInfo).length
    const normal = JSON.stringify(denormalizedMessages).length
    console.log('comprimido: ', comprimido)
    console.log('normal: ', normal)
    let porcentaje = ((comprimido * 100) / normal)
    spanCompresionMensajes.innerHTML = ` Compresión Mensajes: ${(100 - porcentaje).toFixed(2)}%`
}

//MESSAGES TO THE SERVER
function SendNewProduct(productInfo){
    console.log('Cliente: Enviando producto al server: ', productInfo)
    socket.emit('client:addProduct', productInfo)
}
function SendNewMessage(messageInfo){
    console.log('Cliente: Enviando mensaje al server: ', messageInfo)
    socket.emit('client:addMessage', messageInfo)
}


//MESSAGES FROM THE SERVER
socket.on('server:ListProducts', productos =>{
    RenderProduct(productos)
})

socket.on('server:renderMessages', messagesInfo =>{
    RenderMessages(messagesInfo)
})