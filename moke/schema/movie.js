var mongoose = require('mongoose')
var MovieSchema = new mongoose.Schema({
	direc:String,
	title:String,
	language:String,
	country:String,
	summary:String,
	flash:String,
	poster:String,
	year:Number,
	meta:{
		creatAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
})
//每次存储数据之前都会调用这个方法
MovieSchema.pre('save',function(next){
	//判断数据是不是新加的
	if(this.isNew){
		//并且把时间更新为当前时间
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}

	next()//调用next，可以将存储流程走下去
})

//静态方法，模型编译实例化之后才与数据库交互
MovieSchema.statics = {
	//fetch方法取出目前数据库的数据
	fetch:function(cb){
		return this
		 .find({})
		 .sort('meta.updateAt')//安装更新的时间进行排序
		 .exec(cb)

	},
	findById:function(id,cb){
		return this
		 .findOne({_id:id})
		 .sort('meta.updateAt')//安装更新的时间进行排序
		 .exec(cb)
	}
};
//将它导出
module.exports = MovieSchema

