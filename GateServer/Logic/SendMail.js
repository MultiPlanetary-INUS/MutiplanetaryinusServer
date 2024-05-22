//Send email verification code

const nodemailer = require('nodemailer')
var fs = require('fs')
var Config = require('ini').parse(fs.readFileSync('../Config/Server.ini', 'utf-8'))


let transporter = nodemailer.createTransport({
    host: Config.MailServer.SERVER,
    secure: true,
    auth: {
        user: Config.MailServer.ACCOUNT,
        pass: Config.MailServer.PASS,
    }
})


//Modify the email content here
module.exports = async function SendMailCode (email, code) {
    let status = null
    await new Promise((resolve, reject) => {
        transporter.sendMail({
            from: Config.MailServer.ACCOUNT,
            to: email,
            subject: 'Game registration verification code',
            html: `
            <p>Game registration verification code：</p>
            <span style="font-size: 18px; color: red; margin-left:150px">` + code + `</span>
            <p>Please ignore it if it is not your own operation!</p>`
        }, function (err, info) {
            if (err) {
                status = 0
                reject()
            } else {
                status = 1
                resolve()
            }
        })
    })
    return status
}