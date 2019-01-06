const User = require('../models/User');
const userManager = require('../managers/UserManager');
const authService = require('../services/auth.service');
const bcryptService = require('../services/bcrypt.service');
const oRest = require('../utils/restware');
const oConstant = require('../utils/constant');

const AuthController = () => {
  const register = async (req, res) => {
    const { body } = req;
    console.log('userName ========    ' + body.userName);
    console.log('userId ========    ' + body.userId);
    console.log('userType ========    ' + body.userType);
    console.log('eCoin ========    ' + body.eCoin);
    try {
      const checkUser = await User.findOne({
        where: {
          userName: body.userName,
          userId: body.userId,
        },
      });

      if(!checkUser) {
        const user = await User.create({
          userId: body.userId,
          email: body.email,
          userName: body.userName,
          userType: body.userType,
          eCoin: body.eCoin,
        });
        const token = authService().issue({ userId: user.userId });

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
    console.log('userName ========    ' + body);
    console.log('userName ========    ' + body.userName);
    console.log('password ========    ' + body.password);
    try {
      const checkUser = await User.findOne({
        where: {
          userName: body.userName
        },
      });

      if(!checkUser) {
        return res.status(400).json({  msg: 'user is not exist' });
      } else {
        const checkPwd = checkUser.validPassword(body.password);
        if (checkPwd){
            const token = authService().issue({ userId: checkUser.userId }); // need check jwt hoangdktd
            return res.status(200).json({  token, checkUser });
        } else {
            return res.status(200).json({  msg: 'duplicate' });
        }
      }

    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }

    return res.status(400).json({ msg: 'Bad Request: Passwords don\'t match' });
  };

  return {
    register,
    login
  };
};

module.exports = AuthController;
