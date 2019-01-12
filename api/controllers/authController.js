const User = require('../models/User');
const userManager = require('../managers/UserManager');
const authService = require('../services/auth.service');
const bcryptService = require('../services/bcrypt.service');
const oRest = require('../utils/restware');
const oConstant = require('../utils/constant');

let userTypeList = ['admin', 'saler', 'deliver', 'designer']
let masterKey = "phamduylaideptrai"

const AuthController = () => {
  const register = async (req, res) => {
    const { body } = req;
    console.log('userId ========    ' + body.userId);
    console.log('displayName ========    ' + body.displayName);
    console.log('userType ========    ' + body.userType);
    console.log('password ========    ' + body.password);
    console.log('role number ========    ' + body.userRole);

    //Check create admin by masterkey
    if( body.userRole == 0) {
      if (body.masterKey != masterKey)
        return res.status(400).json({  msg: 'You need masterkey to create admin' });
    } else if (body.token) {
      decodeToken = authService().decodeToken(body.token)
      if (decodeToken && decodeToken.role > 0) {
        return res.status(400).json({  msg: 'Only admin can create new user' });
      }
    } else {
      return res.status(400).json({  msg: 'Only admin can create new user' });
    }

    try {
      const checkUser = await User.findOne({
        where: {
          userId: body.userId,
        },
      });

      if(!checkUser) {
        const user = await User.create({
          email: body.email,
          userId: body.userId,
          userType: body.userType,
          displayName: body.displayName,
          password : body.password,
          userRole: body.userRole,
          userType : userTypeList[body.userRole]

        });
        const token = authService().issue({ userId: user.userId, role: user.userRole });

        return res.status(200).json({  token, user });

      } else {

        return res.status(200).json({  msg: 'duplicate' });
      }

    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }

    return res.status(400).json({ msg: 'Bad Request: Passwords don\'t match' });
  };

  const login = async (req, res) => {
    const { body } = req;
    console.log('userId ========    ' + body.userId);
    console.log('password ========    ' + body.password);
    try {
      const user = await User.findOne({
        where: {
          userId: body.userId
        },
      });

      if(!user) {
        return res.status(400).json({  msg: 'User is not exist' });
      } else {
        if ((bcryptService().comparePassword(body.password, user.password))){
            const token = authService().issue({ userId: user.id, role: user.userRole }); // need check jwt hoangdktd
            return res.status(200).json({  token, user });
        } else {
            return res.status(200).json({  msg: 'Wrong password' });
        }
      }

    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }

    return res.status(400).json({ msg: 'Bad Request: Email or Passwords don\'t match' });
  };
  return {
    register,
    login
  };
};

module.exports = AuthController;