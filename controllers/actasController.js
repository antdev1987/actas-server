import Actas from "../models/Actas.js";
import Entrega from "../models/Entrega.js";
import Devolucion from "../models/Devolucion.js";
import cloudinary from "../utils/cloudinary.js";

//192.168.100.7:4000/api/actas/crear-folder
const crearFolder = async (req, res) => {
  console.log("en crear folder");

  const { selector } = req.body;

  let pickSelector;

  if (selector === "Entrega") {
    pickSelector = Entrega;
  } else if (selector === "Devolucion") {
    pickSelector = Devolucion;
  }

  try {
  const isNewFolder = await pickSelector.findOne({ nombre: req.body.nombre });

  if (isNewFolder) {
    return res.json({ msg: "nombre ya creado" });
  }

    const newFolder = new pickSelector(req.body);
    const data = await newFolder.save();

    res.json(data);
  } catch (error) {
    console.log(error);
  }
};

//192.168.100.7:4000/api/actas/buscar-folder
const buscarFolder = async (req, res) => {
  console.log("en buscar folder");

  console.log(req.body);

  try {
    const { selector } = req.body;

    let pickSelector;

    if (selector === "Entrega") {
      pickSelector = Entrega;
    } else if (selector === "Devolucion") {
      pickSelector = Devolucion;
    }

    const isFolder = await pickSelector.findOne({ nombre: req.body.nombre });

    if (!isFolder) {
      return res.json({ msg: "folder no encontrado, crealo" });
    }

    res.json(isFolder);
  } catch (error) {
    console.log(error);
  }
};

//192.168.100.7:4000/api/actas/guardar-archivos/someid
const guardarArchivos = async (req, res) => {
  console.log("en guardar archivos");

  

  const { id } = req.params;
  let pickSelector;

  //bloque de codigo siguiente es para especificar en que base de datos se va a trabajar
  const {selector} = req.body;
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

    //next block code: guarda los archivos al servidor, crear los valores necesarios para agregarlos a la bd
    const urls = [];
    for (const file of req.files) {
      const { path } = file;
      const result = await cloudinary.uploader.upload(path, {
        resource_type: "raw",
        filename_override: file.originalname,
        use_filename:true,
        unique_filename:false,
        folder:`actas/${isFolder.nombre}`
      });
      console.log(result)
      const newPath = {
        public_id: result.public_id,
        secure_url: result.secure_url,
        originalname: file.originalname,
      };
      urls.push(newPath);
    }


    //almacenar los archivos a la instancia
    for (const item of urls) {
      isFolder.files.push(item);
    }

    const dataSaved = await isFolder.save();
    res.json(dataSaved);
  } catch (error) {
    console.log('error en el try catch',error);
  }
};




//192.168.100.7:4000/api/actas/eliminar-un-archivo
const eliminarUnArchivo = async(req,res)=>{

  console.log('en eliminar archivo')
  const {id,selector,public_id} = req.query


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
    await cloudinary.uploader.destroy(public_id,{resource_type:'raw',folder:isFolder.nombre})

    //to delete the references to the id file in cloudinary from mongodb,
    //the reference it is inside an array of object
    const data = await pickSelector.findByIdAndUpdate({_id:id},{"$pull":{"files":{"public_id":public_id}}},{new:true})

    res.json(data)
    
  } catch (error) {
    console.log(error)
  }

}



//eliminar folder
const eliminarFolder = async(req,res)=>{

  console.log('en eliminar folder')
  const {id,selector} = req.query


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

  
  const {files} =  isFolder
  console.log(files)
  const ids = []


  
  try {

    //to delete the file from cloudinary

    for (const item of isFolder.files) {
      await cloudinary.uploader.destroy(item.public_id,{resource_type:'raw'})
    }

    //this delete the folder from cloudinary
    await cloudinary.api.delete_folder(`actas/${isFolder.nombre}`)


    //to delete the references to the id file in cloudinary from mongodb,
    //the reference it is inside an array of object
    // await pickSelector.updateOne({_id:id},{"$pull":{"files":{"public_id":public_id}}})

    await isFolder.remove()
    res.json({msg:'folder deleted'})
    
  } catch (error) {
    console.log(error)
  }

}

//192.168.100.7:4000/api/actas/obtener-bds
const obtenerBds = async(req,res)=>{

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


const buscarNombre = async(req,res)=>{

  console.log('en eliminar folder')
  const {nombre,selector} = req.query


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
    const isFolder = await pickSelector.find({nombre:{$regex:nombre}});
    if (!isFolder) {
      return res.json({ msg: "folder no existe" });
    }

    res.json(isFolder)
    
  } catch (error) {
    console.log(error)
  }



}


export { guardarArchivos, crearFolder, buscarFolder, eliminarUnArchivo,obtenerBds,eliminarFolder,buscarNombre };
