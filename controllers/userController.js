import generarJWT from "../helpers/generarJWT.js";
import User from "../models/User.js";

//192.168.100.7:4000/api/user/login
const login = async (req, res) => {
  //obtengo los datos de la pagina login de react
  const { email, password } = req.body;

  console.log("en login");
  try {
    //verifico si el email introducido en react existe
    const usuario = await User.findOne({ email });

    //si no existe el error con esta condicional mando el mensaje no existe
    if (!usuario) {
      return res.status(404).json({ msg: "El Usuario no Existe" });
    }

    //si el password no es el mismo con esta condicional mando el mensaje password incorrecto
    if (usuario.password !== password) {
      return res.status(403).json({ msg: "El password es incorrecto" });
    }

    //si todo sale bien envio los datos de abajo a react para la autenticacion
    res.json({
      nombre: usuario.name,
      role: usuario.role,
      token: generarJWT(usuario._id),
    });
  } catch (error) {
    console.log(error);
  }
};

//192.168.100.7:4000/api/user/crear-usuario
const crearUsuario = async (req, res) => {
  console.log("en crear usuario");

  const isUser = await User.findOne({ email: req.body.email });

  if (isUser) {
    return res.status(409).json({ msg: "Usuario ya Existe" });
  }

  try {
    const newUser = new User(req.body);
    const data = await newUser.save();
    res.status(201).json(data);
  } catch (error) {
    if (error.name === "ValidationError") {
      let errors = {};

      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });

      return res.status(400).send(errors);
    }
    res.status(500).send("Something went wrong");
  }
};

//192.168.100.7:4000/api/user/ver-usuario
const verUsuario = async (req, res) => {
  console.log("en ver usuario");

  try {
      const users = await User.find()
      res.json(users)
  } catch (error) {
      console.log(error)
  }
};

//192.168.100.7:4000/api/user/eliminar-usuario/id
const eliminarUsuario = async(req,res)=>{
    console.log('en eliminar usuario')
    const {id}= req.params

    try {
        await User.deleteOne({_id:id})
        res.json({msg:'Usuario eliminado'})
    } catch (error) {
        console.log(error)
    }
}

export { login, crearUsuario, verUsuario, eliminarUsuario };
