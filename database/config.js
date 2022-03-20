const mongoose = require('mongoose');

const dbConnection = async () => {


    try {

        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Base de Datos ONLINE!');
        
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la DB. Revisar los logs')
    }



}

module.exports = {
    dbConnection
}