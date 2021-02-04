const express = require('express');
const authorize = require('../middlewares/authorize');

const users = require('./user-router');
const auditfiles = require('./auditfile-router');

const apiRouter = express.Router();

apiRouter.get('/', function (req, res) {
  res.send({ status: 'ok' });
});

apiRouter.use('/users', users);
apiRouter.use('/auditfiles', /*authorize(),*/ auditfiles);

module.exports = apiRouter;
