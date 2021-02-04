const mongoose = require("mongoose");
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userController = {};

/**
 * Método responsável por realizar o Login
 */
userController.login = async (req, res) => {

    if (req.auth) {
        return res.status(400).json({ 'Error': 'You are already authenticated.' });
    }

    /*Verificamos se a conta com esse username existe*/
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
        return res.status(400).json({ 'Error': 'Invalid username.' });
    }

    /*Comparamos passwords e validamos*/
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).json({ 'Error': 'Invalid password.' });
    }


    /*Criar e devolver o Token*/
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.TOKEN_SECRET);
    return res.status(200).json({token:token});
}


/**
 * Método responsável por criar um user
 */
userController.createUser = async (req, res) => {

    /*Verificamos se o username encontra-se disponível*/
    const usernameExist = await User.findOne({ username: req.body.username });
    if (usernameExist) {
        res.status(400).json({ 'Error': 'That username is already in use.' })
    }

    /*Encriptamos a password*/
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        username: req.body.username,
        password: hashedPassword,
        registerDate: Date(Date.now())
    });

    try {
        await user.save();
        return res.status(200).json({ 'Success': 'The user was created with success.' });
    } catch (err) {
        console.log(err);
        return res.json(err)
    }
}

module.exports = userController;