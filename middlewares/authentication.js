import JWT from "jsonwebtoken";
import User from "../models/user";
const SECRETKEY = '/\@3dhmd@\/"';

export default class Authentication {
   static async auth(req, res, next) {
      try {
         const token = req.query.token || req.headers.token || req.body.token;
         if (!token) {
            return next(new Error('Not found authentication'));
         }
         const tokens = token.split('Bearer ');
         if (tokens.length !== 2 || tokens[0] !== '') {
            return next(new Error('Not authentication format'));
         }
         const authToken = tokens[1];
         const data = await JWT.verify(authToken, SECRETKEY);
         const _id = data._id;
         if (!_id) {
            return next(new Error('Cannot get _id from jwt payload'));
         }
         const user = await User.findById(_id).select('password');
         if (!user) {
            return next(new Error('User is not found'));
         }
         req.user = user;
         return next();
      } catch (e) {
         return next(new Error('Cannot authentication your account'));
      }
   }

}