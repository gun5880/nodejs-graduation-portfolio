
module.exports = function(router, passport) {
    console.log('user_passport 호출됨.');
    const multer = require('multer');

    //책 이미지 유저 이미지를 넣기 위한 multer 모듈 사용
    const upload = multer({
        limits: { fileSize: 5 * 1024 * 1024 },
        storage: multer.diskStorage({
            destination(req, file, cb) {
                cb(null, 'uploads/'); // avatars 폴더에 파일을 저장한다.
              },
          filename(req, file, cb) {
            cb(null, file.originalname); // 전송된 파일 자신의 이름으로 파일을 저장한다.
          } 
        })
      });

    
    // 홈 화면
    router.route('/').get(function(req, res) {
        console.log('/ 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('index.ejs', {login_success:false});
        } else {
            console.log('사용자 인증된 상태임.');
            res.render('index.ejs', {login_success:true});
        }
    });
    
    // 로그인 화면
    router.route('/login').get(function(req, res) {
        console.log('/login 패스 요청됨.');
        res.render('login.ejs', {message: req.flash('loginMessage')});
    });
	 
    // 회원가입 화면
    router.route('/signup').get(function(req, res) {
        console.log('/signup 패스 요청됨.');
        res.render('signup.ejs', {message: req.flash('signupMessage')});
    });
	 
    // 방 목록 화면
    router.route('/room_list').get(function(req, res) {
        console.log('/room_list 패스 요청됨.');

        // 인증된 경우, req.user 객체에 사용자 정보 있으며, 인증안된 경우 req.user는 false값임
        console.log('req.user 객체의 값');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');
            console.log('/room_list 패스 요청됨.');
            console.dir(req.user);


            //find함수로 책 목록 전부를 가져와서 ejs파일로 넘어갈때 user정보와 책데이터를 보냄
            var database = req.app.get('database');
            database.CreateRoomModel.find({}, function (err, board) {
                res.render('room_list.ejs', {user: req.user, roomlist: board});
            });
        }
    });

    //SEARCH화면
    router.route('/search').get(function(req, res) {
        console.log('/bookmark 패스 요청됨.');

        //get방식으로 검색한 것을 query로 받아옴
        var search = req.query.search;
        
        //RegExp라는 문자열 비교 함수를 사용하여 검색된 책 데이터를 받아와 ejs에게 보내줌
        var database = req.app.get('database');
            database.CreateRoomModel.find({room_name:  new RegExp(search)}, function (err, booklist) {
                res.render('search.ejs', {user: req.user, booklist: booklist, input: search});
            });
    });

    //즐겨찾기화면
    router.route('/mybookmark').get(function(req, res) {
        console.log('/bookmark 패스 요청됨.');
        
        //본인 즐겨찾기한 것을 기존에 저장되어 있는 user안에 email을 통해서 find함수로 값을 찾음
        var database = req.app.get('database');
            database.BookmarkModel.find({email: req.user.email}, function (err, bookmark) {
                res.render('mybookmark.ejs', {user: req.user, bookmark: bookmark});
            });
    });

    //오늘 책 추천해주는 페이지 화면
    router.route('/todaybook').get(function(req, res) {
        console.log('/todaybook 패스 요청됨.');

        //오늘 날짜 구하는 코드
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth()+1
        var day = date.getDate();
        if(month < 10){
            month = "0"+month;
        }
        if(day < 10){
            day = "0"+day;
        }
    
        var todayFormat = year+"-"+month+"-"+day;
        
        //오늘 날짜를 비교하여 데이터를 뽑음
        var database = req.app.get('database');
        database.CreateRoomModel.find({todaybook: todayFormat}, function (err, book) {
            database.ReplyModel.find({book_id: book[0]._id}, function(err, reply){
                console.log("리플확인", reply);
                res.render('todaybook.ejs', {user: req.user, book: book[0], reply: reply});
            })
        });

    });


    //책 생성 화면
    router.route('/create_room').get(function(req, res) {
        console.log('/create_room 패스 요청됨.');
        res.render('create_room.ejs', {message: req.flash('createRoomMessage')});
    });

    //책 자세히보기 화면
    router.route('/room_detail').post(function(req, res) {
        console.log('/room_detail 패스 요청됨.');

        //post방식으로 책의 아이디를 받아서 자세히보기 ejs화면에 갈때 값을 같이 보내준다.
        var database = req.app.get('database');
        database.CreateRoomModel.findOne({_id: req.body.id}, function (err, board) {
              res.render('room_detail.ejs', {user: req.user, detailRoom: board});
         });
        
    });

    //좋아요추가
    router.route('/likeUp').post(function(req, res) {
        var id = req.body.id;

        var database = req.app.get('database');

        //해당하는 book id값을 비교해 찾아 like속성의 값을 +1 해준다.
        database.CreateRoomModel.update({_id: id},{$inc: {like: 1}}, function (err) {
            if(!err){
                res.send({result:true});
            }
        });
        
    });

    //평가남기기
    router.route('/insertReply').post(function(req, res) {
        var id = req.body.id;
        var reply = req.body.reply;
        var database = req.app.get('database');

        //리플 스키마 저장
        var insertReply = new database.ReplyModel({'book_id': id, 'r_writer': reply})
        insertReply.save();


        res.send({result:true});
        
    });

    //평가불러오기
    router.route('/replyList').post(function(req, res) {
        var id = req.body.id;

        var database = req.app.get('database');

        //ajax post방식으로 요청을 받아 해당하는 bookid로 비교하여 값을 찾은 뒤 send로 값만 보내줌
        database.ReplyModel.find({book_id: id}, function (err, reply_list) {
            console.log(reply_list);
            res.send(reply_list);
       });
        
    });

    //즐겨찾기 추가하기
    router.route('/addBookmark').post(function(req, res) {
        //post방식으로 클라이언트에게 데이터를 받음
        var id = req.body.id;
        var email = req.body.email;
        var title = req.body.title;
        var img = req.body.img;

        var database = req.app.get('database');
        var addB = new database.BookmarkModel({'book_id': id, 'email': email, 'room_name': title, 'book_img': img});

        //데이터가 있으면 false를 보내주어 이미 즐겨찾기가 되어있다고 알터창을 띄워줌 없으면 save
        database.BookmarkModel.find({book_id: id, email: email}, function(err, bookmark){
            console.log("데이터있니",bookmark);
            if(!bookmark[0]){
                console.log("데이터가 없다.");
                addB.save();

                res.send({result:true});
            }else{
                console.log("데이터가 있다.")
                res.send(false);
            }
        })        
    });

    //오늘의 책 선정
    router.route('/addTodayBook').post(function(req, res) {
        var id = req.body.id;

        var database = req.app.get('database');

        //오늘 날짜 구하는 코드
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth()+1
        var day = date.getDate();
        if(month < 10){
            month = "0"+month;
        }
        if(day < 10){
            day = "0"+day;
        }
    
        var todayFormat = year+"-"+month+"-"+day;


        //todaybook속성: 오늘 날짜 들어가는 곳 todaybookCheck속성: 0이면 지정안됨 1이면 지정됨
        database.CreateRoomModel.find({todaybook: todayFormat, todaybookCheck: 1}, function(err, today){
            console.log("데이터있니",today);
            if(!today[0]){
                console.log("데이터 없어서 그냥 지정한다.");
                //update해줌 inc로 1증가
                database.CreateRoomModel.update({_id: id},{$inc: {todaybookCheck: 1}, $set: {todaybook: todayFormat}}, function (err) {
                    if(!err){
                         res.send({result:true});
                    }
                });
            }else{
                console.log("데이터 있어서 업데이트한다.", today[0]._id);
                
                //기존 책 inc로 1깎고 클릭 된 책 1증가
                database.CreateRoomModel.update({_id: today[0]._id},{$inc: {todaybookCheck: -1}, $set: {todaybook: 0}}, function (err) {
                    if(!err){
                        database.CreateRoomModel.update({_id: id},{$inc: {todaybookCheck: 1}, $set: {todaybook: todayFormat}}, function (err) {
                            if(!err){
                                 res.send({result:true});
                            }
                        });
                    }
                });
            }
        })        
    });
	
    // 로그아웃
    router.route('/logout').get(function(req, res) {
        console.log('/logout 패스 요청됨.');
        req.logout();
        res.redirect('/');
    });


    // 로그인 인증
    router.route('/login').post(passport.authenticate('local-login', {
        successRedirect : '/room_list', 
        failureRedirect : '/login', 
        failureFlash : true 
    }));

    // 회원가입 인증
    router.route('/signup').post(passport.authenticate('local-signup', {
        successRedirect : '/room_list', 
        failureRedirect : '/signup', 
        failureFlash : true 
    }));

    //방생성 인증
    router.route('/create_room').post(upload.single('book_img'), passport.authenticate('local_createRoom', {
        successRedirect : '/room_list', 
        failureRedirect : '/create_room', 
        failureFlash : true 
    }));

};