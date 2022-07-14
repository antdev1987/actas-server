import mongoose from 'mongoose'
const {Schema} =mongoose


const planMantenimientoSchema = new Schema({
    nombre:{
        type:String,
        // unique:true,
        // required:[true,'nombre usuarios es obligatorio']
    },

    tipo:{
        type:String,
        default:'PlanMantenimiento' 
    },

    files:[{type:Object}],
})

const PlanMantenimiento = mongoose.model("PlanMantenimiento",planMantenimientoSchema)
export default PlanMantenimiento