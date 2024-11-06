import { fileURLToPath } from 'url'
import { dirname  } from 'path'
import multer from 'multer'
/**
* fileURLToPath: Esta función garantiza la decodificación correcta de los caracteres codificados en porcentaje, 
así como una cadena de ruta absoluta válida multiplataforma.
* dirname: Devuelve el nombre de directorio de una ruta. Similar al comando dirname de Unix.
*/

//Configuracion de la ruta absoluta
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname

const storage = multer.diskStorage({
    // Ubicacion del directorio donde se va a guardar el archivo
    destination: function(req, file, cb){
        //El segundo parametro es para especificar donde se va a alojar la informacion que subamos
        cb(null, `${__dirname}/public/img`)
    },

    // el nombre con que quiero que tengan los archvios que se suben
    filename: function(req, file, cb){
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

export const uploader = multer({ 
    storage,
    //Se controla si se encuentra algun error 
    onError: function(err, next) {
        console.log(err);
        next();
    }
})
