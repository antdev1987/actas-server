//this is the detabase to store the reference of the file the admin will upload in the project

import mongoose from 'mongoose'
const {Schema} = mongoose

const adminFilesSchema = new Schema({

    originalname:{
        type:String
    },
    
    public_id:{type:String},
    secure_url:{type:String}

})

const AdminFiles = mongoose.model('AdminFiles',adminFilesSchema)
export default AdminFiles