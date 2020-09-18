const fs = require('fs');
const path = require('path');

const jshref = (strings, key) => {
	console.log(strings);
	return `<a href='javascript:(function(){${key}}());'>${strings[0]}</a>`;
}
let cnt = fs.readFileSync(path.resolve(__dirname, '../public/build/bundle.cjs.js'), 'utf-8');
let link = jshref`floaty bookmark ${cnt.replace(/module.exports=.*?;/, '').replace(/'/g, '&#039')}`;
fs.writeFileSync(path.resolve(__dirname, '../public/build/bookmarklet.html'), link);