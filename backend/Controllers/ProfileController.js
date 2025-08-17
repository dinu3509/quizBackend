const File = require("../Models/FileModel");
const Profile = require("../Models/UserProfile");

const getProfileImage = async (req, res) => {
  try {
    
    const userId = req.user._id;
    const file = await File.findOne({ userId });
    if (!file) return res.status(404).json({ message: "No image found" });

    const base64Image = file.data.toString("base64");
    res.json({
      image: `data:${file.contentType};base64,${base64Image}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user._id;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    // Delete old image if exists
    await File.findOneAndDelete({ userId });

    // Save new image
    const newFile = new File({
      userId,
      name: file.originalname,
      data: file.buffer,
      contentType: file.mimetype,
    });

    await newFile.save();

    res.status(201).json({ message: "Profile image uploaded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------------------- PROFILE INFO CONTROLLERS ---------------------- //
const getProfileInfo = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const saveProfileInfo = async (req, res) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    const userId = req.user._id;
    const { name, email, phone, dob } = req.body;

    // Update profile info
    let profile = await Profile.findOne({ userId });
    if (!profile) {
      profile = new Profile({ userId, name, email, phone, dob });
    } else {
      profile.name = name || profile.name;
      profile.email = email || profile.email;
      profile.phone = phone || profile.phone;
      profile.dob = dob || profile.dob;
    }
    await profile.save();

    // Update profile image if file exists
    if (req.file) {
      await File.findOneAndDelete({ userId }); // remove old one
      const newFile = new File({
        userId,
        name: req.file.originalname,
        data: req.file.buffer,
        contentType: req.file.mimetype,
      });
      await newFile.save();
       base64Image = `data:${newFile.contentType};base64,${newFile.data.toString("base64")}`;
    }

    res.status(200).json({ message: "Profile updated successfully", profile,image:base64Image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  uploadProfileImage,
  getProfileImage,
  getProfileInfo,
  saveProfileInfo,
};
