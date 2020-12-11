const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGOURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
        console.log('MongoDB connected '+conn.connection.host)
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

module.exports = connectDB;