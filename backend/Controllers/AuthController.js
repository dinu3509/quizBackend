const bcrypt = require('bcrypt')
const UserModel = require("../Models/User")
const jwt = require("jsonwebtoken");
const signup = async(req,res)=>{
    try{
        const {name,email,password} = req.body;
        const user = await UserModel.findOne({email});
        if(user){
            return res.status(409)
                .json({Message:"User already exists",error:"User Already Exists"})
        }
        const userModel = new UserModel({name,email,password});
        userModel.password = await bcrypt.hash(password,10);
        await userModel.save();
        res.status(201).json({Message:"Signup Successful",success:true})

    }catch(err){
res.status(500).json({Message:"Internal Server Error",success:false})
    }
}
const login = async(req,res)=>{
    try{
        const{email,password} = req.body;
        const errMsg = "Auth failed email or password is wrong";
        const user = await UserModel.findOne({email});
        if(!user){
            return res.status(403).json({message:errMsg,success:false,error:"User doesn't exist"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({ message: errMsg, success: false,error:"Invalid Password" });
    }
        const jwToke =jwt.sign({email:user.email,_id:user._id} ,
            process.env.JWT_SECRET,
            {expiresIn:'1d'}
        )
        res.status(200).json({message:"Login Succes",success:true,jwToke,email,name:user.name})
    }catch(err){
        res.status(500).json({message:"Internal Server Error",success:false})
    }
}
module.exports = 
    {signup,login};
