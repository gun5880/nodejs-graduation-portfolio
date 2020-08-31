    /*db 라우터 */
    var express = require('express');
    var router = express.Router();
    var mysql_odbc = require('../database/db_conn')();
    var conn = mysql_odbc.init();

    module.exports= router;

    //게시판 글쓰기 insert
    router.get('/write',function(req,res,next){
        res.render('write', {title:"게시판 글 쓰기"});
    });

    router.post('/write',function(req,res,next){
        var name = req.body.name;
        var title = req.body.title;
        var content = req.body.content;
        var passwd = req.body.passwd;
        var datas = [name,title,content,passwd];

        var sql = "insert into board(name, title, content, regdate, passwd) values(?,?,?,now(),?)";
        conn.query(sql,datas,function(err,rows){
            if(err) console.error("err" + err);
            res.redirect('/board/page/1');
        });

    });

    //게시판 읽어오기 select
    router.get('/read/:idx',function(req,res,next)
    {
        var idx = req.params.idx;
        var sql = "select idx,name,title,content,date_format(regdate,'%Y-%m-%d %H:%i:%s') regdate from board where idx=?";
        conn.query(sql,[idx],function(err,rows)
        {
            if(err) console.error(err);
            res.render('read', {title:"글 상세", row:rows[0]});
        });
    });

    //게시판 수정 update
    router.post('/update',function(req,res,next)
    {
        var idx = req.body.idx;
        var name = req.body.name;
        var title = req.body.title;
        var content = req.body.content;
        var passwd = req.body.passwd;
        var datas = [name,title,content,idx,passwd];

        var sql = "update board set name =?, title=?,content=? where idx=? and passwd=?";
        conn.query(sql,datas,function(err,result)
        {
            if(err) console.error(err);
            if(result.affectedRows == 0)
            {
                res.send("<script>alert('패스워드가 일치하지 않습니다.');history.back();</script>");

            }
            else
            {
                res.redirect('/board/read/'+ idx);
            }
        });
    });

    //페이지 
    router.get('/page/:page',function(req,res,next)
    {
        var page = req.params.page;
        var sql = "select idx,name,title,content,date_format(regdate,'%Y-%m-%d %H:%i:%s') regdate from board";
        conn.query(sql,function(err,rows){
            if(err) console.error("err:" + err);
            res.render('page',{title:'자유 게시판',rows:rows, page:page,length:rows.length-1,
        page_num:10});
            console.log(rows.length-1);
        });
    });

    //게시판 삭제 delete
    router.post('/delete',function(req,res,next)
    {
        var idx = req.body.idx;
        var passwd = req.body.passwd;
        var datas = [idx,passwd];

        var sql = "delete from board where idx=? and passwd=?";
        conn.query(sql,datas,function(err,result)
        {
            if(err) console.error(err);
            if(result.affectedRows ==0)
            {
                res.send("<script>alert('패스워드가 일치하지 않습니다.');history.back();</script>");
            }
            else
            {
                res.redirect('/board/page/1');
            }
        });
    });