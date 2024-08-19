import userService from '../services/userService.js';

const getUsers = async (req, res) =>{
    try {
        const result = await userService.getUsers();
        res.status(200).send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        req.logger.error('Error fetching products: ', error.message);
        res.status(500).send({
            status: 'error',
            message: 'Error fetching users.'
        });
    }
}

const register = async (req, res) =>{
    try {
        const user = req.body;
        //console.log('Req body en controller: ', req.body);
        const result = await userService.registerUser(user);
        res.redirect('/login');
    } catch (error) {
        res.redirect('/register');
    }
}

const failRegister = (req, res) =>{
    res.status(400).send({
        status: "error",
        message: "Filed register"
    });
}

const login = async (req, res) =>{
    const { email, password } = req.body; 
    try {
        const user = await userService.findUserByEmail(email);
        console.log('User by email: ', user);
        req.session.failLogin = false;
        await userService.updateLastConnection(email);
        const accessToken = await userService.loginUser(email, password);

        res.cookie('accessToken', accessToken , { maxAge: 60*60*1000, httpOnly: true });
        console.log('rol: ', user.role);

        if (user.role == 'Admin') {
            return res.redirect('/adminPanel')
        } else {
            return res.redirect("/products");
        }
     } catch (error) {
         console.log('Error durante el login. Error: ', error.message);
         req.session.failLogin = true;
         return res.redirect("/login");
     }
     
 }

const failLogin = (req, res) =>{
    res.status(400).send({
        status: "error",
        message: "Filed login"
    });
}

const logout = async (req, res) =>{
    try {
        const email = req.user.user.email;
        console.log(email);
        await userService.updateLastConnection(email);

        req.session.destroy( error =>{
            res.clearCookie("accessToken");
            res.redirect("/login");
        });
    } catch (error) {
        console.log('Error durante el logout. Error: ', error.message);
        res.redirect("/login");
    }
}

const github = (req, res) =>{
    res.send({
        status: 'success',
        message: 'Success'
    });
}

const githubcallback = (req, res) =>{
    req.session.user = req.user;
    res.redirect('/products');
}

const current = (req, res) =>{
    res.send({
        status: 'success',
        user: req.user
    });
}

//Preguntar si deberia actualizar el token o no, porque no me lo actualiza bien creo
const switchRole = async (req, res) =>{
    try {
        const { uid } = req.params;
        const user = await userService.getUser(uid);

        const requiredDocuments = ["ID Document", "Address Document", "Account Statement Document"];
        const uploadedDocuments = user.documents.map(doc => doc.name);
        const hasAllDocuments = requiredDocuments.every(doc => uploadedDocuments.includes(doc));

        if (user.role === 'User' && !hasAllDocuments) {
            return res.status(400).send({
                status: 'error',
                message: 'User must upload all required documents before switching to Premium.'
            });
        }

        const role = user.role == 'Premium' ? 'User' : 'Premium';

        const accessToken = await userService.switchRole(uid, role);
        //res.cookie("accessToken", accessToken, { maxAge: 60*60*1000, httpOnly: true });//Guardo el token en la cookie

        res.status(200).send({
            status: 'success'
        });
    } catch (error) {
        req.logger.error('Error updating role.');
        res.status(500).send({
            status: 'error',
            message: error.message
        });
    }
}

const uploadDocuments = async (req, res) =>{
    const { uid } = req.params;
    console.log('Req files: ', req.files);
    try {
        const user = await userService.getUser(uid);

        if(!user){
            return res.status(404).send({
                status: 'error',
                message: 'User not found.'
            });
        }

        const documents = [];
        
        if (req.files.profileImage) {
            documents.push({
                name: 'Profile Image',
                reference: req.files.profileImage[0].path
            });
        }
        if (req.files.productImage) {
            documents.push({
                name: 'Product Image',
                reference: req.files.productImage[0].path
            });
        }
        if (req.files.idDocument) {
            documents.push({
                name: 'ID Document',
                reference: req.files.idDocument[0].path
            });
        }
        if (req.files.addressDocument) {
            documents.push({
                name: 'Address Document',
                reference: req.files.addressDocument[0].path
            });
        }
        if (req.files.accountStatementDocument) {
            documents.push({
                name: 'Account Statement Document',
                reference: req.files.accountStatementDocument[0].path
            });
        }

        await userService.updateUserDocuments(uid, documents);

        res.status(200).send({
            status: 'success',
            message: 'Documents uploaded successfully'
        });
    } catch (error) {
        console.error('Error uploading documents.');
        res.status(500).send({
            status: 'error',
            message: error.message
        });
    }
}

const updateAddress = async (req, res) =>{
    try {
        const { uid } = req.params;
        const address = req.body;
        const adr = address.address ? address.address : address;// Para manejar lo del fetch que me devuelve un objeto
        console.log('Address: ', adr);
        console.log('User: ', uid);
        await userService.updateAddress(uid, adr);

        res.status(200).send({
            status: 'success',
            message: 'Address uploaded successfully'
        });
    } catch (error) {
        console.log('Error updating address.');
    }
}

const deleteInactiveUsers = async (req, res) =>{
    try {
        const inactivityLimit = new Date(Date.now() - 15 * 60 * 1000);

        //Busco usuarios inactivos
        const inactiveUsers = await userService.searchInactiveUsers(inactivityLimit);
        if (inactiveUsers.length === 0) {
            return res.status(200).send({
                message: 'No hay usuarios inactivos para eliminar'
            });
        }

        //Saco los administradores para que no se eliminen
        const usersToDelete = inactiveUsers.filter(user => user.role !== 'Admin');
        
        for (const user of usersToDelete) {
            try {
                console.log('Email: ', user.email);
                await userService.sendInactivityEmail(user.email);
            } catch (error) {
                console.error(`Error enviando correo a ${user.email}:`, error);
            }
        }
        
        //Borro el usuario y el carrito asociado
        await userService.deleteUsersAndCarts(usersToDelete);

        res.status(200).send({
            status: 'success',
            payload: inactiveUsers
        });
    } catch (error) {
        console.log('Error updating address.');
    }
}

export default {
    getUsers,
    register,
    failRegister,
    login,
    failLogin,
    logout,
    github,
    githubcallback,
    current,
    switchRole,
    uploadDocuments,
    updateAddress,
    deleteInactiveUsers
};