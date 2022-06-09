import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const checkAuth = async(req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {

            token = req.headers.authorization.split(' ')[1]

            const decoded = jwt.verify(token,process.env.JWT_SECRET)

            req.user = await User.findById(decoded.id).select("-password")
            return next()    
        } catch (error) {
            return res.status(404).json({msg:'hubo un error'})
        }
    }

    if(!token){
        return res.status(401).json({msg:'Token no valido'})
    }
    next()
}

export default checkAuth