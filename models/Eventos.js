import mongoose from 'mongoose'
const {Schema} =mongoose


const eventosSchema = new Schema({
    title:{
        type:String,
        // unique:true,
        // required:[true,'nombre usuarios es obligatorio']
    },

    start:{
        type:Date,
        default:'Entrega' 
    },

    end:{
        type:Date
    },

    user:{
        type:String
    }
})

const Eventos = mongoose.model("Eventos",eventosSchema)
export default Eventos