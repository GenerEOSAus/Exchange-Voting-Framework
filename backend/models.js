const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost/EXVS', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((conn) => {
    console.log('Database Connected');
});

const userSchema = new mongoose.Schema({
    user_id: {type: String, unique: true},
    eos_balance: Number,
    proxy: String,
    producers: [String],
    last_vote: Date
}, {
    timestamps: true
});

module.exports = {
    User: mongoose.model("user", userSchema)
};
