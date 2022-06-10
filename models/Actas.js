import mongoose from 'mongoose'
const {Schema} =mongoose

// const Entrega = new Schema({
//     title:String
// })

const actaSchema = new Schema({
    nombre:{
        type:String,
        // unique:true,
        // required:[true,'nombre usuarios es obligatorio']
    },

    entrega:[{type:Object}],

    devolucion:[{type:Object}]
})

const Actas = mongoose.model("Actas",actaSchema)
export default Actas