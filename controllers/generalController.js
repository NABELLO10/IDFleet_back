import Ciudades from "../models/Ciudades.js"

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


export {
    obtenerCiudades,

}