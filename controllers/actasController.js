import Actas from "../models/Actas.js"


//192.168.100.7:4000/api/actas/guardar-archivos
const guardarArchivos=  async(req,res)=>{

    console.log('ejecutandose')

    console.log(req.body,'the body')
    console.log(req.files)

    res.json(req.files)

    // try {

    //     const acta = await new Actas({entrega:req.files})

    //     const data =await acta.save()

    //     res.json(data)
        
    // } catch (error) {
    //     console.log(error)
    // }
    
}



export{
    guardarArchivos
}