const mongoose = require("mongoose");
const config = require('../db/config.js');

//DB
 const ConnectToMessagesDB = async ()=>{
    await mongoose.connect(config.mongodb.connectionString)
    console.log('Conexion con la DB establecida.')
 }
 ConnectToMessagesDB()

class ContenedorMensajes {
    constructor (nombreColeccion, esquema) {
        this.coleccion = mongoose.model(nombreColeccion, esquema);
    }

    async add(obj) {
        try {
            //lo guardo
            const newObject = new this.coleccion(obj);
            let resultado = await newObject.save();
      
            //retorno el id
            return resultado.id;
      
          } catch(err) {
            console.log('Error en método save: ', err);
            return
          }
        
    }

    async getById(id){
        try {
            //el documento segun id de la colección
            const objeto = await this.coleccion.findById(id, { __v: 0 });
      
            //lo devuelvo
            return objeto;
           
          } catch (err) {
            console.log('Error en método getById: ', err);
            return {}
          }
    }

    async getAll(){
        try {

            //busco los documentos de la colección
            const docs = await this.coleccion.find({}, { __v: 0 }); //en el find({campos incluidos}, {campos excluidos})
        
            //normalizo la respuesta:


            //los devuelvo
            return docs;
        
        } catch (error) {
            console.log('Error en método getAll: ', error);
            return [];
        }
        
    }

    async deleteById(id){
        try {
            //lo busco y elimino
            await this.coleccion.findByIdAndDelete(id, function (err, doc) {
              if (err) {
                throw 'findByIdAndDeleteError';
            }}).clone();
          } catch (err) {
              console.log('Error en método deleteById: ', err);
          }
    }
}

function transformRowDataPacketInObj(rdp){
    var string=JSON.stringify(rdp);
    var json =  JSON.parse(string);
    return json
}




module.exports = ContenedorMensajes // 👈 Export class