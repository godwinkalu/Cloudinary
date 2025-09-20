const { createUser, deleteUser, allUsers, updateUser, getOneUser } = require('../controller/userController')
const upload  = require('../middleware/multer')
const router = require('express').Router()

router.post('/user',upload.single('image'),createUser)
router.get('/user',allUsers)
router.get('/user/:id',getOneUser)
router.delete('/user/:id',deleteUser)
router.put('/user/:id',upload.single('image'),updateUser)

module.exports = router