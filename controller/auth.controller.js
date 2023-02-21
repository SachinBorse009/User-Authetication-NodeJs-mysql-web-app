import dbConfig from "../config/db-config.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import dotenv from "dotenv";
dotenv.config();

class authController {
  static userRegister = async (req, res) => {
    const { name, email, password } = req.body;
    try {
      if (name && email && password) {
        //isUser
        dbConfig.query(
          "select email from users where email= ?",
          [email],
          async (error, result) => {
            if (error) {
              return res.status(400).json({ error: error.message });
            }
            if (result.length > 0) {
              req.flash("message", "Email is already exist");
              return res.redirect("/");
            } else {
              //hash password
              const genSalt = await bcryptjs.genSalt(10);
              const hashedPassword = await bcryptjs.hash(password, genSalt);

              //save mew user
              const sql = "INSERT INTO users set ?";
              const values = {
                name: name,
                email: email,
                password: hashedPassword,
              };
              dbConfig.query(sql, values, (error, result) => {
                if (error) {
                  return res.status(400).json({ error: error.message });
                } else {
                  return res.redirect("/login");
                }
              });
            }
          }
        );
      } else {
        req.flash("message", "All fields are required");
        return res.redirect("/");
      }
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };


  //login
  static userLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
      if (email && password) {
        //isUser
        dbConfig.query(
          "select * from users where email= ?",
          [email],
          async (error, result) => {
            if (error) {
              return res.status(400).json({ error: error.message });
            }
            if (result.length <= 0) {
              req.flash("message", "invalid Email and Password");
              return res.redirect("/login");
            } else {

              //compare password
              const compare = await bcryptjs.compare(
                password,
                result[0].password
              );
              if (!compare) {
                req.flash("message", "password does not match");
                return res.redirect("/login");
              } else {

                //send JWT token
                const token = jwt.sign(
                  { id: result[0].id },
                  process.env.JWT_SECRET,
                  { expiresIn: "2d" }
                );
                console.log("The Token is " + token);

                //cookie
                const cookieOption = {
                  expires: new Date(
                    Date.now() +
                      process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                  ),
                  httpOnly: true,
                };
                res.cookie("maverick", token, cookieOption);
                res.status(200).redirect("/home");
              }
            }
          }
        );
      } else {
        req.flash("message", "All fields are required");
        return res.redirect("/login");
      }
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };


  //isLoggedIn
  static isLoggedIn = async (req, res, next) => {
    const authHeader = req.cookies.maverick;
    console.log(authHeader);
    if (authHeader) {
      try {
        const decode = await promisify(jwt.verify)(
          authHeader,
          process.env.JWT_SECRET
        );
        console.log(decode);

        dbConfig.query(
          "select * from users where id=?",
          [decode.id],
          (err, result) => {
            if (!result) {
              return next();
            }
            req.user = result[0];
            return next();
          }
        );
      } catch (error) {
        console.log(error);
        return next();
      }
    } else {
      next();
    }
  };


  //logout
  static logout = async (req, res) => {
    res.cookie("maverick", "logout", {
      expires: new Date(Date.now() + 2 * 1000), // 2 sec
      httpOnly: true,
    });

    res.status(200).redirect("/login");
  };
}


export default authController;
