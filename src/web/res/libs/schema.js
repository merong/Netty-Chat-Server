// automatically generated by the FlatBuffers compiler, do not modify

/**
 * @const
 * @namespace
 */
var Schema = Schema || {};

/**
 * @enum
 */
Schema.Data = {
  NONE: 0,
  Chat: 1,
  Credentials: 2,
  Auth: 3,
  List: 4
};

/**
 * @constructor
 */
Schema.Chat = function() {
  /**
   * @type {flatbuffers.ByteBuffer}
   */
  this.bb = null;

  /**
   * @type {number}
   */
  this.bb_pos = 0;
};

/**
 * @param {number} i
 * @param {flatbuffers.ByteBuffer} bb
 * @returns {Schema.Chat}
 */
Schema.Chat.prototype.__init = function(i, bb) {
  this.bb_pos = i;
  this.bb = bb;
  return this;
};

/**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {Schema.Chat=} obj
 * @returns {Schema.Chat}
 */
Schema.Chat.getRootAsChat = function(bb, obj) {
  return (obj || new Schema.Chat).__init(bb.readInt32(bb.position()) + bb.position(), bb);
};

/**
 * @returns {flatbuffers.Long}
 */
Schema.Chat.prototype.timestamp = function() {
  var offset = this.bb.__offset(this.bb_pos, 4);
  return offset ? this.bb.readUint64(this.bb_pos + offset) : this.bb.createLong(0, 0);
};

/**
 * @param {flatbuffers.Encoding=} optionalEncoding
 * @returns {string|Uint8Array|null}
 */
Schema.Chat.prototype.author = function(optionalEncoding) {
  var offset = this.bb.__offset(this.bb_pos, 6);
  return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
};

/**
 * @param {flatbuffers.Encoding=} optionalEncoding
 * @returns {string|Uint8Array|null}
 */
Schema.Chat.prototype.message = function(optionalEncoding) {
  var offset = this.bb.__offset(this.bb_pos, 8);
  return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
};

/**
 * @param {flatbuffers.Builder} builder
 */
Schema.Chat.startChat = function(builder) {
  builder.startObject(3);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Long} timestamp
 */
Schema.Chat.addTimestamp = function(builder, timestamp) {
  builder.addFieldInt64(0, timestamp, builder.createLong(0, 0));
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} authorOffset
 */
Schema.Chat.addAuthor = function(builder, authorOffset) {
  builder.addFieldOffset(1, authorOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} messageOffset
 */
Schema.Chat.addMessage = function(builder, messageOffset) {
  builder.addFieldOffset(2, messageOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
Schema.Chat.endChat = function(builder) {
  var offset = builder.endObject();
  builder.requiredField(offset, 6); // author
  builder.requiredField(offset, 8); // message
  return offset;
};

/**
 * @constructor
 */
Schema.Credentials = function() {
  /**
   * @type {flatbuffers.ByteBuffer}
   */
  this.bb = null;

  /**
   * @type {number}
   */
  this.bb_pos = 0;
};

/**
 * @param {number} i
 * @param {flatbuffers.ByteBuffer} bb
 * @returns {Schema.Credentials}
 */
Schema.Credentials.prototype.__init = function(i, bb) {
  this.bb_pos = i;
  this.bb = bb;
  return this;
};

/**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {Schema.Credentials=} obj
 * @returns {Schema.Credentials}
 */
Schema.Credentials.getRootAsCredentials = function(bb, obj) {
  return (obj || new Schema.Credentials).__init(bb.readInt32(bb.position()) + bb.position(), bb);
};

/**
 * @param {flatbuffers.Encoding=} optionalEncoding
 * @returns {string|Uint8Array|null}
 */
Schema.Credentials.prototype.username = function(optionalEncoding) {
  var offset = this.bb.__offset(this.bb_pos, 4);
  return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
};

/**
 * @param {flatbuffers.Encoding=} optionalEncoding
 * @returns {string|Uint8Array|null}
 */
Schema.Credentials.prototype.password = function(optionalEncoding) {
  var offset = this.bb.__offset(this.bb_pos, 6);
  return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
};

/**
 * @param {flatbuffers.Builder} builder
 */
Schema.Credentials.startCredentials = function(builder) {
  builder.startObject(2);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} usernameOffset
 */
Schema.Credentials.addUsername = function(builder, usernameOffset) {
  builder.addFieldOffset(0, usernameOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} passwordOffset
 */
Schema.Credentials.addPassword = function(builder, passwordOffset) {
  builder.addFieldOffset(1, passwordOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
Schema.Credentials.endCredentials = function(builder) {
  var offset = builder.endObject();
  builder.requiredField(offset, 4); // username
  builder.requiredField(offset, 6); // password
  return offset;
};

/**
 * @constructor
 */
Schema.Auth = function() {
  /**
   * @type {flatbuffers.ByteBuffer}
   */
  this.bb = null;

  /**
   * @type {number}
   */
  this.bb_pos = 0;
};

/**
 * @param {number} i
 * @param {flatbuffers.ByteBuffer} bb
 * @returns {Schema.Auth}
 */
Schema.Auth.prototype.__init = function(i, bb) {
  this.bb_pos = i;
  this.bb = bb;
  return this;
};

/**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {Schema.Auth=} obj
 * @returns {Schema.Auth}
 */
Schema.Auth.getRootAsAuth = function(bb, obj) {
  return (obj || new Schema.Auth).__init(bb.readInt32(bb.position()) + bb.position(), bb);
};

/**
 * @returns {boolean}
 */
Schema.Auth.prototype.verified = function() {
  var offset = this.bb.__offset(this.bb_pos, 4);
  return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
};

/**
 * @param {flatbuffers.Encoding=} optionalEncoding
 * @returns {string|Uint8Array|null}
 */
Schema.Auth.prototype.ticket = function(optionalEncoding) {
  var offset = this.bb.__offset(this.bb_pos, 6);
  return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
};

/**
 * @param {flatbuffers.Builder} builder
 */
Schema.Auth.startAuth = function(builder) {
  builder.startObject(2);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {boolean} verified
 */
Schema.Auth.addVerified = function(builder, verified) {
  builder.addFieldInt8(0, +verified, +false);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} ticketOffset
 */
Schema.Auth.addTicket = function(builder, ticketOffset) {
  builder.addFieldOffset(1, ticketOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
Schema.Auth.endAuth = function(builder) {
  var offset = builder.endObject();
  return offset;
};

/**
 * @constructor
 */
Schema.List = function() {
  /**
   * @type {flatbuffers.ByteBuffer}
   */
  this.bb = null;

  /**
   * @type {number}
   */
  this.bb_pos = 0;
};

/**
 * @param {number} i
 * @param {flatbuffers.ByteBuffer} bb
 * @returns {Schema.List}
 */
Schema.List.prototype.__init = function(i, bb) {
  this.bb_pos = i;
  this.bb = bb;
  return this;
};

/**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {Schema.List=} obj
 * @returns {Schema.List}
 */
Schema.List.getRootAsList = function(bb, obj) {
  return (obj || new Schema.List).__init(bb.readInt32(bb.position()) + bb.position(), bb);
};

/**
 * @param {flatbuffers.Encoding=} optionalEncoding
 * @returns {string|Uint8Array|null}
 */
Schema.List.prototype.type = function(optionalEncoding) {
  var offset = this.bb.__offset(this.bb_pos, 4);
  return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
};

/**
 * @param {number} index
 * @param {flatbuffers.Encoding=} optionalEncoding
 * @returns {string|Uint8Array}
 */
Schema.List.prototype.contents = function(index, optionalEncoding) {
  var offset = this.bb.__offset(this.bb_pos, 6);
  return offset ? this.bb.__string(this.bb.__vector(this.bb_pos + offset) + index * 4, optionalEncoding) : null;
};

/**
 * @returns {number}
 */
Schema.List.prototype.contentsLength = function() {
  var offset = this.bb.__offset(this.bb_pos, 6);
  return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
};

/**
 * @param {flatbuffers.Builder} builder
 */
Schema.List.startList = function(builder) {
  builder.startObject(2);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} typeOffset
 */
Schema.List.addType = function(builder, typeOffset) {
  builder.addFieldOffset(0, typeOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} contentsOffset
 */
Schema.List.addContents = function(builder, contentsOffset) {
  builder.addFieldOffset(1, contentsOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {Array.<flatbuffers.Offset>} data
 * @returns {flatbuffers.Offset}
 */
Schema.List.createContentsVector = function(builder, data) {
  builder.startVector(4, data.length, 4);
  for (var i = data.length - 1; i >= 0; i--) {
    builder.addOffset(data[i]);
  }
  return builder.endVector();
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} numElems
 */
Schema.List.startContentsVector = function(builder, numElems) {
  builder.startVector(4, numElems, 4);
};

/**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
Schema.List.endList = function(builder) {
  var offset = builder.endObject();
  builder.requiredField(offset, 4); // type
  return offset;
};

/**
 * @constructor
 */
Schema.Message = function() {
  /**
   * @type {flatbuffers.ByteBuffer}
   */
  this.bb = null;

  /**
   * @type {number}
   */
  this.bb_pos = 0;
};

/**
 * @param {number} i
 * @param {flatbuffers.ByteBuffer} bb
 * @returns {Schema.Message}
 */
Schema.Message.prototype.__init = function(i, bb) {
  this.bb_pos = i;
  this.bb = bb;
  return this;
};

/**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {Schema.Message=} obj
 * @returns {Schema.Message}
 */
Schema.Message.getRootAsMessage = function(bb, obj) {
  return (obj || new Schema.Message).__init(bb.readInt32(bb.position()) + bb.position(), bb);
};

/**
 * @returns {Schema.Data}
 */
Schema.Message.prototype.dataType = function() {
  var offset = this.bb.__offset(this.bb_pos, 4);
  return offset ? /** @type {Schema.Data} */ (this.bb.readUint8(this.bb_pos + offset)) : Schema.Data.NONE;
};

/**
 * @param {flatbuffers.Table} obj
 * @returns {?flatbuffers.Table}
 */
Schema.Message.prototype.data = function(obj) {
  var offset = this.bb.__offset(this.bb_pos, 6);
  return offset ? this.bb.__union(obj, this.bb_pos + offset) : null;
};

/**
 * @param {flatbuffers.Builder} builder
 */
Schema.Message.startMessage = function(builder) {
  builder.startObject(2);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {Schema.Data} dataType
 */
Schema.Message.addDataType = function(builder, dataType) {
  builder.addFieldInt8(0, dataType, Schema.Data.NONE);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} dataOffset
 */
Schema.Message.addData = function(builder, dataOffset) {
  builder.addFieldOffset(1, dataOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
Schema.Message.endMessage = function(builder) {
  var offset = builder.endObject();
  return offset;
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} offset
 */
Schema.Message.finishMessageBuffer = function(builder, offset) {
  builder.finish(offset);
};

// Exports for Node.js and RequireJS
this.Schema = Schema;
