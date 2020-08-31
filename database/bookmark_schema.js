// book 스키마 생성


var crypto = require('crypto');

var Schema = {};

Schema.createSchema = function(mongoose) {
	
	// 즐겨찾기 스키마 정의
	var BookmarkSchema = mongoose.Schema({
		book_id: String
		, email: String
		, room_name: String
		, book_img: String

	});

	BookmarkSchema.static('findAll', function(callback) {
		return this.find({}, callback);
	});

	return BookmarkSchema;
};

// module.exports에 UserSchema 객체 직접 할당
module.exports = Schema;

