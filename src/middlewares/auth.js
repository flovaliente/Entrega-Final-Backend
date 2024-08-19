/*export const authorization = (role) =>{
    return(req, res, next) =>{
      console.log(req.user);
      if(!req.user){
        return res.status(401).send({ error: 'Unauthorized'});
      }
      if(req.user.user.role != role){
        return res.status(403).send({ error: 'Not permissions'})
      }
  
      next();
    }
}*/

export const authorization = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).redirect("/unauthorized");
    }

    const userRole = req.user.user.role;
    if (allowedRoles.includes(userRole)) {
      return next();
    }

    return res.status(403).redirect("/unauthorized");
  };
}

/*export const authorization = (role) => (req, res, next) => {
  if (req.user.user.role === role) return next();
    
  res.status(401).send({ error: 'Unauthorized'});
};*/