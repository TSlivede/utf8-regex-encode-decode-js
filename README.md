# utf8-regex-encode-decode-js
Utf8 string encode/decode using regular expressions

Code is based on https://gist.github.com/MarcelloDiSimone/933a13c6a5b6458ce29d972644bb5892

Can encode javascript Unicode string into utf-8 multiple single-byte characters.
The same can be achieved in JavaScript by `unescape(encodeURIComponent(str))`, but this approach may be useful in other languages.

Can decode utf-8 encoded string back into a regular javascript string.
The same can be achieved JavaScript by `decodeURIComponent(escape(str))`, but this approach may be useful in other languages.
