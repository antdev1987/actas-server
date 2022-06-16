import mongoose from 'mongoose'
const {Schema} =mongoose


const entregaSchema = new Schema({
    nombre:{
        type:String,
        // unique:true,
        // required:[true,'nombre usuarios es obligatorio']
    },

    tipo:{
        type:String,
        default:'Entrega' 
    },

    files:[{type:Object}],
})

const Entrega = mongoose.model("Entrega",entregaSchema)
export default Entrega