// 책 스키마

var crypto = require('crypto');

var Schema = {};

Schema.createSchema = function(mongoose) {
	
	var CreateRoomSchema = mongoose.Schema({
		room_name: String
		, writer: String
	    , category: String
		, room_intro: String
		, book_img: String
		, like: Number
		, todaybook: String
		, todaybookCheck: Number
	});

	CreateRoomSchema.static('findAll', function(callback) {
		return this.find({}, callback);
	});

	return CreateRoomSchema;
};

module.exports = Schema;

