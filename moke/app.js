//主入口文件
var express = require('express')
var path = require('path') //路径head里面查找引入的资源
    //var connect = require('connect')
var mongoose = require('mongoose')
var _ = require('underscore')
var port = process.env.PORT || 4000 //precess是一个全局变量
var app = express()
//调用mongoose的connect
mongoose.connect('mongodb://localhost/imooc')
app.locals.moment=require('moment')
//将模型引入
var Movie = require('./model/movie')
app.set('views', './views/pages') //设置视图的根目录
app.set('view engine', 'jade')//设置默认的模板引擎
    //app.use(express.bodyParser())
var bodyParser = require('body-parser') //将表单的数据进行格式化
app.use(bodyParser.urlencoded())
app.listen(port) //监听端口
app.use(express.static(path.join(__dirname, 'public')))
console.log('moke start on port ' + port) //PORT=4000 node app.js 改变端口


//开始编写路由,编写模拟数据
app.get('/', function(req, res) {
    //查询数据库那数据
    Movie.fetch(function(err,movies) { //将movies数组作为参数传进来
            if (err) {
                console.log(err)
            } else {
                res.render('index', {
                    title: 'moke 首页',
                    movies: movies //将查询到的movies列表赋给movies显示
                })
            }
        })
        /*res.render('index',{
		title:'moke 首页',
		movies:[{
			title:'机械战警',
			_id:1,
			poster:'/img/jszj_1.jpg'
		},{
			title:'机械战警',
			_id:2,
			poster:'/img/jszj_2.jpg'
		},{
			title:'机械战警',
			_id:3,
			poster:'/img/jszj_3.jpg'
		},{
			title:'机械战警',
			_id:4,
			poster:'/img/jszj_4.jpg'
		}]
	})*/

})

app.get('/admin/list', function(req, res) {

	//查询数据库那数据
    Movie.fetch(function(err,movies) { //将movies数组作为参数传进来
            if (err) {
                console.log(err)
            } else {
                res.render('list', {
                    title: 'moke列表页',
                    movies: movies //将查询到的movies列表赋给movies显示
                })
            }
        })
    /*res.render('list', {
        title: 'moke 列表页',
        movies:*/ /*[{
            title: '机械战警',
            _id: 1,
            direc: 'michael',
            country: 'america',
            year: '2014',
            language: 'english',
            flash: 'http://player.youku.com/player.php/sid/XNjMyMTkzMjQw/v.swf',
            summary: 'this is good'
        }]*/
})

app.get('/admin/movie', function(req, res) {
    res.render('admin', {
        title: 'moke 后台录入页',
        movie: {
            title:'',
            direc:'',
            country:'',
            year:'',
            poster: '',
            flash: '',
            summary: '',
            language: ''
        }
    })

})

//admin post movie 拿到后台表单post过来的数据
app.post('/admin/movie/new', function(req, res) {
    var id = req.body.movie._id
    var movieObj = req.body.movie
    var _movie
    if (id !== 'undefined') {//说明电影已经存储到数据库里面了
        Movie.findById(id, function(err,movie) {//查询到的movie,然后进行更新
            if (err) {
                console.log(err)
            }
            _movie = _.extend(movie, movieObj)//underscore里面的extend方法，可以使用新的字段替换老的字段，查询到的movie放到第一个位置，post过来的movieObj放到第二个位置
            _movie.save(function(err, movie) {
                if (err) {
                    console(err)
                }
                res.redirect('/movie/' + movie._id) //重定向
            })
        })
    } else {//如果这个电影在数据库里面没有,这是新加的电影
        _movie = new Movie({
            direc: movieObj.direc,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            summary: movieObj.summary,
            year: movieObj.year,
            poster: movieObj.poster,
            flash: movieObj.flash
        })
        _movie.save(function(err, movie) {
            if (err) {
                console.log(err)
            }
            res.redirect('/movie/' + movie._id) //重定向
        })
    }
})

//admin update
app.get('/admin/update/:id',function(req,res){
   var id = req.params.id//获取请求的id
   if(id){//如果id存在
   	Movie.findById(id,function(err,movie){
   		res.render('admin',{//渲染表达
   			title:'moke 后台更新页面',
   			movie:movie
   		})

   	})
   }
})



app.get('/movie/:id', function(req, res) {
    var id = req.params.id
    Movie.findById(id, function(err, movie) {
            res.render('detail', {
                title: 'moke'+movie.title,
                movie: movie
            })
        })
        /*res.render('detail',{
		title:'moke 详情页',
        movie:{
        	direc:'michael',
        	country:'america',
        	title:'机械战警',
        	year:'2014',
        	poster:'http://player.youku.com/player.php/sid/XNjMyMTkzMjQw/v.swf',
        	language:'English',
        	flash:'http://player.youku.com/player.php/sid/XNjMyMTkzMjQw/v.swf',
        	summary:'this is amazing'
        }
	})*/
})
//在入口文件 list delete movie
app.delete('/admin/list',function(req, res){//admin/list发送delete请求
    var id = req.query.id//通过query拿id
    if(id){
        Movie.remove({_id:id},function(err,movie){
            if(err){
                console.log(err)
            }
            else{
                res.json({success: 1})//返回json字符串
            }
        })
    }
})
