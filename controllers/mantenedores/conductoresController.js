import Conductores from "../../models/Conductores.js"


const registrarConductor = async (req, res) => {
    const {rut, nombre, ape_paterno, ape_materno, fono, email, est_activo, id_empresa, id_empresa_global} = req.body

    try {  
        const existe = await Conductores.findOne({
            attributes: ['rut'],
            where:{
                rut
            }
        }) 

        if(existe){
            const error = new Error("Conductor ya existe")
            return res.status(400).json({msg : error.message})
        }
                         
        await Conductores.create({
            rut, nombre, ape_paterno, ape_materno, fono, email, est_activo, id_empresa, id_empresa_global
        })      
                
        res.status(200).json({msg: "Conductor Registrado!"})

    } catch (error) {
        console.log(error)            
    }      
}


const editarConductor =  async (req, res) =>{
    const {id} = req.params
    const {rut, nombre, ape_paterno, ape_materno, fono, email, est_activo, id_empresa, } = req.body

    try {
     
        await Conductores.update({
            rut, nombre, ape_paterno, ape_materno, fono, email, est_activo, id_empresa
        },{
            where:{
                id : id
            }
        })           
        res.status(200).json({msg: "Conductor Actualizado"})

    } catch (error) {
        console.log(error)            
    }      
}

const eliminarConductor = async (req, res) =>{
    const {id} = req.params

    try {    
    
        await Conductores.destroy({
            where:{
                id : id
            }
        })
        
        res.status(200).json({msg: "Conductor Eliminado"})

    } catch (error) {
        console.log(error)    
    }   
}


const obtenerConductores = async (req, res) => {
    const {id_empresa, id_empresa_global} = req.params
    try {
        const tra = await Conductores.findAll({
            attributes: ['id', 'rut', 'nombre','ape_paterno', 'ape_materno', 'fono', 'email', 'est_activo', 'id_empresa'],
            where:{
                id_empresa, id_empresa_global
            }
        })
        return res.status(200).json(tra)        
    } catch (error) {
        console.log(error)
    }
}

export{
    registrarConductor,
    editarConductor,
    eliminarConductor,
    obtenerConductores
}