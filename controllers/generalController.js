import Ciudades from "../models/Ciudades.js"
import Token from "../models/Token.js"

const obtenerCiudades = async (req, res) =>{
    try {
        const ciudades = await Ciudades.findAll({       
            attributes: ['id', 'nom_comuna', 'id_provincia'],
            order: [
                [['nom_comuna', 'ASC']],
              ]            
        })
        return res.status(200).json(ciudades)        
    } catch (error) {
        console.log(error)
    }
}

    const obtenerTokenWialon = async (req, res) => {
        try {           
            const token = await Token.findOne({
                attributes: ['token'],
                where:{
                    id : 1
                }
            }) 
            return res.status(200).json(token);  
                  
         } catch (error) {
           console.log(error);
           return res.status(500).json({ message: "Error interno del servidor." });
         }   
    }

const actualizarWialon =  async (req, res) =>{
    
    const {usuario, token} = req.body

     try {                          
        await Token.update({
            usuario, token
        },{
            where:{id : 1}
        })     
        res.status(200).json({msg: "Actualizado"})   

     } catch (error) {
        console.log(error)            
    }       
}


export {
    obtenerCiudades,
    actualizarWialon,
    obtenerTokenWialon

}