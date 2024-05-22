require('./Common/Util/Util')

var s = GetDateTimeFromLong(20221119215000);

var d = new Date();

console.log(GetDateStringByDate(d, '-'))

console.log(s.year +">>>>>"+ d.getFullYear());
console.log(s.month +">>>>>"+ d.getMonth());
console.log(s.day +">>>>>"+ d.getDate());
console.log(s.hours +">>>>>"+ d.getHours());
console.log(s.minutes +">>>>>"+ d.getMinutes());
console.log(s.seconds +">>>>>"+ d.getSeconds());
