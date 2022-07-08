const express= require('express'); 
const router=express.Router(); 
const {check,validationResult}=require('express-validator');
const auth=require('../../middlewear/auth');
const Profile=require('../../model/Profile');


//@route POST api/profile
//@desc Create Or Update user profile
//@access Private
router.post(
  '/',[auth],
  
    [check('status', 'status is required').not().isEmpty(), check('skills', 'skills is required').not().isEmpty()],

  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;
    console.log(req.body);
    //build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (bio) profileFields.bio = bio;
    if (location) profileFields.location = location;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }
    console.log(company, 'company');

    //build profile social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //update
        profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });
        return res.json(profile);
      }
      ///create profile
      profile = new Profile(profileFields);
      await profile.save();
      console.log(profileFields, 'profields');
      console.log(profile, 'profile');
      res.json(profile);
    } catch (err) {
      console.log(err, 'checking error');
      res.status(500).send('server error');
    }
  }
);

//@route get profile
//@desc get all profile data 
//@access Private
router.get('/',[auth],async (req,res)=>{
  try{
  const profile=await Profile.findOne({user:req.user.id}).populate('user',['name','avatar'])
  if(!profile){
    res.status(500).send({msg:"profile not found"})
  }  
  res.json(profile);
  console.log(profile);
  }catch(err){
    console.log(err.message); 
    res.status(401).send({msg:err.array()});

  }

});

//@route get profile by id
//@desc get profile data by id
//@access Private
router.get('/:id',[auth],async (req,res)=>{
  
  const profile=await Profile.findById(req.params.id);
  if(!profile){
    res.status(500).send({msg:"profile not found"})
  }  
  res.json(profile);


});

//@route delete profile
//@desc delete all profile data 
//@access Private
router.delete('/',auth,async (req,res)=>{
await Profile.findOneAndRemove({user:req.user.id});
  
  res.json("remove profile")


});

//@route put api/profile/exprience
//@desc update profile/exprience
//@access Private
router.put('/experience',[auth,[
check("title","title is required").not().isEmpty(),
check("company","company is required").not().isEmpty(),
check("from","from is required").not().isEmpty()




],],async (req,res)=>{
  const error=validationResult(req);
  if(!error.isEmpty()){
    res.status(401).send({error:error.array()});
  }
  const {title,company,location,from,to,current,description}=req.body;
  const newExp={
    title,company,location,from,to,current,description };
  try{
  const profile=await Profile.findOne({user:req.user.id});
  if(!profile){
    res.status(401).send({msg:"user not authorized"});
  }
  profile.experience.unshift(newExp);
  await profile.save();
    
    res.json(profile);
  
  }catch(err){
    console.log(err.message);
    res.status(400).send("server error");

  }
  });
  

  //@route delete api/profile/exprience
//@desc delete profile/exprience
//@access Private
router.delete('/experience/:id',[auth],async (req,res)=>{
    try{
    const profile=await Profile.findOne({user:req.user.id});
    if(!profile){
      res.status(401).send({msg:"user not authorized"});
    }
    const removeExp = profile.experience.map((exp)=>exp.id.indexOf(req.params.id))
    profile.experience.splice(removeExp,1);
    await profile.save();
      
      res.json(profile);
    
    }catch(err){
      console.log(err.message);
      res.status(400).send("server error");
  
    }
    });
  
    //@route put api/profile/education
//@desc update profile/eduction
//@access Private
router.put('/education',[auth,[
  check("school","school is required").not().isEmpty(),
  check("degree","degree is required").not().isEmpty(),
  check("fieldofstudy","fieldofstudy is required").not().isEmpty()
  
  
  
  
  ],],async (req,res)=>{
    const error=validationResult(req);
    if(!error.isEmpty()){
      res.status(401).send({error:error.array()});
    }
    const {school,degree,fieldofstudy,from,to,current,description}=req.body;
    const newExp={
      school,degree,fieldofstudy,from,to,current,description};
    try{
    const profile=await Profile.findOne({user:req.user.id});
    if(!profile){
      res.status(401).send({msg:"user not authorized"});
    }
    profile.education.unshift(newExp);
    await profile.save();
      
      res.json(profile);
    
    }catch(err){
      console.log(err.message);
      res.status(400).send("server error");
  
    }
    });

    //@route put api/profile/education
//@desc update profile/eduction
//@access Private
router.delete('/education/:id',[auth],async (req,res)=>{
    const error=validationResult(req);
    if(!error.isEmpty()){
      res.status(401).send({error:error.array()});
    }
    try{
    const profile=await Profile.findOne({user:req.user.id});
    if(!profile){
      res.status(401).send({msg:"user not authorized"});
    }
    const removeEdu=await profile.education.map((edu)=>edu.id.indexOf(req.params.id));
    profile.education.splice(removeEdu,1)
    await profile.save();
      
      res.json(profile);
    
    }catch(err){
      console.log(err.message);
      res.status(400).send("server error");
  
    }
    });

module.exports=router;