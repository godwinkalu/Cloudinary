const router = require('express').Router()
const upload = require('../middleware/multer')
const { addProduct,  getOneProduct, getAllProduct, deleteProduct } = require('../controller/productController')
router.post('/product', upload.array('image',5), addProduct)
router.get('/product', getAllProduct)
router.get('/product/:id', getOneProduct)
router.put('/product/:id', upload.array('image',5), )
router.delete('/product/:id', deleteProduct)


module.exports = router