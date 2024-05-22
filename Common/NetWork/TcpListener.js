var net = require('net');
var CallBackFunc = require('../CallBackFunc.js').CallBackFunc;
var TcpSessionManager = require('./TcpSessionManager.js').GetInstance();
var TcpClient = require('./TcpClient.js').TcpClient;
var EventCenter = require('../EventCenter.js').GetInstance();

function TcpListener(){
	this.TcpServer = null;
	this.LogSystem = null;
}

TcpListener.prototype.StartListen = function(ip, port){
	this.TcpServer = net.createServer();

	this.TcpServer.listen(port, ip);
	
	if(Verify(this.LogSystem)){
		this.LogSystem.Log("Server Listening on " + ip + ":" + port);
	}
	
	var OnConnection = new CallBackFunc(this, "OnConnection");
	var OnReceiveData = new CallBackFunc(this, "OnReceiveData");
	var OnDisConnect = new CallBackFunc(this, "OnDisConnect");
	
	this.TcpServer.on('connection', function(sock) {
		OnConnection.Execute(sock);
		
		sock.on('data', function(data){
			OnReceiveData.Execute(sock, data);
	    });

	    sock.on('close', function(data) {
	    	OnDisConnect.Execute(sock, data);
	    });    
	});	    
};

TcpListener.prototype.OnConnection = function(sock){
	var tc = new TcpClient();
	tc.SetClient(sock);
	tc.SetIsListener(true);
	tc.IP = sock.remoteAddress;
	tc.Port = sock.remotePort;
	tc.SetID(sock.remoteAddress + ':' + sock.remotePort);
	TcpSessionManager.Add(tc.GetID(), tc);
	tc.OnConnect();	
	if(Verify(this.LogSystem)){
		tc.SetLogSystem(this.LogSystem);
		this.LogSystem.Log('NewConnection: ' + tc.GetID());
	}
	EventCenter.RaiseEvent("NewTCPConnection", tc);
};

TcpListener.prototype.OnReceiveData = function(sock, data){
	var tc = TcpSessionManager.Find(sock._peername.address + ':' + sock._peername.port);
	if(Verify(tc)){
		tc.OnReceiveData(data);
	}
};

TcpListener.prototype.OnDisConnect = function(sock, data){
	var tc = TcpSessionManager.Find(sock._peername.address + ':' + sock._peername.port);
	if(Verify(tc)){
		tc.OnClose(data);
		EventCenter.RaiseEvent("DisTCPConnection", tc);
		TcpSessionManager.Remove(tc.GetID());
	}
};

TcpListener.prototype.Close = function(){
	TcpSessionManager.Clear();
	this.TcpServer.close();
};

TcpListener.prototype.SetLogSystem = function(log){
	if(Verify(log)){
		this.LogSystem = log;
	}
};

exports.TcpListener = TcpListener;
