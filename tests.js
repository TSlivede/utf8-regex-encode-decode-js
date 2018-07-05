//test_string="Emoji 😎";

function getRandomString(){
	var out="";
	for (var i=0; i<100; i++){
		try{
			var c = String.fromCodePoint(
				Math.round(
					Math.random()*[0x10ffff,0xffff,0x7ff,0x7f][Math.round(Math.random()*3)]
				)
			);
			encodeURIComponent(c); //check if valid UTF-16 (fromCodePoint doesn't throw on unmached surrogate...)
			out += c;
		}catch{}
	}
	return out;
}

function assert(condition, message) {
	if (!condition) {
		message = message || "Assertion failed";
		if (typeof Error !== "undefined") {
			throw new Error(message);
		}
		throw message; // Fallback
	}
}

for (var i=0; i<10000; i++){
	test_string=getRandomString();
	assert(Utf8Decode(unescape(encodeURIComponent(test_string)))===test_string,'Utf8Decode failed');
	assert(decodeURIComponent(escape(Utf8Encode(test_string)))===test_string,'Utf8Encode failed');
	assert(Utf8Encode(test_string)===unescape(encodeURIComponent(test_string)),'Utf8Encode failed');
}
