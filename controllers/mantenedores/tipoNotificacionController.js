import TipoNotificacion from "../../models/TipoNotificacion.js"


const registrarTipoNotificacion = async (req, res) => {
    const {nom_tipo, est_activo, id_empresa} = req.body

    try {  
        const existe = await TipoNotificacion.findOne({
            where:{
                nom_tipo,
                id_empresa
            }
        }) 

        if(existe){
            const error = new Error("Tipo ya existe")
            return res.status(400).json({msg : error.message})
        }
                         
        await TipoNotificacion.create({
            nom_tipo,
            est_activo,
            id_empresa
        })      
      
        res.status(200).json({msg: "Tipo Registrado"})

    } catch (error) {
        console.log(error)            
    }      
}


const editarTipoNotificacion =  async (req, res) =>{
    const {id} = req.params
    const {nom_tipo, est_activo} = req.body

    try {
        const existe = await TipoNotificacion.findByPk(id) 

        if(!existe){
            const error = new Error("Tipo no existe")
            return res.status(400).json({msg : error.message})
        }      
                    
        await TipoNotificacion.update({
            nom_tipo, est_activo
        },{
            where:{
                id : id
            }
        })     
        res.status(200).json({msg: "Tipo Actualizado"})   

    } catch (error) {
        console.log(error)            
    }      
}


const eliminarTipoNotificacion = async (req, res) =>{
    const {id} = req.params

    try {        
        await TipoNotificacion.destroy({
            where:{
                id : id
            }
        })        
         res.status(200).json({msg: "Tipo Eliminado"})

    } catch (error) {
        console.log(error)    
    }   
}


const obtenerTipoNotificacion = async (req, res) => {
    try {
        const {id_empresa} = req.params
        const tipos = await TipoNotificacion.findAll({
            where:{id_empresa}
        })
        return res.status(200).json(tipos)        
    } catch (error) {
        console.log(error)
    }
}

const obtenerTipoNotificacionActivo = async (req, res) => {
    try {
        const {id_empresa} = req.params
        const tipos = await TipoNotificacion.findAll({
            where:{id_empresa, est_activo : 1}
        })
        return res.status(200).json(tipos)        
    } catch (error) {
        console.log(error)
    }
}




export{
    registrarTipoNotificacion,
    editarTipoNotificacion,
    eliminarTipoNotificacion,
    obtenerTipoNotificacion,
    obtenerTipoNotificacionActivo
}