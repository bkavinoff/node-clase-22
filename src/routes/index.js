const express = require('express')
const { Router } = require('express')
const router = Router()

router.get('/', (req, res)=>{
    res.redirect('/productos')
})

router.get('/productos', (req, res)=>{
    res.sendFile('/productos/index.html')
})

router.get('/productos-test', (req, res)=>{
    res.sendFile('/productos-test/index.html')
})


module.exports = router; //exporto para poder usarlo en otro file