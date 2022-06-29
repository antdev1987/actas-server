import mongoose from 'mongoose'
const {Schema} = mongoose

const userSchema = new Schema({
    name:{
        type:String,
        // required:[true,'nombre es obligatorio']
    },
    email:{
        type:String,
        unique:true,
        required:[true,'email es obligatorio']
    },
    password:{
        type:String,
        required:[true,'password obligatorio']
    },
    role:{
        type:String,
        default:'user'
    },
    lastLogin:{
        type:String
    },
    movimientos:[{type:Object}]

})

const User = mongoose.model("User",userSchema)
export default User