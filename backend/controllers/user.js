const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const INVALID_CREDENTIALS = 'Wrong Credentials email/password';

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hashPassword => {
    const user = new User({
      email: req.body.email,
      password: hashPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      isAdmin: req.body.isAdmin
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: 'User Created',
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          message: 'Email is taken'
        });
      });
  });
};

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: INVALID_CREDENTIALS
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: INVALID_CREDENTIALS
        });
      }
      const token = jwt.sign(
        {
          email: fetchedUser.email,
          userId: fetchedUser._id,
          firstName: fetchedUser.firstName,
          lastName: fetchedUser.lastName,
          isAdmin: fetchedUser.isAdmin
        },
        'secret_this_should_be_longer',
        { expiresIn: '1h' }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600, //in seconds
        userId: fetchedUser._id,
        firstName: fetchedUser.firstName,
        lastName: fetchedUser.lastName,
        isAdmin: fetchedUser.isAdmin
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: INVALID_CREDENTIALS
      });
    });
};
