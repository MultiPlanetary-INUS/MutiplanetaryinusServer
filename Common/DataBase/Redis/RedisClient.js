const redis = require('redis')
var LogSystem = require('../../LogSystem.js').LogSystem
var CallBackFunc = require('../../CallBackFunc.js').CallBackFunc
var EventCenter = require('../../EventCenter.js').GetInstance()


class RedisClient {
    constructor(host, port, LogFile, bool, LogPath, LogFix, Print) {
        this.BLog = bool

        if (this.BLog) {
            this.LogService = new LogSystem(LogFile)
            this.LogService.SetLogAndPrint(Print)
            this.LogService.SetLogPath(LogPath)
            this.LogService.SetLogFix(LogFix)
        }
        else {
            delete this.LogService
            this.LogService = null
        }

        var funcLog = new CallBackFunc(this, "Log")

        this.redisClient = redis.createClient({
            url: `redis://${host}:${port}`,
            legacyMode: true
        })

        // Configure redis listening events
        this.redisClient.on('ready', function () {
            funcLog.Execute('Redis Client: ready')
        })

        // Connect to redis-server callback event
        this.redisClient.on('connect', function () {
            funcLog.Execute('redis is now connected!')
        })

        this.redisClient.on('reconnecting', function () {
            funcLog.Execute('redis reconnecting', arguments)
        })

        this.redisClient.on('end', function () {
            funcLog.Execute('Redis Closed!')
        })

        this.redisClient.on('warning', function () {
            funcLog.Execute('Redis client: warning', arguments)
        })

        this.redisClient.on('error', err => {
            funcLog.Execute('Redis Error ' + err)
        })

        // Determine whether redis is connected
        if (this.redisClient.isOpen) {
            funcLog.Execute('rredis is now connected!')
        }
        else {
            this.redisClient.connect().catch(error => console.log(error))
        }
    }

    Log () {
        if (this.BLog && Verify(this.LogService)) {
            var Content = ""
            var l = arguments.length
            for (var i = 0; i < l; ++i) {
                if (i > 0) {
                    Content += "\t"
                }
                if (IsString(arguments[i])) {
                    Content += arguments[i]
                }
                else {
                    Content += JSON.stringify(arguments[i])
                }
            }
            this.LogService.Log(Content)
        }
    };

    async contect () {
        await this.redisClient.connect().catch(error => console.log(error))
    }

    quit () {
        this.redisClient.quit()
    }

    async exists (key) {
        var funcLog = new CallBackFunc(this, "Log")
        return new Promise((resolve, reject) => {
            this.redisClient.exists(key, (err, result) => {
                if (err) {
                    funcLog.Execute(err)
                    reject(false)
                }
                resolve(result)
            })
        })
    }

    async set (key, value, exprires) {
        if (typeof value === 'object') {
            value = JSON.stringify(value)
        }
        return new Promise((resolve, reject) => {
            this.redisClient.set(key, value, (err, result) => {
                if (err) {
                    reject(false)
                }
                if (!isNaN(exprires)) {
                    this.redisClient.expire(key, exprires)
                }
                resolve(result)
            })
        })
    }

    async get (key) {
        return new Promise((resolve, reject) => {
            this.redisClient.get(key, (err, result) => {
                if (err) {
                    reject(false)
                }
                resolve(result)
            })
        })
    }

    async remove (key) {
        return new Promise((resolve, reject) => {
            this.redisClient.del(key, (err, result) => {
                if (err) {
                    reject(false)
                }
                resolve(result)
            })
        })
    }

    // push Push the given value to the right end of the list Return value The current list length
    async rPush (key, list, exprires) {
        return new Promise((resolve, reject) => {
            this.redisClient.rPush(key, list, (err, length) => {
                if (err) {
                    reject(false)
                }
                if (!isNaN(exprires)) {
                    this.redisClient.exports(key, exprires)
                }
                resolve(length)
            })
        })
    }

    // Query the value of list
    async lrange (key, startIndex = 0, stopIndex = -1) {
        return new Promise((resolve, reject) => {
            this.redisClient.lRange(key, startIndex, stopIndex, (err, result) => {
                if (err) {
                    reject(false)
                }
                resolve(result)
            })
        })
    }

    // Clear n items with value in the list
    async lrem (key, n = 1, value) {
        return new Promise((resolve, reject) => {
            this.redisClient.lrem(key, n, value, (err, result) => {
                if (err) {
                    return false
                }
                resolve(result)
            })
        })
    }
}

exports.RedisClient = RedisClient;
