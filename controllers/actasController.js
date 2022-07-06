import Actas from "../models/Actas.js";
import Entrega from "../models/Entrega.js";
import Devolucion from "../models/Devolucion.js";
import cloudinary from "../utils/cloudinary.js";
import obtenerFecha from "../helpers/obtenerFecha.js";
import Eventos from "../models/Eventos.js";

//////////////////192.168.100.7:4000/api/actas/crear-folder
const crearFolder = async (req, res) => {
  console.log("en crear folder");
  /* 
    codigo de abajo es para determinar el tipo de folder ya sea entrea o devolucion 
    asi se podra guardar en la base de datos adecuada
  */
  const { selector } = req.body;
  let pickSelector;
  if (selector === "Entrega") {
    pickSelector = Entrega;
  } else if (selector === "Devolucion") {
    pickSelector = Devolucion;
  }

  try {

    /*
    siguiente linea de codigo es para confirmar si ya se a creado un folder con nombre similar
    si ya se ha creado no se deja seguir y se envia un mensaje diciendo nombre ya creado
    */
    const isNewFolder = await pickSelector.findOne({ nombre: req.body.nombre });
    if (isNewFolder) {
      return res.json({ msg: "nombre ya creado" });
    }

    // aqui se crea una instancia de la base de datos
    const newFolder = new pickSelector(req.body);

    /*
    siguientes lineas es para crear fecha y hora y controlar el movimiento que hace el usuario
    luego se guarda en la base de datos del usuario que esta haciendo los request
    */
    const fullYear = obtenerFecha()
    const movimiento = { type: 'crear folder', accion: `usuario ${req.user.email} ha creado el folder ${newFolder.nombre} tipo ${selector}`, fecha: fullYear }
    req.user.movimientos.unshift(movimiento)
    await req.user.save()

    //finalmente se guarda el folder y se envia una respuesta al frontend
    const data = await newFolder.save();
    res.json(data);
  } catch (error) {
    console.log(error);
  }
};

///////////////////////192.168.100.7:4000/api/actas/buscar-folder
const buscarFolder = async (req, res) => {
  console.log("en buscar folder");

  try {
    /* 
      codigo de abajo es para determinar el tipo de folder ya sea entrea o devolucion 
      asi se podra guardar en la base de datos adecuada
    */
    const { selector } = req.body;
    let pickSelector;
    if (selector === "Entrega") {
      pickSelector = Entrega;
    } else if (selector === "Devolucion") {
      pickSelector = Devolucion;
    }

    /*
    siguiente linea de codigo es para buscar el folder especificado en el frontend
    de no encontrarse se envia una respuesta folder no encontrado crearlo
    */
    const isFolder = await pickSelector.findOne({ nombre: req.body.nombre });
    if (!isFolder) {
      return res.json({ msg: "folder no encontrado, crealo" });
    }

    //si el folder se encontro se manda la informacion al frontend
    res.json(isFolder);
  } catch (error) {
    console.log(error);
  }
};

/////////////////192.168.100.7:4000/api/actas/guardar-archivos/someid
const guardarArchivos = async (req, res) => {
  console.log("en guardar archivos");

  const { id } = req.params;
  let pickSelector;

  //bloque de codigo siguiente es para especificar en que base de datos se va a trabajar
  const { selector } = req.body;
  if (selector === "Entrega") {
    pickSelector = Entrega;
  } else if (selector === "Devolucion") {
    pickSelector = Devolucion;
  }

  //next block code: solo es extra seguridad si el folder no existe no sigue adelante
  //igualmente en el frontend no se podra seguir adelante si no existe el folder
  const isFolder = await pickSelector.findById(id);
  if (!isFolder) {
    return res.json({ msg: "folder no existe" });
  }

  try {
    const fullYear = obtenerFecha()
    //next block code: guarda los archivos al servidor, crear los valores necesarios para agregarlos a la bd
    const urls = [];
    for (const file of req.files) {
      const { path } = file;
      const result = await cloudinary.uploader.upload(path, {
        resource_type: "raw",
        filename_override: file.originalname,
        use_filename: true,
        unique_filename: false,
        folder: `actas/${selector}/${isFolder.nombre}`
      });
      console.log(result)
      const newPath = {
        public_id: result.public_id,
        secure_url: result.secure_url,
        originalname: file.originalname,
      };
      const movimiento = { type: 'guardar Archivo/s', accion: `usuario ${req.user.email} ha guardado el archivo ${file.originalname} tipo ${selector} en folder ${isFolder.nombre}`, fecha: fullYear }
      req.user.movimientos.unshift(movimiento)
      urls.push(newPath);
    }

    await req.user.save()

    //almacenar los archivos a la instancia
    for (const item of urls) {
      isFolder.files.push(item);
    }

    const dataSaved = await isFolder.save();
    res.json(dataSaved);
  } catch (error) {
    console.log('error en el try catch', error);
  }
};



///////////////////192.168.100.7:4000/api/actas/descargar-un-archivo
const descargarArchivo = async (req, res) => {
  //esta funcion no tiene mucha funcionalidad solo es para registar cuando el usuario descarga un archivo
  console.log('en descargar archivo')
  const { originalName, tipo, nombre } = req.query

  console.log(originalName, tipo, nombre)

  try {

    const fullYear = obtenerFecha()
    const movimiento = { type: 'descargar archivo', accion: `usuario ${req.user.email} ha descargado el archivo ${originalName} tipo ${tipo} en folder ${nombre}`, fecha: fullYear }
    req.user.movimientos.unshift(movimiento)
    await req.user.save()

    res.json('testing')

  } catch (error) {
    console.log(error)
  }

}


///////////////////192.168.100.7:4000/api/actas/eliminar-un-archivo
const eliminarUnArchivo = async (req, res) => {

  console.log('en eliminar archivo')
  const { id, selector, public_id } = req.query


  //bloque de codigo siguiente es para especificar en que base de datos se va a trabajar
  let pickSelector;
  if (selector === "Entrega") {
    pickSelector = Entrega;
  } else if (selector === "Devolucion") {
    pickSelector = Devolucion;
  }

  //next block code: solo es extra seguridad si el folder no existe no sigue adelante
  //igualmente en el frontend no se podra seguir adelante si no existe el folder
  try {
    const isFolder = await pickSelector.findById(id);
    if (!isFolder) {
      return res.json({ msg: "archivo no existe" });
    }


    //to delete the file from cloudinary
    await cloudinary.uploader.destroy(public_id, { resource_type: 'raw', folder: isFolder.nombre })


    const fileName = public_id.split('/')[3]

    console.log(fileName, 'aque pasa')

    const fullYear = obtenerFecha()
    const movimiento = { type: 'eliminar archivo', accion: `usuario ${req.user.email} ha eliminado el archivo ${fileName} tipo ${selector} en folder ${isFolder.nombre}`, fecha: fullYear }
    req.user.movimientos.unshift(movimiento)
    await req.user.save()

    //to delete the references to the id file in cloudinary from mongodb,
    //the reference it is inside an array of object
    const data = await pickSelector.findByIdAndUpdate({ _id: id }, { "$pull": { "files": { "public_id": public_id } } }, { new: true })

    res.json(data)

  } catch (error) {
    console.log(error)
  }

}



///////////////192.168.100.7:4000/api/actas/eliminar-folder
const eliminarFolder = async (req, res) => {

  console.log('en eliminar folder')
  const { id, selector } = req.query


  //bloque de codigo siguiente es para especificar en que base de datos se va a trabajar
  let pickSelector;
  if (selector === "Entrega") {
    pickSelector = Entrega;
  } else if (selector === "Devolucion") {
    pickSelector = Devolucion;
  }

  //next block code: solo es extra seguridad si el folder no existe no sigue adelante
  //igualmente en el frontend no se podra seguir adelante si no existe el folder
  const isFolder = await pickSelector.findById(id);
  if (!isFolder) {
    return res.json({ msg: "folder no existe" });
  }

  try {

    //to delete the file from cloudinary
    for (const item of isFolder.files) {
      await cloudinary.uploader.destroy(item.public_id, { resource_type: 'raw' })
    }

    //this delete the folder from cloudinary
    await cloudinary.api.delete_folder(`actas/${selector}/${isFolder.nombre}`)

    //esto es para controlar la fecha y hora de la eliminacion y registra el usuario que realizo la accion
    const fullYear = obtenerFecha()
    const movimiento = { type: 'eliminar folder', accion: `usuario ${req.user.email} ha eliminado el folder ${isFolder.nombre} tipo ${selector}`, fecha: fullYear }
    req.user.movimientos.unshift(movimiento)
    await req.user.save()


    //aqui se eliminar el nombre del folder de la base de datos
    await isFolder.remove()
    res.json({ msg: 'folder deleted' })

  } catch (error) {
    console.log(error)
  }

}

//////////////////////192.168.100.7:4000/api/actas/obtener-bds
const obtenerBds = async (req, res) => {
  //este api solo es para la funcionalidad de buscar en la pagina control del frontend
  //entonces toda la funcionalidad de buscar se maneja en el frontend
  console.log('en obtener bds')
  try {
    const entrega = await Entrega.find()
    const devolucion = await Devolucion.find()

    res.json({
      entrega,
      devolucion
    })

  } catch (error) {
    console.log(error)
  }

}


//funciones de los eventos
//agregar un nuevo evento
const agregarEvento = async (req, res) => {

  try {

    const evento = new Eventos(req.body)

    const dataSaved = await evento.save()

    res.json(dataSaved)

  } catch (error) {
    console.log(error)
  }

}

//obtener los eventos

const obtenerEventos = async (req, res) => {

  try {

    const eventos = await Eventos.find()

    res.json(eventos)
    
  } catch (error) {
    console.log(error)
  }

}

const eliminarEvento = async(req,res)=>{

  const {id} = req.params

  try {

    await Eventos.findOneAndRemove({ _id: id })

    res.json({msg:'evento eliminado'})

    
  } catch (error) {
    console.log(error)
  }

}


// const buscarNombre = async (req, res) => {

//   console.log('en buscar folder tipo 2')
//   const { nombre, selector } = req.query


//   //bloque de codigo siguiente es para especificar en que base de datos se va a trabajar
//   let pickSelector;
//   if (selector === "Entrega") {
//     pickSelector = Entrega;
//   } else if (selector === "Devolucion") {
//     pickSelector = Devolucion;
//   }

//   //next block code: solo es extra seguridad si el folder no existe no sigue adelante
//   //igualmente en el frontend no se podra seguir adelante si no existe el folder

//   try {
//     const isFolder = await pickSelector.find({ nombre: { $regex: nombre } });
//     if (!isFolder) {
//       return res.json({ msg: "folder no existe" });
//     }

//     res.json(isFolder)

//   } catch (error) {
//     console.log(error)
//   }
// }


export {
  guardarArchivos,
  crearFolder,
  buscarFolder,
  descargarArchivo,
  eliminarUnArchivo,
  obtenerBds,
  eliminarFolder,
  agregarEvento,
  obtenerEventos,
  eliminarEvento
};
