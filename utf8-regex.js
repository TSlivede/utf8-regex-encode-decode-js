/**
 * Encodes multi-byte Unicode string into utf-8 multiple single-byte characters
 *
 * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars, U+10000 - U+10FFFF in 4 chars.
 *
 * Can be achieved in JavaScript by unescape(encodeURIComponent(str)),
 * but this approach may be useful in other languages.
 *
 * @param {string} strUni Unicode string to be encoded as UTF-8.
 * @returns {string} Encoded string.
 */
function Utf8Encode(strUni) {
	return String(strUni).replace(
		/[\u0080-\u07ff]/g,  // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
		function (c) {
			var cc = c.charCodeAt(0);
			return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
		}
	).replace(
		/[\ud800-\udbff][\udc00-\udfff]/g,  // surrogate pair
		function (c) {
			var high = c.charCodeAt(0);
			var low = c.charCodeAt(1);
			var cc = ((high & 0x03ff) << 10 | (low & 0x03ff)) + 0x10000;
			// U+10000 - U+10FFFF => 4 bytes 11110www 10xxxxxx, 10yyyyyy, 10zzzzzz
			return String.fromCharCode(0xf0 | cc >> 18, 0x80 | cc >> 12 & 0x3f, 0x80 | cc >> 6 & 0x3f, 0x80 | cc & 0x3f);
		}
	).replace(
		/[\u0800-\uffff]/g,  // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
		function (c) {
			var cc = c.charCodeAt(0);
			return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3f, 0x80 | cc & 0x3f);
		}
	);
}

/**
 * Decodes utf-8 encoded string back into multi-byte Unicode characters.
 *
 * Can be achieved JavaScript by decodeURIComponent(escape(str)),
 * but this approach may be useful in other languages.
 *
 * @param {string} strUtf UTF-8 string to be decoded back to Unicode.
 * @returns {string} Decoded string.
 */
function Utf8Decode(strUtf) {
	// note: decode 2-byte chars last as decoded 2-byte strings could appear to be 3-byte or 4-byte char!
	return String(strUtf).replace(
		/[\u00f0-\u00f7][\u0080-\u00bf][\u0080-\u00bf][\u0080-\u00bf]/g,  // 4-byte chars
		function (c) {  // (note parentheses for precedence)
			var cc = ((c.charCodeAt(0) & 0x07) << 18) | ((c.charCodeAt(1) & 0x3f) << 12) | ((c.charCodeAt(2) & 0x3f) << 6) | ( c.charCodeAt(3) & 0x3f);
			var tmp = cc - 0x10000;
			// TODO: throw error(invalid utf8) if tmp > 0xfffff
			return String.fromCharCode(0xd800 + (tmp >> 10), 0xdc00 + (tmp & 0x3ff)); // surrogate pair
		}
	).replace(
		/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,  // 3-byte chars
		function (c) {  // (note parentheses for precedence)
			var cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | ( c.charCodeAt(2) & 0x3f);
			return String.fromCharCode(cc);
		}
	).replace(
		/[\u00c0-\u00df][\u0080-\u00bf]/g,                 // 2-byte chars
		function (c) {  // (note parentheses for precedence)
			var cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f;
			return String.fromCharCode(cc);
		}
	);
}
