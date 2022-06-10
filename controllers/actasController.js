import Actas from "../models/Actas.js"


//192.168.100.7:4000/api/actas/crear-folder
const crearFolder = async(req,res)=>{
    console.log('en crear folder')

    const isNewFolder = await Actas.findOne({nombre:req.body.nombre})

    if(isNewFolder){
        return res.json({msg:'nombre ya creado'})
    }

    try {
        const newFolder = new Actas(req.body)
        const data = await newFolder.save()

        res.json(data)

    } catch (error) {
        console.log(error)
    }

}

//192.168.100.7:4000/api/actas/buscar-folder
const buscarFolder = async(req,res)=>{

    try {

        const isFolder = await Actas.findOne({nombre:req.body.nombre})

        if(!isFolder){
            return res.json({msg:'folder no encontrado, crealo'})
        }

        res.json(isFolder)
        
    } catch (error) {
        console.log(error)
    }

}

//192.168.100.7:4000/api/actas/guardar-archivos
const guardarArchivos=  async(req,res)=>{

    console.log('ejecutandose')

    const {id} = req.params

    const isFolder = await Actas.findById(id)

    if(!isFolder){
        return res.json({msg:'folder no existe'})
    }

    const selector = req.body.selector

    const newArr = []

    for (const item of req.files) {
        const { filename, originalname } = item;
        newArr.push({ filename, originalname });
      }
  

    //almacenar los archivos a la instancia
    for (const item of newArr) {
        isFolder[selector].push(item)
    }

    try {
        const dataUp =await isFolder.save()
        res.json(dataUp)
    } catch (error) {
        console.log(error)
    }
    
}




export{
    guardarArchivos,
    crearFolder,
    buscarFolder
}