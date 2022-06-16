import mongoose from 'mongoose'
const {Schema} =mongoose


const devolucionSchema = new Schema({
    nombre:{
        type:String,
        // unique:true,
        // required:[true,'nombre usuarios es obligatorio']
    },

    tipo:{
        type:String,
        default:'Devolucion' 
    },

    files:[{type:Object}],
})

const Devolucion = mongoose.model("Devolucion",devolucionSchema)
export default Devolucion