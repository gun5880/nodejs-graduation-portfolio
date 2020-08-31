/**
 * 패스포트 설정 파일
 * 
 * 로컬 인증방식에서 회원가입에 사용되는 패스포트 설정
 *
 * @date 2016-11-10
 * @author Mike
 */

var LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy({
		usernameField : 'room_name',
		passwordField : 'category',
		introFirld: 'room_intro',
		imgFirld: 'book_img',
		writerFirld: 'writer',
		passReqToCallback : true 
	}, function(req, email, password, done) {
		// 요청 파라미터 중 name 파라미터 확인
		
		console.log("req확인", req.file.originalname);

		var paramName = req.body.room_name || req.query.room_name;
		var paramIntro = req.body.room_intro || req.query.room_intro;
		var paramCategory = req.body.category || req.query.category;
		var paramWriter = req.body.writer || req.query.writer;
		var paramBookImg = req.file.originalname;
		var like = 0;
		var todaybookCheck = 0;

		console.log("나와라", paramBookImg);
		
	    // findOne 메소드가 blocking되지 않도록 하고 싶은 경우, async 방식으로 변경
		var database = req.app.get('database');
			
		var createRoom = new database.CreateRoomModel({'room_name':paramName, 'writer':paramWriter ,'category': paramCategory, 'room_intro':paramIntro, 'book_img': paramBookImg, 'like': like, 'todaybook': '','todaybookCheck': todaybookCheck});
		createRoom.save();

		return done(null, true);



	});
