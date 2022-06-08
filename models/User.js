import mongoose from 'mongoose'
const {Schema} = mongoose

const userSchema = new Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:'user'
    }

})

const User = mongoose.model("User",userSchema)
export default User