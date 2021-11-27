User = require('../model/user')

exports.checkAuthenticated = (req,res,next)=>{
    if(req.isAuthenticated()){
      return next()
    }
    res.redirect('/login')
  }


exports.checkNotAuthenticated = (req,res,next) => {
    if(req.isAuthenticated()){
      return res.redirect('/')
    }
    next()
  }

exports.checkAuthenticatedAdmin = async (req,res,next)=>{
  if(req.isAuthenticated()){
    const user = await User.findById(req.user.id)
  
    if(user.type == 'admin'){
      return next()
    }else{
      return res.redirect('/')
    }
    
  }
  res.redirect('/admin/login')
}

exports.checkNotAuthenticatedAdmin = async (req,res,next) => {
  
  if(req.isAuthenticated()){

    const user = await User.findById(req.user.id)

    if(user.type === 'admin'){
      return res.redirect('/admin')
    }else{
      return res.redirect('/')
    }
  }
  next()
}