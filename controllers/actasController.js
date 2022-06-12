import Actas from "../models/Actas.js";
import Entrega from "../models/Entrega.js";
import Devolucion from "../models/Devolucion.js";

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

  const isNewFolder = await pickSelector.findOne({ nombre: req.body.nombre });

  if (isNewFolder) {
    return res.json({ msg: "nombre ya creado" });
  }

  try {
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
  console.log("ejecutandose");

  const { id } = req.params;

  console.log(id);
  console.log(typeof id);

  console.log(req.body);
  const selector = req.body.selector;
  let pickSelector;

  if (selector === "Entrega") {
    pickSelector = Entrega;
  } else if (selector === "Devolucion") {
    pickSelector = Devolucion;
  }

  console.log(req.files);

  try {
    const isFolder = await pickSelector.findById(id);

    if (!isFolder) {
      return res.json({ msg: "folder no existe" });
    }



    const newArr = [];

    for (const item of req.files) {
      const { filename, originalname } = item;
      newArr.push({ filename, originalname });
    }

    //almacenar los archivos a la instancia
    for (const item of newArr) {
      isFolder.files.push(item);
    }

    // try {
    const dataUp = await isFolder.save();
    res.json(dataUp);
  } catch (error) {
    console.log(error);
  }
};

export { guardarArchivos, crearFolder, buscarFolder };
