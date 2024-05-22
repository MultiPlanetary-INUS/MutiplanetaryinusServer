/**
 * @fileoverview
 * @enhanceable
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

var MessageID_pb = require('./MessageID_pb.js');
goog.exportSymbol('proto.ServerPKG.PlayerDisconnection', null, global);
goog.exportSymbol('proto.ServerPKG.RegServerResult', null, global);
goog.exportSymbol('proto.ServerPKG.RegServerType', null, global);
goog.exportSymbol('proto.ServerPKG.ServerHeart', null, global);
goog.exportSymbol('proto.ServerPKG.ServerRoleAttrChange', null, global);

/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.ServerPKG.ServerHeart = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.ServerPKG.ServerHeart, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.ServerPKG.ServerHeart.displayName = 'proto.ServerPKG.ServerHeart';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.ServerPKG.ServerHeart.prototype.toObject = function(opt_includeInstance) {
  return proto.ServerPKG.ServerHeart.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.ServerPKG.ServerHeart} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ServerPKG.ServerHeart.toObject = function(includeInstance, msg) {
  var f, obj = {
    pkgid: jspb.Message.getFieldWithDefault(msg, 1, 0),
    senderid: jspb.Message.getFieldWithDefault(msg, 2, ""),
    sendtime: jspb.Message.getFieldWithDefault(msg, 3, 0),
    delaytime: jspb.Message.getFieldWithDefault(msg, 4, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.ServerPKG.ServerHeart}
 */
proto.ServerPKG.ServerHeart.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.ServerPKG.ServerHeart;
  return proto.ServerPKG.ServerHeart.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.ServerPKG.ServerHeart} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.ServerPKG.ServerHeart}
 */
proto.ServerPKG.ServerHeart.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.PKGTypeID} */ (reader.readEnum());
      msg.setPkgid(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setSenderid(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setSendtime(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setDelaytime(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.ServerPKG.ServerHeart.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.ServerPKG.ServerHeart.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.ServerPKG.ServerHeart} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ServerPKG.ServerHeart.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPkgid();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getSenderid();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getSendtime();
  if (f !== 0) {
    writer.writeInt64(
      3,
      f
    );
  }
  f = message.getDelaytime();
  if (f !== 0) {
    writer.writeInt32(
      4,
      f
    );
  }
};


/**
 * optional PKGTypeID PkgID = 1;
 * @return {!proto.PKGTypeID}
 */
proto.ServerPKG.ServerHeart.prototype.getPkgid = function() {
  return /** @type {!proto.PKGTypeID} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {!proto.PKGTypeID} value */
proto.ServerPKG.ServerHeart.prototype.setPkgid = function(value) {
  jspb.Message.setProto3EnumField(this, 1, value);
};


/**
 * optional string SenderID = 2;
 * @return {string}
 */
proto.ServerPKG.ServerHeart.prototype.getSenderid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.ServerPKG.ServerHeart.prototype.setSenderid = function(value) {
  jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional int64 SendTime = 3;
 * @return {number}
 */
proto.ServerPKG.ServerHeart.prototype.getSendtime = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/** @param {number} value */
proto.ServerPKG.ServerHeart.prototype.setSendtime = function(value) {
  jspb.Message.setProto3IntField(this, 3, value);
};


/**
 * optional int32 DelayTime = 4;
 * @return {number}
 */
proto.ServerPKG.ServerHeart.prototype.getDelaytime = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/** @param {number} value */
proto.ServerPKG.ServerHeart.prototype.setDelaytime = function(value) {
  jspb.Message.setProto3IntField(this, 4, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.ServerPKG.RegServerType = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.ServerPKG.RegServerType.repeatedFields_, null);
};
goog.inherits(proto.ServerPKG.RegServerType, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.ServerPKG.RegServerType.displayName = 'proto.ServerPKG.RegServerType';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.ServerPKG.RegServerType.repeatedFields_ = [8];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.ServerPKG.RegServerType.prototype.toObject = function(opt_includeInstance) {
  return proto.ServerPKG.RegServerType.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.ServerPKG.RegServerType} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ServerPKG.RegServerType.toObject = function(includeInstance, msg) {
  var f, obj = {
    pkgid: jspb.Message.getFieldWithDefault(msg, 1, 0),
    senderid: jspb.Message.getFieldWithDefault(msg, 2, ""),
    ip: jspb.Message.getFieldWithDefault(msg, 3, ""),
    port: jspb.Message.getFieldWithDefault(msg, 4, 0),
    servertype: jspb.Message.getFieldWithDefault(msg, 5, 0),
    curuser: jspb.Message.getFieldWithDefault(msg, 6, 0),
    maxuser: jspb.Message.getFieldWithDefault(msg, 7, 0),
    modulelistList: jspb.Message.getRepeatedField(msg, 8)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.ServerPKG.RegServerType}
 */
proto.ServerPKG.RegServerType.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.ServerPKG.RegServerType;
  return proto.ServerPKG.RegServerType.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.ServerPKG.RegServerType} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.ServerPKG.RegServerType}
 */
proto.ServerPKG.RegServerType.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.PKGTypeID} */ (reader.readEnum());
      msg.setPkgid(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setSenderid(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setIp(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setPort(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setServertype(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setCuruser(value);
      break;
    case 7:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setMaxuser(value);
      break;
    case 8:
      var value = /** @type {!Array<number>} */ (reader.readPackedInt32());
      msg.setModulelistList(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.ServerPKG.RegServerType.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.ServerPKG.RegServerType.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.ServerPKG.RegServerType} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ServerPKG.RegServerType.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPkgid();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getSenderid();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getIp();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getPort();
  if (f !== 0) {
    writer.writeInt32(
      4,
      f
    );
  }
  f = message.getServertype();
  if (f !== 0) {
    writer.writeInt32(
      5,
      f
    );
  }
  f = message.getCuruser();
  if (f !== 0) {
    writer.writeInt32(
      6,
      f
    );
  }
  f = message.getMaxuser();
  if (f !== 0) {
    writer.writeInt32(
      7,
      f
    );
  }
  f = message.getModulelistList();
  if (f.length > 0) {
    writer.writePackedInt32(
      8,
      f
    );
  }
};


/**
 * optional PKGTypeID PkgID = 1;
 * @return {!proto.PKGTypeID}
 */
proto.ServerPKG.RegServerType.prototype.getPkgid = function() {
  return /** @type {!proto.PKGTypeID} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {!proto.PKGTypeID} value */
proto.ServerPKG.RegServerType.prototype.setPkgid = function(value) {
  jspb.Message.setProto3EnumField(this, 1, value);
};


/**
 * optional string SenderID = 2;
 * @return {string}
 */
proto.ServerPKG.RegServerType.prototype.getSenderid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.ServerPKG.RegServerType.prototype.setSenderid = function(value) {
  jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string IP = 3;
 * @return {string}
 */
proto.ServerPKG.RegServerType.prototype.getIp = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.ServerPKG.RegServerType.prototype.setIp = function(value) {
  jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional int32 Port = 4;
 * @return {number}
 */
proto.ServerPKG.RegServerType.prototype.getPort = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/** @param {number} value */
proto.ServerPKG.RegServerType.prototype.setPort = function(value) {
  jspb.Message.setProto3IntField(this, 4, value);
};


/**
 * optional int32 ServerType = 5;
 * @return {number}
 */
proto.ServerPKG.RegServerType.prototype.getServertype = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/** @param {number} value */
proto.ServerPKG.RegServerType.prototype.setServertype = function(value) {
  jspb.Message.setProto3IntField(this, 5, value);
};


/**
 * optional int32 CurUser = 6;
 * @return {number}
 */
proto.ServerPKG.RegServerType.prototype.getCuruser = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 6, 0));
};


/** @param {number} value */
proto.ServerPKG.RegServerType.prototype.setCuruser = function(value) {
  jspb.Message.setProto3IntField(this, 6, value);
};


/**
 * optional int32 MaxUser = 7;
 * @return {number}
 */
proto.ServerPKG.RegServerType.prototype.getMaxuser = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 7, 0));
};


/** @param {number} value */
proto.ServerPKG.RegServerType.prototype.setMaxuser = function(value) {
  jspb.Message.setProto3IntField(this, 7, value);
};


/**
 * repeated int32 ModuleList = 8;
 * @return {!Array<number>}
 */
proto.ServerPKG.RegServerType.prototype.getModulelistList = function() {
  return /** @type {!Array<number>} */ (jspb.Message.getRepeatedField(this, 8));
};


/** @param {!Array<number>} value */
proto.ServerPKG.RegServerType.prototype.setModulelistList = function(value) {
  jspb.Message.setField(this, 8, value || []);
};


/**
 * @param {!number} value
 * @param {number=} opt_index
 */
proto.ServerPKG.RegServerType.prototype.addModulelist = function(value, opt_index) {
  jspb.Message.addToRepeatedField(this, 8, value, opt_index);
};


proto.ServerPKG.RegServerType.prototype.clearModulelistList = function() {
  this.setModulelistList([]);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.ServerPKG.RegServerResult = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.ServerPKG.RegServerResult.repeatedFields_, null);
};
goog.inherits(proto.ServerPKG.RegServerResult, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.ServerPKG.RegServerResult.displayName = 'proto.ServerPKG.RegServerResult';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.ServerPKG.RegServerResult.repeatedFields_ = [3];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.ServerPKG.RegServerResult.prototype.toObject = function(opt_includeInstance) {
  return proto.ServerPKG.RegServerResult.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.ServerPKG.RegServerResult} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ServerPKG.RegServerResult.toObject = function(includeInstance, msg) {
  var f, obj = {
    pkgid: jspb.Message.getFieldWithDefault(msg, 1, 0),
    senderid: jspb.Message.getFieldWithDefault(msg, 2, ""),
    serverlistList: jspb.Message.toObjectList(msg.getServerlistList(),
    proto.ServerPKG.RegServerType.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.ServerPKG.RegServerResult}
 */
proto.ServerPKG.RegServerResult.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.ServerPKG.RegServerResult;
  return proto.ServerPKG.RegServerResult.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.ServerPKG.RegServerResult} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.ServerPKG.RegServerResult}
 */
proto.ServerPKG.RegServerResult.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.PKGTypeID} */ (reader.readEnum());
      msg.setPkgid(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setSenderid(value);
      break;
    case 3:
      var value = new proto.ServerPKG.RegServerType;
      reader.readMessage(value,proto.ServerPKG.RegServerType.deserializeBinaryFromReader);
      msg.addServerlist(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.ServerPKG.RegServerResult.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.ServerPKG.RegServerResult.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.ServerPKG.RegServerResult} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ServerPKG.RegServerResult.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPkgid();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getSenderid();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getServerlistList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      3,
      f,
      proto.ServerPKG.RegServerType.serializeBinaryToWriter
    );
  }
};


/**
 * optional PKGTypeID PkgID = 1;
 * @return {!proto.PKGTypeID}
 */
proto.ServerPKG.RegServerResult.prototype.getPkgid = function() {
  return /** @type {!proto.PKGTypeID} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {!proto.PKGTypeID} value */
proto.ServerPKG.RegServerResult.prototype.setPkgid = function(value) {
  jspb.Message.setProto3EnumField(this, 1, value);
};


/**
 * optional string SenderID = 2;
 * @return {string}
 */
proto.ServerPKG.RegServerResult.prototype.getSenderid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.ServerPKG.RegServerResult.prototype.setSenderid = function(value) {
  jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * repeated RegServerType ServerList = 3;
 * @return {!Array<!proto.ServerPKG.RegServerType>}
 */
proto.ServerPKG.RegServerResult.prototype.getServerlistList = function() {
  return /** @type{!Array<!proto.ServerPKG.RegServerType>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.ServerPKG.RegServerType, 3));
};


/** @param {!Array<!proto.ServerPKG.RegServerType>} value */
proto.ServerPKG.RegServerResult.prototype.setServerlistList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 3, value);
};


/**
 * @param {!proto.ServerPKG.RegServerType=} opt_value
 * @param {number=} opt_index
 * @return {!proto.ServerPKG.RegServerType}
 */
proto.ServerPKG.RegServerResult.prototype.addServerlist = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 3, opt_value, proto.ServerPKG.RegServerType, opt_index);
};


proto.ServerPKG.RegServerResult.prototype.clearServerlistList = function() {
  this.setServerlistList([]);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.ServerPKG.PlayerDisconnection = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.ServerPKG.PlayerDisconnection, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.ServerPKG.PlayerDisconnection.displayName = 'proto.ServerPKG.PlayerDisconnection';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.ServerPKG.PlayerDisconnection.prototype.toObject = function(opt_includeInstance) {
  return proto.ServerPKG.PlayerDisconnection.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.ServerPKG.PlayerDisconnection} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ServerPKG.PlayerDisconnection.toObject = function(includeInstance, msg) {
  var f, obj = {
    pkgid: jspb.Message.getFieldWithDefault(msg, 1, 0),
    userid: jspb.Message.getFieldWithDefault(msg, 2, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.ServerPKG.PlayerDisconnection}
 */
proto.ServerPKG.PlayerDisconnection.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.ServerPKG.PlayerDisconnection;
  return proto.ServerPKG.PlayerDisconnection.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.ServerPKG.PlayerDisconnection} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.ServerPKG.PlayerDisconnection}
 */
proto.ServerPKG.PlayerDisconnection.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.PKGTypeID} */ (reader.readEnum());
      msg.setPkgid(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setUserid(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.ServerPKG.PlayerDisconnection.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.ServerPKG.PlayerDisconnection.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.ServerPKG.PlayerDisconnection} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ServerPKG.PlayerDisconnection.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPkgid();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getUserid();
  if (f !== 0) {
    writer.writeInt64(
      2,
      f
    );
  }
};


/**
 * optional PKGTypeID PkgID = 1;
 * @return {!proto.PKGTypeID}
 */
proto.ServerPKG.PlayerDisconnection.prototype.getPkgid = function() {
  return /** @type {!proto.PKGTypeID} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {!proto.PKGTypeID} value */
proto.ServerPKG.PlayerDisconnection.prototype.setPkgid = function(value) {
  jspb.Message.setProto3EnumField(this, 1, value);
};


/**
 * optional int64 UserID = 2;
 * @return {number}
 */
proto.ServerPKG.PlayerDisconnection.prototype.getUserid = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.ServerPKG.PlayerDisconnection.prototype.setUserid = function(value) {
  jspb.Message.setProto3IntField(this, 2, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.ServerPKG.ServerRoleAttrChange = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.ServerPKG.ServerRoleAttrChange, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.ServerPKG.ServerRoleAttrChange.displayName = 'proto.ServerPKG.ServerRoleAttrChange';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.ServerPKG.ServerRoleAttrChange.prototype.toObject = function(opt_includeInstance) {
  return proto.ServerPKG.ServerRoleAttrChange.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.ServerPKG.ServerRoleAttrChange} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ServerPKG.ServerRoleAttrChange.toObject = function(includeInstance, msg) {
  var f, obj = {
    pkgid: jspb.Message.getFieldWithDefault(msg, 1, 0),
    userid: jspb.Message.getFieldWithDefault(msg, 2, 0),
    roleid: jspb.Message.getFieldWithDefault(msg, 3, 0),
    serverid: jspb.Message.getFieldWithDefault(msg, 4, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.ServerPKG.ServerRoleAttrChange}
 */
proto.ServerPKG.ServerRoleAttrChange.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.ServerPKG.ServerRoleAttrChange;
  return proto.ServerPKG.ServerRoleAttrChange.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.ServerPKG.ServerRoleAttrChange} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.ServerPKG.ServerRoleAttrChange}
 */
proto.ServerPKG.ServerRoleAttrChange.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.PKGTypeID} */ (reader.readEnum());
      msg.setPkgid(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setUserid(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setRoleid(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setServerid(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.ServerPKG.ServerRoleAttrChange.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.ServerPKG.ServerRoleAttrChange.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.ServerPKG.ServerRoleAttrChange} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ServerPKG.ServerRoleAttrChange.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPkgid();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getUserid();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
  f = message.getRoleid();
  if (f !== 0) {
    writer.writeUint64(
      3,
      f
    );
  }
  f = message.getServerid();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
};


/**
 * optional PKGTypeID PkgID = 1;
 * @return {!proto.PKGTypeID}
 */
proto.ServerPKG.ServerRoleAttrChange.prototype.getPkgid = function() {
  return /** @type {!proto.PKGTypeID} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {!proto.PKGTypeID} value */
proto.ServerPKG.ServerRoleAttrChange.prototype.setPkgid = function(value) {
  jspb.Message.setProto3EnumField(this, 1, value);
};


/**
 * optional uint64 UserID = 2;
 * @return {number}
 */
proto.ServerPKG.ServerRoleAttrChange.prototype.getUserid = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.ServerPKG.ServerRoleAttrChange.prototype.setUserid = function(value) {
  jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional uint64 RoleID = 3;
 * @return {number}
 */
proto.ServerPKG.ServerRoleAttrChange.prototype.getRoleid = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/** @param {number} value */
proto.ServerPKG.ServerRoleAttrChange.prototype.setRoleid = function(value) {
  jspb.Message.setProto3IntField(this, 3, value);
};


/**
 * optional string ServerID = 4;
 * @return {string}
 */
proto.ServerPKG.ServerRoleAttrChange.prototype.getServerid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/** @param {string} value */
proto.ServerPKG.ServerRoleAttrChange.prototype.setServerid = function(value) {
  jspb.Message.setProto3StringField(this, 4, value);
};


goog.object.extend(exports, proto.ServerPKG);
