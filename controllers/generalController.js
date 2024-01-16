import Ciudades from "../models/Ciudades.js"
import Token from "../models/Token.js"
import Sensores from "../models/Sensores.js"
import ResumenGPS from "../models/ResumenGPS.js"
import OxSchool from "../models/OxSchool.js"
import LogSensores from "../models/LogSensores.js"


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
          where: {
            id: 1,
          },
        });
        return res.status(200).json(token);
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error interno del servidor." });
      }
    };


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


const obtenerDatosOx = async (req, res) => {
    try {
      const {patente} = req.params

      const registros = await Sensores.findAll({
        where :{ patente },
        limit: 100,
        order: [['id', 'DESC']] 
      });
      return res.status(200).json(registros);

    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Error interno del servidor." });
    }
};


const obtenerAlertas = async (req, res) => {
    try {
      const {patente} = req.params

      const registros = await LogSensores.findAll({
        where :{ patente },
        limit: 50,
        order: [['id', 'DESC']] 
      });
      return res.status(200).json(registros);

    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Error interno del servidor." });
    }
};


const obtenerResumenGPS = async (req, res) => {
  try {
    const registros = await ResumenGPS.findAll({   
      order: [['fechaGPS', 'DESC']] 
    });
    return res.status(200).json(registros);

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};



const obtenerDatosSchool = async (req, res) => {
  try {
    const registros = await OxSchool.findAll({
      limit: 200,
      order: [['id', 'DESC']] 
    });
    return res.status(200).json(registros);

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

export {
    obtenerCiudades,
    actualizarWialon,
    obtenerTokenWialon,
    obtenerDatosOx,
    obtenerResumenGPS,
    obtenerDatosSchool,
    obtenerAlertas

}