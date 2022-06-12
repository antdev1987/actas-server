import mongoose from 'mongoose'
const {Schema} =mongoose


const entregaSchema = new Schema({
    nombre:{
        type:String,
        // unique:true,
        // required:[true,'nombre usuarios es obligatorio']
    },

    files:[{type:Object}],
})

const Entrega = mongoose.model("Entrega",entregaSchema)
export default Entrega