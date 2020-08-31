
module.exports = {
	server_port: 3000,
	db_url: 'mongodb://localhost:27017/local',
	db_schemas: [
		{file:'./user_schema', collection:'users6', schemaName:'UserSchema', modelName:'UserModel'},
		{file:'./roomCreate_schema', collection:'bookList', schemaName:'CreateRoomSchema', modelName:'CreateRoomModel'},
		{file:'./reply_schema', collection:'reply', schemaName:'ReplySchema', modelName:'ReplyModel'},
		{file:'./bookmark_schema', collection:'bookmark', schemaName:'BookmarkSchema', modelName:'BookmarkModel'}
	],
	route_info: [
	],
}