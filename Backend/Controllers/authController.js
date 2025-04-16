const { oauth2client } = require("../uitl/googleconfig")
const axios = require("axios")
const jwt = require('jsonwebtoken');
const User = require("../Models/user_mode")

exports.googleauth = async (req,res) => {   
    const  code = req.query.code;
    console.log(code);
    try{
        console.log("getting token")
        const googleres = await oauth2client.getToken(code);
        console.log(googleres)
        oauth2client.setCredentials(googleres.tokens);
        console.log("credential is set");
        const userres = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleres.tokens.access_token}`
        )
        const {email, name, picture } = userres.data;

        let user = await User.findOne({email});
        
        
        if(!user) {
            user = await User.create({
                name,
                email,
                image: picture, 
                googleAcccessToken : googleres.tokens.access_token,
                googleRefreshToken : googleres.tokens.refresh_token,
                googleExpiryDate : new Date(googleres.tokens.expiry_date)
            });
        }


        const { _id } = user;
        console.log(_id);
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

