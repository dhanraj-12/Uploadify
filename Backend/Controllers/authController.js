const {oauth2client } = require("../uitl/googleconfig")
const axios = require("axios")
const jwt = require('jsonwebtoken');
const User = require("../Models/user_mode")

exports.googleauth = async (req,res) => {   
    const  code = req.query.code;
    console.log(code);
    try{
        const googleres = await oauth2client.getToken(code);
        console.log(googleres)
        oauth2client.setCredentials(googleres.tokens);
        const userres = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleres.tokens.access_token}`
        )
        const {email, name, picture } = userres.data;

        let user = await User.findOne({email});
        if(!user) {
            user = await User.findOneAndUpdate(
                {email},
                {
                name,
                email,
                image: picture, 
                googleAccessToken : googleres.tokens.access_token,
                googleRefreshToken : googleres.tokens.refresh_token,
                googleTokenExpiry : Date.now() + (googleres.tokens.expiry_date || 3600*1000)

            });
        }
        const { _id } = user;
        const token = jwt.sign({ _id, email },
            process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_TIMEOUT,
        });

        res.status(200).json({
            message: 'success',
            token,
            user,
        });
    }catch(err) {
        console.log(err);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

// exports.googleauth = (req, res) => {
//   res.send("Google Authentication Successful");
// };

