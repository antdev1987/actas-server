
const isAdmin = async(req,res,next)=>{
    if(req.user.role === 'admin'){
        return next()
    }
    
    res.status(401).json({msg:'Not an admin,sorry'})
}

export default isAdmin