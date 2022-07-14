import jwt from 'jsonwebtoken'


// aqui creo el token para la autenticacion


const generarJWT=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'100d'})
}

export default generarJWT