const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const User = require('../models/user');
const emailCredential = require('../middleware/email-sender-credentials');

const INVALID_CREDENTIALS = 'Wrong Credentials email/password';
const INACTIVE_USER = 'You no longer has access to this site';

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hashPassword => {
    const user = new User({
      email: req.body.email,
      password: hashPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      isAdmin: req.body.isAdmin,
      isActive: req.body.isActive
    });
    user
      .save()
      .then(result => {
        sendNotification(user, req.body.password);
        res.status(201).json({
          message: 'User Created',
          result: result
        });
      })
      .catch(error => {
        res.status(500).json({
          message: 'Error creating user: ' + error
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
    })
    .then(() => {
      if (fetchedUser.isActive.toString() === 'false') {
        return res.status(401).json({
          message: INACTIVE_USER
        });
      }
      const token = jwt.sign(
        {
          email: fetchedUser.email,
          userId: fetchedUser._id,
          firstName: fetchedUser.firstName,
          lastName: fetchedUser.lastName,
          isAdmin: fetchedUser.isAdmin,
          isActive: fetchedUser.isActive
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
        email: fetchedUser.email,
        isAdmin: fetchedUser.isAdmin,
        isActive: fetchedUser.isActive
      });
    })
    .catch(error => {
      console.log(error);
      return res.status(401).json({
        message: INVALID_CREDENTIALS
      });
    });
};

exports.getUsers = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const userQuery = User.find({}).sort([['firstName', 1], ['lastName', 1]]);
  let fetchedUsers;
  if (pageSize && currentPage) {
    userQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  userQuery
    .then(documents => {
      fetchedUsers = documents;
      return User.count();
    })
    .then(count => {
      res.status(200).json({
        message: 'Users fetched successfully',
        users: fetchedUsers,
        maxUsers: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Failed to get users: ' + error
      });
    });
};

exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(400).json({ message: 'User not found' });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Failed to get user: ' + error
      });
    });
};

exports.modifyUser = (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.body.id },
    {
      isAdmin: req.body.isAdmin,
      isActive: req.body.isActive
    }
  )
    .then(() => {
      res.status(201).json({
        message: 'User Updated'
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Failed to update user: ' + error
      });
    });
};

exports.updateProfile = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hashPassword => {
    User.findOneAndUpdate(
      { _id: req.body.id },
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashPassword
      }
    )
      .then(() => {
        res.status(201).json({
          message: 'User Updated'
        });
      })
      .catch(error => {
        res.status(500).json({
          message: 'Failed to update user: ' + error
        });
      });
  });
};

function sendNotification(user, password) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailCredential.USER_NAME,
      pass: emailCredential.PASSWORD
    }
  });

  let mailOptions = {
    from: emailCredential.USER_NAME,
    to: user.email,
    subject: 'sMoneyTracker Registration',
    html: getHtml(user.firstName, user.lastName, user.email, password)
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log('Email was not able to send: ' + error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

function getHtml(firstName, lastName, email, password) {
  let content =
    '<h1>Welcome to sMoneyTracker</h1>' +
    '<h3>Dear ' +
    firstName +
    ' ' +
    lastName +
    ',</h3>' +
    '<p>Your account has been successfully created</p>' +
    '<p><strong>Your username is: </strong>' +
    email +
    '</p>' +
    '<p><strong>Your password is: </strong>' +
    password +
    '</p><br>' +
    '<p>We highlight recommend you update your password as soon you ' +
    '<a href="https://smoney-tracker.firebaseapp.com">login</a></p><br><br>' +
    '<h4>Best wishes,</h4>' +
    '<p>sMoneyTracker Team</p>';
  return content;
}
