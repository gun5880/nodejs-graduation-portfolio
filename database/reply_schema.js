// reply 스키마

var crypto = require('crypto');

var Schema = {};

Schema.createSchema = function(mongoose) {
	
	// 방생성 스키마 정의
	var ReplySchema = mongoose.Schema({
		book_id: String
		, r_writer: String
	});

	ReplySchema.static('findAll', function(callback) {
		return this.find({}, callback);
	});

	return ReplySchema;
};

// module.exports에 UserSchema 객체 직접 할당
module.exports = Schema;

