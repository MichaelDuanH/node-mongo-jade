var mongoose = require('mongoose')
var MovieSchema = require('../schema/movie')//引入导出的模块
//编译执行model
var Movie = mongoose.model('Movie',MovieSchema)

module.exports = Movie