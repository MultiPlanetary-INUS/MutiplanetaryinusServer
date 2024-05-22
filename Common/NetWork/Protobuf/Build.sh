protoc --js_out=import_style=commonjs:.  MessageID.proto
protoc --js_out=import_style=commonjs:.  ServerPKG.proto
protoc --js_out=import_style=commonjs:.  LoginPKG.proto
protoc --js_out=import_style=commonjs:.  RolePKG.proto
protoc --js_out=import_style=commonjs:.  GameMap.proto
protoc --js_out=import_style=commonjs:.  ChatPKG.proto
protoc --js_out=import_style=commonjs:.  Item.proto
protoc --js_out=import_style=commonjs:.  Relation.proto
protoc --js_out=import_style=commonjs:.  QuestPKG.proto

protoc --csharp_out=. MessageID.proto
protoc --csharp_out=. LoginPKG.proto
protoc --csharp_out=. RolePKG.proto
protoc --csharp_out=. GameMap.proto
protoc --csharp_out=. ChatPKG.proto
protoc --csharp_out=. Item.proto
protoc --csharp_out=. Relation.proto
protoc --csharp_out=. QuestPKG.proto