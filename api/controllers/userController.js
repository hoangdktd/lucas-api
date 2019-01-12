const User = require('../models/User');
const userManager = require('../managers/UserManager');
const authService = require('../services/auth.service');
const oRest = require('../utils/restware');
const oConstant = require('../utils/constant');
const bcryptService = require('../services/bcrypt.service');
let userTypeList = ['admin', 'saler', 'deliver', 'designer']

const UserController = () => {
  const update = async (req, res) => {
    const { body } = req;
    const { query } = req;
    const { token } = req;

    console.log('Backend recieve API UPDATE USER: ');
    console.log('userId ========    ' + query.userId);
    try {
      var user = await User.findOne({
        where: {
          userId: query.userId
        },
      });
      if(!user) {
        return res.status(400).json({  msg: 'User is not exist' });
      } else {
        user.email = body.email;
        user.userType = body.userType;
        user.displayName =  body.displayName;
        user.userRole = body.userRole;
        user.userType = userTypeList[body.userRole];
        let updateUser = await user.update({});
        const token = authService().issue({ userId: updateUser.userId, role: updateUser.userRole }); // need check jwt hoangdktd
        return res.status(200).json({  token, "user": updateUser });
      }
    }catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }

    return res.status(400).json({ msg: 'Bad Request: Cannot update user now, try later' });
  };
  
  const deleteUser = async (req, res) => {
    const { body } = req;
    const { query } = req;
    const { token } = req;
    console.log(req);
    console.log('Backend recieve API DELETE USER: ');
    console.log('userId ========    ' + query.userId);

    if (token.role > 0) {
      return res.status(400).json({  msg: 'Only admin can delete new user' });
    }

    try {
      rowdeleted =  await User.destroy({
         where: {
            userId: query.userId //this will be your id that you want to delete
         }
      });
      if (rowdeleted > 0){
        return res.status(200).json({  msg: 'Delete success' });
      } else {
        return res.status(400).json({  msg: 'Cannot find user with id '   + query.userId });
      }
      
    }catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }

    return res.status(400).json({ msg: 'Bad Request: Cannot detele user now, try later' });
  }
  const changePassword = async (req, res) => {
    const { body } = req;
    const { query } = req;
    const { token } = req;
    console.log(req);
    console.log('Backend recieve API CHANGE PASS USER: ');
    console.log('userId ========    ' + query.userId);
    try {
      user =  await User.findOne({
         where: {
            userId: query.userId //this will be your id that you want to delete
         }
      });
      if (!user){
        return res.status(404).json({  msg: 'Cannot find user' });
      } else {
        if ((bcryptService().comparePassword(body.oldPassword, user.password))){
          user.password = body.newPassword;
          user.password = bcryptService().password(user);
          let updateUser = await user.update({});
          const token = authService().issue({ userId: updateUser.userId, role: user.userRole }); // need check jwt hoangdktd
          return res.status(200).json({  token, "user": updateUser });
        } else {
            return res.status(200).json({  msg: 'Wrong password' });
        }
      }
      
    }catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }

    return res.status(400).json({ msg: 'Bad Request: Cannot change password user now, try later' });
  }
  return {
    update,
    deleteUser,
    changePassword
  };
};

module.exports = UserController;