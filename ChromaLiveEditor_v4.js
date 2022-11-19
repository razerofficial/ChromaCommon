/*!

JSZip v3.3.0 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/master/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/master/LICENSE
*/

!function (t) { if ("object" == typeof exports && "undefined" != typeof module) module.exports = t(); else if ("function" == typeof define && define.amd) define([], t); else { ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).JSZip = t() } }(function () { return function s(a, o, h) { function u(r, t) { if (!o[r]) { if (!a[r]) { var e = "function" == typeof require && require; if (!t && e) return e(r, !0); if (l) return l(r, !0); var i = new Error("Cannot find module '" + r + "'"); throw i.code = "MODULE_NOT_FOUND", i } var n = o[r] = { exports: {} }; a[r][0].call(n.exports, function (t) { var e = a[r][1][t]; return u(e || t) }, n, n.exports, s, a, o, h) } return o[r].exports } for (var l = "function" == typeof require && require, t = 0; t < h.length; t++)u(h[t]); return u }({ 1: [function (t, e, r) { "use strict"; var c = t("./utils"), d = t("./support"), p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="; r.encode = function (t) { for (var e, r, i, n, s, a, o, h = [], u = 0, l = t.length, f = l, d = "string" !== c.getTypeOf(t); u < t.length;)f = l - u, i = d ? (e = t[u++], r = u < l ? t[u++] : 0, u < l ? t[u++] : 0) : (e = t.charCodeAt(u++), r = u < l ? t.charCodeAt(u++) : 0, u < l ? t.charCodeAt(u++) : 0), n = e >> 2, s = (3 & e) << 4 | r >> 4, a = 1 < f ? (15 & r) << 2 | i >> 6 : 64, o = 2 < f ? 63 & i : 64, h.push(p.charAt(n) + p.charAt(s) + p.charAt(a) + p.charAt(o)); return h.join("") }, r.decode = function (t) { var e, r, i, n, s, a, o = 0, h = 0, u = "data:"; if (t.substr(0, u.length) === u) throw new Error("Invalid base64 input, it looks like a data url."); var l, f = 3 * (t = t.replace(/[^A-Za-z0-9\+\/\=]/g, "")).length / 4; if (t.charAt(t.length - 1) === p.charAt(64) && f--, t.charAt(t.length - 2) === p.charAt(64) && f--, f % 1 != 0) throw new Error("Invalid base64 input, bad content length."); for (l = d.uint8array ? new Uint8Array(0 | f) : new Array(0 | f); o < t.length;)e = p.indexOf(t.charAt(o++)) << 2 | (n = p.indexOf(t.charAt(o++))) >> 4, r = (15 & n) << 4 | (s = p.indexOf(t.charAt(o++))) >> 2, i = (3 & s) << 6 | (a = p.indexOf(t.charAt(o++))), l[h++] = e, 64 !== s && (l[h++] = r), 64 !== a && (l[h++] = i); return l } }, { "./support": 30, "./utils": 32 }], 2: [function (t, e, r) { "use strict"; var i = t("./external"), n = t("./stream/DataWorker"), s = t("./stream/DataLengthProbe"), a = t("./stream/Crc32Probe"); s = t("./stream/DataLengthProbe"); function o(t, e, r, i, n) { this.compressedSize = t, this.uncompressedSize = e, this.crc32 = r, this.compression = i, this.compressedContent = n } o.prototype = { getContentWorker: function () { var t = new n(i.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new s("data_length")), e = this; return t.on("end", function () { if (this.streamInfo.data_length !== e.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch") }), t }, getCompressedWorker: function () { return new n(i.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression) } }, o.createWorkerFrom = function (t, e, r) { return t.pipe(new a).pipe(new s("uncompressedSize")).pipe(e.compressWorker(r)).pipe(new s("compressedSize")).withStreamInfo("compression", e) }, e.exports = o }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function (t, e, r) { "use strict"; var i = t("./stream/GenericWorker"); r.STORE = { magic: "\0\0", compressWorker: function (t) { return new i("STORE compression") }, uncompressWorker: function () { return new i("STORE decompression") } }, r.DEFLATE = t("./flate") }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function (t, e, r) { "use strict"; var i = t("./utils"); var o = function () { for (var t, e = [], r = 0; r < 256; r++) { t = r; for (var i = 0; i < 8; i++)t = 1 & t ? 3988292384 ^ t >>> 1 : t >>> 1; e[r] = t } return e }(); e.exports = function (t, e) { return void 0 !== t && t.length ? "string" !== i.getTypeOf(t) ? function (t, e, r, i) { var n = o, s = i + r; t ^= -1; for (var a = i; a < s; a++)t = t >>> 8 ^ n[255 & (t ^ e[a])]; return -1 ^ t }(0 | e, t, t.length, 0) : function (t, e, r, i) { var n = o, s = i + r; t ^= -1; for (var a = i; a < s; a++)t = t >>> 8 ^ n[255 & (t ^ e.charCodeAt(a))]; return -1 ^ t }(0 | e, t, t.length, 0) : 0 } }, { "./utils": 32 }], 5: [function (t, e, r) { "use strict"; r.base64 = !1, r.binary = !1, r.dir = !1, r.createFolders = !0, r.date = null, r.compression = null, r.compressionOptions = null, r.comment = null, r.unixPermissions = null, r.dosPermissions = null }, {}], 6: [function (t, e, r) { "use strict"; var i = null; i = "undefined" != typeof Promise ? Promise : t("lie"), e.exports = { Promise: i } }, { lie: 37 }], 7: [function (t, e, r) { "use strict"; var i = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Uint32Array, n = t("pako"), s = t("./utils"), a = t("./stream/GenericWorker"), o = i ? "uint8array" : "array"; function h(t, e) { a.call(this, "FlateWorker/" + t), this._pako = null, this._pakoAction = t, this._pakoOptions = e, this.meta = {} } r.magic = "\b\0", s.inherits(h, a), h.prototype.processChunk = function (t) { this.meta = t.meta, null === this._pako && this._createPako(), this._pako.push(s.transformTo(o, t.data), !1) }, h.prototype.flush = function () { a.prototype.flush.call(this), null === this._pako && this._createPako(), this._pako.push([], !0) }, h.prototype.cleanUp = function () { a.prototype.cleanUp.call(this), this._pako = null }, h.prototype._createPako = function () { this._pako = new n[this._pakoAction]({ raw: !0, level: this._pakoOptions.level || -1 }); var e = this; this._pako.onData = function (t) { e.push({ data: t, meta: e.meta }) } }, r.compressWorker = function (t) { return new h("Deflate", t) }, r.uncompressWorker = function () { return new h("Inflate", {}) } }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function (t, e, r) { "use strict"; function A(t, e) { var r, i = ""; for (r = 0; r < e; r++)i += String.fromCharCode(255 & t), t >>>= 8; return i } function i(t, e, r, i, n, s) { var a, o, h = t.file, u = t.compression, l = s !== O.utf8encode, f = I.transformTo("string", s(h.name)), d = I.transformTo("string", O.utf8encode(h.name)), c = h.comment, p = I.transformTo("string", s(c)), m = I.transformTo("string", O.utf8encode(c)), _ = d.length !== h.name.length, g = m.length !== c.length, b = "", v = "", y = "", w = h.dir, k = h.date, x = { crc32: 0, compressedSize: 0, uncompressedSize: 0 }; e && !r || (x.crc32 = t.crc32, x.compressedSize = t.compressedSize, x.uncompressedSize = t.uncompressedSize); var S = 0; e && (S |= 8), l || !_ && !g || (S |= 2048); var z = 0, C = 0; w && (z |= 16), "UNIX" === n ? (C = 798, z |= function (t, e) { var r = t; return t || (r = e ? 16893 : 33204), (65535 & r) << 16 }(h.unixPermissions, w)) : (C = 20, z |= function (t) { return 63 & (t || 0) }(h.dosPermissions)), a = k.getUTCHours(), a <<= 6, a |= k.getUTCMinutes(), a <<= 5, a |= k.getUTCSeconds() / 2, o = k.getUTCFullYear() - 1980, o <<= 4, o |= k.getUTCMonth() + 1, o <<= 5, o |= k.getUTCDate(), _ && (v = A(1, 1) + A(B(f), 4) + d, b += "up" + A(v.length, 2) + v), g && (y = A(1, 1) + A(B(p), 4) + m, b += "uc" + A(y.length, 2) + y); var E = ""; return E += "\n\0", E += A(S, 2), E += u.magic, E += A(a, 2), E += A(o, 2), E += A(x.crc32, 4), E += A(x.compressedSize, 4), E += A(x.uncompressedSize, 4), E += A(f.length, 2), E += A(b.length, 2), { fileRecord: R.LOCAL_FILE_HEADER + E + f + b, dirRecord: R.CENTRAL_FILE_HEADER + A(C, 2) + E + A(p.length, 2) + "\0\0\0\0" + A(z, 4) + A(i, 4) + f + b + p } } var I = t("../utils"), n = t("../stream/GenericWorker"), O = t("../utf8"), B = t("../crc32"), R = t("../signature"); function s(t, e, r, i) { n.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = e, this.zipPlatform = r, this.encodeFileName = i, this.streamFiles = t, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [] } I.inherits(s, n), s.prototype.push = function (t) { var e = t.meta.percent || 0, r = this.entriesCount, i = this._sources.length; this.accumulate ? this.contentBuffer.push(t) : (this.bytesWritten += t.data.length, n.prototype.push.call(this, { data: t.data, meta: { currentFile: this.currentFile, percent: r ? (e + 100 * (r - i - 1)) / r : 100 } })) }, s.prototype.openedSource = function (t) { this.currentSourceOffset = this.bytesWritten, this.currentFile = t.file.name; var e = this.streamFiles && !t.file.dir; if (e) { var r = i(t, e, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName); this.push({ data: r.fileRecord, meta: { percent: 0 } }) } else this.accumulate = !0 }, s.prototype.closedSource = function (t) { this.accumulate = !1; var e = this.streamFiles && !t.file.dir, r = i(t, e, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName); if (this.dirRecords.push(r.dirRecord), e) this.push({ data: function (t) { return R.DATA_DESCRIPTOR + A(t.crc32, 4) + A(t.compressedSize, 4) + A(t.uncompressedSize, 4) }(t), meta: { percent: 100 } }); else for (this.push({ data: r.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length;)this.push(this.contentBuffer.shift()); this.currentFile = null }, s.prototype.flush = function () { for (var t = this.bytesWritten, e = 0; e < this.dirRecords.length; e++)this.push({ data: this.dirRecords[e], meta: { percent: 100 } }); var r = this.bytesWritten - t, i = function (t, e, r, i, n) { var s = I.transformTo("string", n(i)); return R.CENTRAL_DIRECTORY_END + "\0\0\0\0" + A(t, 2) + A(t, 2) + A(e, 4) + A(r, 4) + A(s.length, 2) + s }(this.dirRecords.length, r, t, this.zipComment, this.encodeFileName); this.push({ data: i, meta: { percent: 100 } }) }, s.prototype.prepareNextSource = function () { this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume() }, s.prototype.registerPrevious = function (t) { this._sources.push(t); var e = this; return t.on("data", function (t) { e.processChunk(t) }), t.on("end", function () { e.closedSource(e.previous.streamInfo), e._sources.length ? e.prepareNextSource() : e.end() }), t.on("error", function (t) { e.error(t) }), this }, s.prototype.resume = function () { return !!n.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0)) }, s.prototype.error = function (t) { var e = this._sources; if (!n.prototype.error.call(this, t)) return !1; for (var r = 0; r < e.length; r++)try { e[r].error(t) } catch (t) { } return !0 }, s.prototype.lock = function () { n.prototype.lock.call(this); for (var t = this._sources, e = 0; e < t.length; e++)t[e].lock() }, e.exports = s }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function (t, e, r) { "use strict"; var u = t("../compressions"), i = t("./ZipFileWorker"); r.generateWorker = function (t, a, e) { var o = new i(a.streamFiles, e, a.platform, a.encodeFileName), h = 0; try { t.forEach(function (t, e) { h++; var r = function (t, e) { var r = t || e, i = u[r]; if (!i) throw new Error(r + " is not a valid compression method !"); return i }(e.options.compression, a.compression), i = e.options.compressionOptions || a.compressionOptions || {}, n = e.dir, s = e.date; e._compressWorker(r, i).withStreamInfo("file", { name: t, dir: n, date: s, comment: e.comment || "", unixPermissions: e.unixPermissions, dosPermissions: e.dosPermissions }).pipe(o) }), o.entriesCount = h } catch (t) { o.error(t) } return o } }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function (t, e, r) { "use strict"; function i() { if (!(this instanceof i)) return new i; if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide."); this.files = {}, this.comment = null, this.root = "", this.clone = function () { var t = new i; for (var e in this) "function" != typeof this[e] && (t[e] = this[e]); return t } } (i.prototype = t("./object")).loadAsync = t("./load"), i.support = t("./support"), i.defaults = t("./defaults"), i.version = "3.4.0", i.loadAsync = function (t, e) { return (new i).loadAsync(t, e) }, i.external = t("./external"), e.exports = i }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function (t, e, r) { "use strict"; var i = t("./utils"), n = t("./external"), o = t("./utf8"), h = (i = t("./utils"), t("./zipEntries")), s = t("./stream/Crc32Probe"), u = t("./nodejsUtils"); function l(i) { return new n.Promise(function (t, e) { var r = i.decompressed.getContentWorker().pipe(new s); r.on("error", function (t) { e(t) }).on("end", function () { r.streamInfo.crc32 !== i.decompressed.crc32 ? e(new Error("Corrupted zip : CRC32 mismatch")) : t() }).resume() }) } e.exports = function (t, s) { var a = this; return s = i.extend(s || {}, { base64: !1, checkCRC32: !1, optimizedBinaryString: !1, createFolders: !1, decodeFileName: o.utf8decode }), u.isNode && u.isStream(t) ? n.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : i.prepareContent("the loaded zip file", t, !0, s.optimizedBinaryString, s.base64).then(function (t) { var e = new h(s); return e.load(t), e }).then(function (t) { var e = [n.Promise.resolve(t)], r = t.files; if (s.checkCRC32) for (var i = 0; i < r.length; i++)e.push(l(r[i])); return n.Promise.all(e) }).then(function (t) { for (var e = t.shift(), r = e.files, i = 0; i < r.length; i++) { var n = r[i]; a.file(n.fileNameStr, n.decompressed, { binary: !0, optimizedBinaryString: !0, date: n.date, dir: n.dir, comment: n.fileCommentStr.length ? n.fileCommentStr : null, unixPermissions: n.unixPermissions, dosPermissions: n.dosPermissions, createFolders: s.createFolders }) } return e.zipComment.length && (a.comment = e.zipComment), a }) } }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function (t, e, r) { "use strict"; var i = t("../utils"), n = t("../stream/GenericWorker"); function s(t, e) { n.call(this, "Nodejs stream input adapter for " + t), this._upstreamEnded = !1, this._bindStream(e) } i.inherits(s, n), s.prototype._bindStream = function (t) { var e = this; (this._stream = t).pause(), t.on("data", function (t) { e.push({ data: t, meta: { percent: 0 } }) }).on("error", function (t) { e.isPaused ? this.generatedError = t : e.error(t) }).on("end", function () { e.isPaused ? e._upstreamEnded = !0 : e.end() }) }, s.prototype.pause = function () { return !!n.prototype.pause.call(this) && (this._stream.pause(), !0) }, s.prototype.resume = function () { return !!n.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0) }, e.exports = s }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function (t, e, r) { "use strict"; var n = t("readable-stream").Readable; function i(t, e, r) { n.call(this, e), this._helper = t; var i = this; t.on("data", function (t, e) { i.push(t) || i._helper.pause(), r && r(e) }).on("error", function (t) { i.emit("error", t) }).on("end", function () { i.push(null) }) } t("../utils").inherits(i, n), i.prototype._read = function () { this._helper.resume() }, e.exports = i }, { "../utils": 32, "readable-stream": 16 }], 14: [function (t, e, r) { "use strict"; e.exports = { isNode: "undefined" != typeof Buffer, newBufferFrom: function (t, e) { if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(t, e); if ("number" == typeof t) throw new Error('The "data" argument must not be a number'); return new Buffer(t, e) }, allocBuffer: function (t) { if (Buffer.alloc) return Buffer.alloc(t); var e = new Buffer(t); return e.fill(0), e }, isBuffer: function (t) { return Buffer.isBuffer(t) }, isStream: function (t) { return t && "function" == typeof t.on && "function" == typeof t.pause && "function" == typeof t.resume } } }, {}], 15: [function (t, e, r) { "use strict"; function s(t, e, r) { var i, n = u.getTypeOf(e), s = u.extend(r || {}, f); s.date = s.date || new Date, null !== s.compression && (s.compression = s.compression.toUpperCase()), "string" == typeof s.unixPermissions && (s.unixPermissions = parseInt(s.unixPermissions, 8)), s.unixPermissions && 16384 & s.unixPermissions && (s.dir = !0), s.dosPermissions && 16 & s.dosPermissions && (s.dir = !0), s.dir && (t = g(t)), s.createFolders && (i = _(t)) && b.call(this, i, !0); var a = "string" === n && !1 === s.binary && !1 === s.base64; r && void 0 !== r.binary || (s.binary = !a), (e instanceof d && 0 === e.uncompressedSize || s.dir || !e || 0 === e.length) && (s.base64 = !1, s.binary = !0, e = "", s.compression = "STORE", n = "string"); var o = null; o = e instanceof d || e instanceof l ? e : p.isNode && p.isStream(e) ? new m(t, e) : u.prepareContent(t, e, s.binary, s.optimizedBinaryString, s.base64); var h = new c(t, o, s); this.files[t] = h } var n = t("./utf8"), u = t("./utils"), l = t("./stream/GenericWorker"), a = t("./stream/StreamHelper"), f = t("./defaults"), d = t("./compressedObject"), c = t("./zipObject"), o = t("./generate"), p = t("./nodejsUtils"), m = t("./nodejs/NodejsStreamInputAdapter"), _ = function (t) { "/" === t.slice(-1) && (t = t.substring(0, t.length - 1)); var e = t.lastIndexOf("/"); return 0 < e ? t.substring(0, e) : "" }, g = function (t) { return "/" !== t.slice(-1) && (t += "/"), t }, b = function (t, e) { return e = void 0 !== e ? e : f.createFolders, t = g(t), this.files[t] || s.call(this, t, null, { dir: !0, createFolders: e }), this.files[t] }; function h(t) { return "[object RegExp]" === Object.prototype.toString.call(t) } var i = { load: function () { throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.") }, forEach: function (t) { var e, r, i; for (e in this.files) this.files.hasOwnProperty(e) && (i = this.files[e], (r = e.slice(this.root.length, e.length)) && e.slice(0, this.root.length) === this.root && t(r, i)) }, filter: function (r) { var i = []; return this.forEach(function (t, e) { r(t, e) && i.push(e) }), i }, file: function (t, e, r) { if (1 !== arguments.length) return t = this.root + t, s.call(this, t, e, r), this; if (h(t)) { var i = t; return this.filter(function (t, e) { return !e.dir && i.test(t) }) } var n = this.files[this.root + t]; return n && !n.dir ? n : null }, folder: function (r) { if (!r) return this; if (h(r)) return this.filter(function (t, e) { return e.dir && r.test(t) }); var t = this.root + r, e = b.call(this, t), i = this.clone(); return i.root = e.name, i }, remove: function (r) { r = this.root + r; var t = this.files[r]; if (t || ("/" !== r.slice(-1) && (r += "/"), t = this.files[r]), t && !t.dir) delete this.files[r]; else for (var e = this.filter(function (t, e) { return e.name.slice(0, r.length) === r }), i = 0; i < e.length; i++)delete this.files[e[i].name]; return this }, generate: function (t) { throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.") }, generateInternalStream: function (t) { var e, r = {}; try { if ((r = u.extend(t || {}, { streamFiles: !1, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: n.utf8encode })).type = r.type.toLowerCase(), r.compression = r.compression.toUpperCase(), "binarystring" === r.type && (r.type = "string"), !r.type) throw new Error("No output type specified."); u.checkSupport(r.type), "darwin" !== r.platform && "freebsd" !== r.platform && "linux" !== r.platform && "sunos" !== r.platform || (r.platform = "UNIX"), "win32" === r.platform && (r.platform = "DOS"); var i = r.comment || this.comment || ""; e = o.generateWorker(this, r, i) } catch (t) { (e = new l("error")).error(t) } return new a(e, r.type || "string", r.mimeType) }, generateAsync: function (t, e) { return this.generateInternalStream(t).accumulate(e) }, generateNodeStream: function (t, e) { return (t = t || {}).type || (t.type = "nodebuffer"), this.generateInternalStream(t).toNodejsStream(e) } }; e.exports = i }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function (t, e, r) { e.exports = t("stream") }, { stream: void 0 }], 17: [function (t, e, r) { "use strict"; var i = t("./DataReader"); function n(t) { i.call(this, t); for (var e = 0; e < this.data.length; e++)t[e] = 255 & t[e] } t("../utils").inherits(n, i), n.prototype.byteAt = function (t) { return this.data[this.zero + t] }, n.prototype.lastIndexOfSignature = function (t) { for (var e = t.charCodeAt(0), r = t.charCodeAt(1), i = t.charCodeAt(2), n = t.charCodeAt(3), s = this.length - 4; 0 <= s; --s)if (this.data[s] === e && this.data[s + 1] === r && this.data[s + 2] === i && this.data[s + 3] === n) return s - this.zero; return -1 }, n.prototype.readAndCheckSignature = function (t) { var e = t.charCodeAt(0), r = t.charCodeAt(1), i = t.charCodeAt(2), n = t.charCodeAt(3), s = this.readData(4); return e === s[0] && r === s[1] && i === s[2] && n === s[3] }, n.prototype.readData = function (t) { if (this.checkOffset(t), 0 === t) return []; var e = this.data.slice(this.zero + this.index, this.zero + this.index + t); return this.index += t, e }, e.exports = n }, { "../utils": 32, "./DataReader": 18 }], 18: [function (t, e, r) { "use strict"; var i = t("../utils"); function n(t) { this.data = t, this.length = t.length, this.index = 0, this.zero = 0 } n.prototype = { checkOffset: function (t) { this.checkIndex(this.index + t) }, checkIndex: function (t) { if (this.length < this.zero + t || t < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + t + "). Corrupted zip ?") }, setIndex: function (t) { this.checkIndex(t), this.index = t }, skip: function (t) { this.setIndex(this.index + t) }, byteAt: function (t) { }, readInt: function (t) { var e, r = 0; for (this.checkOffset(t), e = this.index + t - 1; e >= this.index; e--)r = (r << 8) + this.byteAt(e); return this.index += t, r }, readString: function (t) { return i.transformTo("string", this.readData(t)) }, readData: function (t) { }, lastIndexOfSignature: function (t) { }, readAndCheckSignature: function (t) { }, readDate: function () { var t = this.readInt(4); return new Date(Date.UTC(1980 + (t >> 25 & 127), (t >> 21 & 15) - 1, t >> 16 & 31, t >> 11 & 31, t >> 5 & 63, (31 & t) << 1)) } }, e.exports = n }, { "../utils": 32 }], 19: [function (t, e, r) { "use strict"; var i = t("./Uint8ArrayReader"); function n(t) { i.call(this, t) } t("../utils").inherits(n, i), n.prototype.readData = function (t) { this.checkOffset(t); var e = this.data.slice(this.zero + this.index, this.zero + this.index + t); return this.index += t, e }, e.exports = n }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function (t, e, r) { "use strict"; var i = t("./DataReader"); function n(t) { i.call(this, t) } t("../utils").inherits(n, i), n.prototype.byteAt = function (t) { return this.data.charCodeAt(this.zero + t) }, n.prototype.lastIndexOfSignature = function (t) { return this.data.lastIndexOf(t) - this.zero }, n.prototype.readAndCheckSignature = function (t) { return t === this.readData(4) }, n.prototype.readData = function (t) { this.checkOffset(t); var e = this.data.slice(this.zero + this.index, this.zero + this.index + t); return this.index += t, e }, e.exports = n }, { "../utils": 32, "./DataReader": 18 }], 21: [function (t, e, r) { "use strict"; var i = t("./ArrayReader"); function n(t) { i.call(this, t) } t("../utils").inherits(n, i), n.prototype.readData = function (t) { if (this.checkOffset(t), 0 === t) return new Uint8Array(0); var e = this.data.subarray(this.zero + this.index, this.zero + this.index + t); return this.index += t, e }, e.exports = n }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function (t, e, r) { "use strict"; var i = t("../utils"), n = t("../support"), s = t("./ArrayReader"), a = t("./StringReader"), o = t("./NodeBufferReader"), h = t("./Uint8ArrayReader"); e.exports = function (t) { var e = i.getTypeOf(t); return i.checkSupport(e), "string" !== e || n.uint8array ? "nodebuffer" === e ? new o(t) : n.uint8array ? new h(i.transformTo("uint8array", t)) : new s(i.transformTo("array", t)) : new a(t) } }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function (t, e, r) { "use strict"; r.LOCAL_FILE_HEADER = "PK", r.CENTRAL_FILE_HEADER = "PK", r.CENTRAL_DIRECTORY_END = "PK", r.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK", r.ZIP64_CENTRAL_DIRECTORY_END = "PK", r.DATA_DESCRIPTOR = "PK\b" }, {}], 24: [function (t, e, r) { "use strict"; var i = t("./GenericWorker"), n = t("../utils"); function s(t) { i.call(this, "ConvertWorker to " + t), this.destType = t } n.inherits(s, i), s.prototype.processChunk = function (t) { this.push({ data: n.transformTo(this.destType, t.data), meta: t.meta }) }, e.exports = s }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function (t, e, r) { "use strict"; var i = t("./GenericWorker"), n = t("../crc32"); function s() { i.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0) } t("../utils").inherits(s, i), s.prototype.processChunk = function (t) { this.streamInfo.crc32 = n(t.data, this.streamInfo.crc32 || 0), this.push(t) }, e.exports = s }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function (t, e, r) { "use strict"; var i = t("../utils"), n = t("./GenericWorker"); function s(t) { n.call(this, "DataLengthProbe for " + t), this.propName = t, this.withStreamInfo(t, 0) } i.inherits(s, n), s.prototype.processChunk = function (t) { if (t) { var e = this.streamInfo[this.propName] || 0; this.streamInfo[this.propName] = e + t.data.length } n.prototype.processChunk.call(this, t) }, e.exports = s }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function (t, e, r) { "use strict"; var i = t("../utils"), n = t("./GenericWorker"); function s(t) { n.call(this, "DataWorker"); var e = this; this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, t.then(function (t) { e.dataIsReady = !0, e.data = t, e.max = t && t.length || 0, e.type = i.getTypeOf(t), e.isPaused || e._tickAndRepeat() }, function (t) { e.error(t) }) } i.inherits(s, n), s.prototype.cleanUp = function () { n.prototype.cleanUp.call(this), this.data = null }, s.prototype.resume = function () { return !!n.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, i.delay(this._tickAndRepeat, [], this)), !0) }, s.prototype._tickAndRepeat = function () { this._tickScheduled = !1, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (i.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0)) }, s.prototype._tick = function () { if (this.isPaused || this.isFinished) return !1; var t = null, e = Math.min(this.max, this.index + 16384); if (this.index >= this.max) return this.end(); switch (this.type) { case "string": t = this.data.substring(this.index, e); break; case "uint8array": t = this.data.subarray(this.index, e); break; case "array": case "nodebuffer": t = this.data.slice(this.index, e) }return this.index = e, this.push({ data: t, meta: { percent: this.max ? this.index / this.max * 100 : 0 } }) }, e.exports = s }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function (t, e, r) { "use strict"; function i(t) { this.name = t || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = !0, this.isFinished = !1, this.isLocked = !1, this._listeners = { data: [], end: [], error: [] }, this.previous = null } i.prototype = { push: function (t) { this.emit("data", t) }, end: function () { if (this.isFinished) return !1; this.flush(); try { this.emit("end"), this.cleanUp(), this.isFinished = !0 } catch (t) { this.emit("error", t) } return !0 }, error: function (t) { return !this.isFinished && (this.isPaused ? this.generatedError = t : (this.isFinished = !0, this.emit("error", t), this.previous && this.previous.error(t), this.cleanUp()), !0) }, on: function (t, e) { return this._listeners[t].push(e), this }, cleanUp: function () { this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [] }, emit: function (t, e) { if (this._listeners[t]) for (var r = 0; r < this._listeners[t].length; r++)this._listeners[t][r].call(this, e) }, pipe: function (t) { return t.registerPrevious(this) }, registerPrevious: function (t) { if (this.isLocked) throw new Error("The stream '" + this + "' has already been used."); this.streamInfo = t.streamInfo, this.mergeStreamInfo(), this.previous = t; var e = this; return t.on("data", function (t) { e.processChunk(t) }), t.on("end", function () { e.end() }), t.on("error", function (t) { e.error(t) }), this }, pause: function () { return !this.isPaused && !this.isFinished && (this.isPaused = !0, this.previous && this.previous.pause(), !0) }, resume: function () { if (!this.isPaused || this.isFinished) return !1; var t = this.isPaused = !1; return this.generatedError && (this.error(this.generatedError), t = !0), this.previous && this.previous.resume(), !t }, flush: function () { }, processChunk: function (t) { this.push(t) }, withStreamInfo: function (t, e) { return this.extraStreamInfo[t] = e, this.mergeStreamInfo(), this }, mergeStreamInfo: function () { for (var t in this.extraStreamInfo) this.extraStreamInfo.hasOwnProperty(t) && (this.streamInfo[t] = this.extraStreamInfo[t]) }, lock: function () { if (this.isLocked) throw new Error("The stream '" + this + "' has already been used."); this.isLocked = !0, this.previous && this.previous.lock() }, toString: function () { var t = "Worker " + this.name; return this.previous ? this.previous + " -> " + t : t } }, e.exports = i }, {}], 29: [function (t, e, r) { "use strict"; var h = t("../utils"), n = t("./ConvertWorker"), s = t("./GenericWorker"), u = t("../base64"), i = t("../support"), a = t("../external"), o = null; if (i.nodestream) try { o = t("../nodejs/NodejsStreamOutputAdapter") } catch (t) { } function l(t, o) { return new a.Promise(function (e, r) { var i = [], n = t._internalType, s = t._outputType, a = t._mimeType; t.on("data", function (t, e) { i.push(t), o && o(e) }).on("error", function (t) { i = [], r(t) }).on("end", function () { try { var t = function (t, e, r) { switch (t) { case "blob": return h.newBlob(h.transformTo("arraybuffer", e), r); case "base64": return u.encode(e); default: return h.transformTo(t, e) } }(s, function (t, e) { var r, i = 0, n = null, s = 0; for (r = 0; r < e.length; r++)s += e[r].length; switch (t) { case "string": return e.join(""); case "array": return Array.prototype.concat.apply([], e); case "uint8array": for (n = new Uint8Array(s), r = 0; r < e.length; r++)n.set(e[r], i), i += e[r].length; return n; case "nodebuffer": return Buffer.concat(e); default: throw new Error("concat : unsupported type '" + t + "'") } }(n, i), a); e(t) } catch (t) { r(t) } i = [] }).resume() }) } function f(t, e, r) { var i = e; switch (e) { case "blob": case "arraybuffer": i = "uint8array"; break; case "base64": i = "string" }try { this._internalType = i, this._outputType = e, this._mimeType = r, h.checkSupport(i), this._worker = t.pipe(new n(i)), t.lock() } catch (t) { this._worker = new s("error"), this._worker.error(t) } } f.prototype = { accumulate: function (t) { return l(this, t) }, on: function (t, e) { var r = this; return "data" === t ? this._worker.on(t, function (t) { e.call(r, t.data, t.meta) }) : this._worker.on(t, function () { h.delay(e, arguments, r) }), this }, resume: function () { return h.delay(this._worker.resume, [], this._worker), this }, pause: function () { return this._worker.pause(), this }, toNodejsStream: function (t) { if (h.checkSupport("nodestream"), "nodebuffer" !== this._outputType) throw new Error(this._outputType + " is not supported by this method"); return new o(this, { objectMode: "nodebuffer" !== this._outputType }, t) } }, e.exports = f }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function (t, e, r) { "use strict"; if (r.base64 = !0, r.array = !0, r.string = !0, r.arraybuffer = "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array, r.nodebuffer = "undefined" != typeof Buffer, r.uint8array = "undefined" != typeof Uint8Array, "undefined" == typeof ArrayBuffer) r.blob = !1; else { var i = new ArrayBuffer(0); try { r.blob = 0 === new Blob([i], { type: "application/zip" }).size } catch (t) { try { var n = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder); n.append(i), r.blob = 0 === n.getBlob("application/zip").size } catch (t) { r.blob = !1 } } } try { r.nodestream = !!t("readable-stream").Readable } catch (t) { r.nodestream = !1 } }, { "readable-stream": 16 }], 31: [function (t, e, s) { "use strict"; for (var o = t("./utils"), h = t("./support"), r = t("./nodejsUtils"), i = t("./stream/GenericWorker"), u = new Array(256), n = 0; n < 256; n++)u[n] = 252 <= n ? 6 : 248 <= n ? 5 : 240 <= n ? 4 : 224 <= n ? 3 : 192 <= n ? 2 : 1; u[254] = u[254] = 1; function a() { i.call(this, "utf-8 decode"), this.leftOver = null } function l() { i.call(this, "utf-8 encode") } s.utf8encode = function (t) { return h.nodebuffer ? r.newBufferFrom(t, "utf-8") : function (t) { var e, r, i, n, s, a = t.length, o = 0; for (n = 0; n < a; n++)55296 == (64512 & (r = t.charCodeAt(n))) && n + 1 < a && 56320 == (64512 & (i = t.charCodeAt(n + 1))) && (r = 65536 + (r - 55296 << 10) + (i - 56320), n++), o += r < 128 ? 1 : r < 2048 ? 2 : r < 65536 ? 3 : 4; for (e = h.uint8array ? new Uint8Array(o) : new Array(o), n = s = 0; s < o; n++)55296 == (64512 & (r = t.charCodeAt(n))) && n + 1 < a && 56320 == (64512 & (i = t.charCodeAt(n + 1))) && (r = 65536 + (r - 55296 << 10) + (i - 56320), n++), r < 128 ? e[s++] = r : (r < 2048 ? e[s++] = 192 | r >>> 6 : (r < 65536 ? e[s++] = 224 | r >>> 12 : (e[s++] = 240 | r >>> 18, e[s++] = 128 | r >>> 12 & 63), e[s++] = 128 | r >>> 6 & 63), e[s++] = 128 | 63 & r); return e }(t) }, s.utf8decode = function (t) { return h.nodebuffer ? o.transformTo("nodebuffer", t).toString("utf-8") : function (t) { var e, r, i, n, s = t.length, a = new Array(2 * s); for (e = r = 0; e < s;)if ((i = t[e++]) < 128) a[r++] = i; else if (4 < (n = u[i])) a[r++] = 65533, e += n - 1; else { for (i &= 2 === n ? 31 : 3 === n ? 15 : 7; 1 < n && e < s;)i = i << 6 | 63 & t[e++], n--; 1 < n ? a[r++] = 65533 : i < 65536 ? a[r++] = i : (i -= 65536, a[r++] = 55296 | i >> 10 & 1023, a[r++] = 56320 | 1023 & i) } return a.length !== r && (a.subarray ? a = a.subarray(0, r) : a.length = r), o.applyFromCharCode(a) }(t = o.transformTo(h.uint8array ? "uint8array" : "array", t)) }, o.inherits(a, i), a.prototype.processChunk = function (t) { var e = o.transformTo(h.uint8array ? "uint8array" : "array", t.data); if (this.leftOver && this.leftOver.length) { if (h.uint8array) { var r = e; (e = new Uint8Array(r.length + this.leftOver.length)).set(this.leftOver, 0), e.set(r, this.leftOver.length) } else e = this.leftOver.concat(e); this.leftOver = null } var i = function (t, e) { var r; for ((e = e || t.length) > t.length && (e = t.length), r = e - 1; 0 <= r && 128 == (192 & t[r]);)r--; return r < 0 ? e : 0 === r ? e : r + u[t[r]] > e ? r : e }(e), n = e; i !== e.length && (h.uint8array ? (n = e.subarray(0, i), this.leftOver = e.subarray(i, e.length)) : (n = e.slice(0, i), this.leftOver = e.slice(i, e.length))), this.push({ data: s.utf8decode(n), meta: t.meta }) }, a.prototype.flush = function () { this.leftOver && this.leftOver.length && (this.push({ data: s.utf8decode(this.leftOver), meta: {} }), this.leftOver = null) }, s.Utf8DecodeWorker = a, o.inherits(l, i), l.prototype.processChunk = function (t) { this.push({ data: s.utf8encode(t.data), meta: t.meta }) }, s.Utf8EncodeWorker = l }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function (t, e, a) { "use strict"; var o = t("./support"), h = t("./base64"), r = t("./nodejsUtils"), i = t("set-immediate-shim"), u = t("./external"); function n(t) { return t } function l(t, e) { for (var r = 0; r < t.length; ++r)e[r] = 255 & t.charCodeAt(r); return e } a.newBlob = function (e, r) { a.checkSupport("blob"); try { return new Blob([e], { type: r }) } catch (t) { try { var i = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder); return i.append(e), i.getBlob(r) } catch (t) { throw new Error("Bug : can't construct the Blob.") } } }; var s = { stringifyByChunk: function (t, e, r) { var i = [], n = 0, s = t.length; if (s <= r) return String.fromCharCode.apply(null, t); for (; n < s;)"array" === e || "nodebuffer" === e ? i.push(String.fromCharCode.apply(null, t.slice(n, Math.min(n + r, s)))) : i.push(String.fromCharCode.apply(null, t.subarray(n, Math.min(n + r, s)))), n += r; return i.join("") }, stringifyByChar: function (t) { for (var e = "", r = 0; r < t.length; r++)e += String.fromCharCode(t[r]); return e }, applyCanBeUsed: { uint8array: function () { try { return o.uint8array && 1 === String.fromCharCode.apply(null, new Uint8Array(1)).length } catch (t) { return !1 } }(), nodebuffer: function () { try { return o.nodebuffer && 1 === String.fromCharCode.apply(null, r.allocBuffer(1)).length } catch (t) { return !1 } }() } }; function f(t) { var e = 65536, r = a.getTypeOf(t), i = !0; if ("uint8array" === r ? i = s.applyCanBeUsed.uint8array : "nodebuffer" === r && (i = s.applyCanBeUsed.nodebuffer), i) for (; 1 < e;)try { return s.stringifyByChunk(t, r, e) } catch (t) { e = Math.floor(e / 2) } return s.stringifyByChar(t) } function d(t, e) { for (var r = 0; r < t.length; r++)e[r] = t[r]; return e } a.applyFromCharCode = f; var c = {}; c.string = { string: n, array: function (t) { return l(t, new Array(t.length)) }, arraybuffer: function (t) { return c.string.uint8array(t).buffer }, uint8array: function (t) { return l(t, new Uint8Array(t.length)) }, nodebuffer: function (t) { return l(t, r.allocBuffer(t.length)) } }, c.array = { string: f, array: n, arraybuffer: function (t) { return new Uint8Array(t).buffer }, uint8array: function (t) { return new Uint8Array(t) }, nodebuffer: function (t) { return r.newBufferFrom(t) } }, c.arraybuffer = { string: function (t) { return f(new Uint8Array(t)) }, array: function (t) { return d(new Uint8Array(t), new Array(t.byteLength)) }, arraybuffer: n, uint8array: function (t) { return new Uint8Array(t) }, nodebuffer: function (t) { return r.newBufferFrom(new Uint8Array(t)) } }, c.uint8array = { string: f, array: function (t) { return d(t, new Array(t.length)) }, arraybuffer: function (t) { return t.buffer }, uint8array: n, nodebuffer: function (t) { return r.newBufferFrom(t) } }, c.nodebuffer = { string: f, array: function (t) { return d(t, new Array(t.length)) }, arraybuffer: function (t) { return c.nodebuffer.uint8array(t).buffer }, uint8array: function (t) { return d(t, new Uint8Array(t.length)) }, nodebuffer: n }, a.transformTo = function (t, e) { if (e = e || "", !t) return e; a.checkSupport(t); var r = a.getTypeOf(e); return c[r][t](e) }, a.getTypeOf = function (t) { return "string" == typeof t ? "string" : "[object Array]" === Object.prototype.toString.call(t) ? "array" : o.nodebuffer && r.isBuffer(t) ? "nodebuffer" : o.uint8array && t instanceof Uint8Array ? "uint8array" : o.arraybuffer && t instanceof ArrayBuffer ? "arraybuffer" : void 0 }, a.checkSupport = function (t) { if (!o[t.toLowerCase()]) throw new Error(t + " is not supported by this platform") }, a.MAX_VALUE_16BITS = 65535, a.MAX_VALUE_32BITS = -1, a.pretty = function (t) { var e, r, i = ""; for (r = 0; r < (t || "").length; r++)i += "\\x" + ((e = t.charCodeAt(r)) < 16 ? "0" : "") + e.toString(16).toUpperCase(); return i }, a.delay = function (t, e, r) { i(function () { t.apply(r || null, e || []) }) }, a.inherits = function (t, e) { function r() { } r.prototype = e.prototype, t.prototype = new r }, a.extend = function () { var t, e, r = {}; for (t = 0; t < arguments.length; t++)for (e in arguments[t]) arguments[t].hasOwnProperty(e) && void 0 === r[e] && (r[e] = arguments[t][e]); return r }, a.prepareContent = function (r, t, i, n, s) { return u.Promise.resolve(t).then(function (i) { return o.blob && (i instanceof Blob || -1 !== ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(i))) && "undefined" != typeof FileReader ? new u.Promise(function (e, r) { var t = new FileReader; t.onload = function (t) { e(t.target.result) }, t.onerror = function (t) { r(t.target.error) }, t.readAsArrayBuffer(i) }) : i }).then(function (t) { var e = a.getTypeOf(t); return e ? ("arraybuffer" === e ? t = a.transformTo("uint8array", t) : "string" === e && (s ? t = h.decode(t) : i && !0 !== n && (t = function (t) { return l(t, o.uint8array ? new Uint8Array(t.length) : new Array(t.length)) }(t))), t) : u.Promise.reject(new Error("Can't read the data of '" + r + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?")) }) } }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, "set-immediate-shim": 54 }], 33: [function (t, e, r) { "use strict"; var i = t("./reader/readerFor"), n = t("./utils"), s = t("./signature"), a = t("./zipEntry"), o = (t("./utf8"), t("./support")); function h(t) { this.files = [], this.loadOptions = t } h.prototype = { checkSignature: function (t) { if (!this.reader.readAndCheckSignature(t)) { this.reader.index -= 4; var e = this.reader.readString(4); throw new Error("Corrupted zip or bug: unexpected signature (" + n.pretty(e) + ", expected " + n.pretty(t) + ")") } }, isSignature: function (t, e) { var r = this.reader.index; this.reader.setIndex(t); var i = this.reader.readString(4) === e; return this.reader.setIndex(r), i }, readBlockEndOfCentral: function () { this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2); var t = this.reader.readData(this.zipCommentLength), e = o.uint8array ? "uint8array" : "array", r = n.transformTo(e, t); this.zipComment = this.loadOptions.decodeFileName(r) }, readBlockZip64EndOfCentral: function () { this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {}; for (var t, e, r, i = this.zip64EndOfCentralSize - 44; 0 < i;)t = this.reader.readInt(2), e = this.reader.readInt(4), r = this.reader.readData(e), this.zip64ExtensibleData[t] = { id: t, length: e, value: r } }, readBlockZip64EndOfCentralLocator: function () { if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported") }, readLocalFiles: function () { var t, e; for (t = 0; t < this.files.length; t++)e = this.files[t], this.reader.setIndex(e.localHeaderOffset), this.checkSignature(s.LOCAL_FILE_HEADER), e.readLocalPart(this.reader), e.handleUTF8(), e.processAttributes() }, readCentralDir: function () { var t; for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER);)(t = new a({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(t); if (this.centralDirRecords !== this.files.length && 0 !== this.centralDirRecords && 0 === this.files.length) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length) }, readEndOfCentral: function () { var t = this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END); if (t < 0) throw !this.isSignature(0, s.LOCAL_FILE_HEADER) ? new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html") : new Error("Corrupted zip: can't find end of central directory"); this.reader.setIndex(t); var e = t; if (this.checkSignature(s.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === n.MAX_VALUE_16BITS || this.diskWithCentralDirStart === n.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === n.MAX_VALUE_16BITS || this.centralDirRecords === n.MAX_VALUE_16BITS || this.centralDirSize === n.MAX_VALUE_32BITS || this.centralDirOffset === n.MAX_VALUE_32BITS) { if (this.zip64 = !0, (t = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator"); if (this.reader.setIndex(t), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, s.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory"); this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral() } var r = this.centralDirOffset + this.centralDirSize; this.zip64 && (r += 20, r += 12 + this.zip64EndOfCentralSize); var i = e - r; if (0 < i) this.isSignature(e, s.CENTRAL_FILE_HEADER) || (this.reader.zero = i); else if (i < 0) throw new Error("Corrupted zip: missing " + Math.abs(i) + " bytes.") }, prepareReader: function (t) { this.reader = i(t) }, load: function (t) { this.prepareReader(t), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles() } }, e.exports = h }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utf8": 31, "./utils": 32, "./zipEntry": 34 }], 34: [function (t, e, r) { "use strict"; var i = t("./reader/readerFor"), s = t("./utils"), n = t("./compressedObject"), a = t("./crc32"), o = t("./utf8"), h = t("./compressions"), u = t("./support"); function l(t, e) { this.options = t, this.loadOptions = e } l.prototype = { isEncrypted: function () { return 1 == (1 & this.bitFlag) }, useUTF8: function () { return 2048 == (2048 & this.bitFlag) }, readLocalPart: function (t) { var e, r; if (t.skip(22), this.fileNameLength = t.readInt(2), r = t.readInt(2), this.fileName = t.readData(this.fileNameLength), t.skip(r), -1 === this.compressedSize || -1 === this.uncompressedSize) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)"); if (null === (e = function (t) { for (var e in h) if (h.hasOwnProperty(e) && h[e].magic === t) return h[e]; return null }(this.compressionMethod))) throw new Error("Corrupted zip : compression " + s.pretty(this.compressionMethod) + " unknown (inner file : " + s.transformTo("string", this.fileName) + ")"); this.decompressed = new n(this.compressedSize, this.uncompressedSize, this.crc32, e, t.readData(this.compressedSize)) }, readCentralPart: function (t) { this.versionMadeBy = t.readInt(2), t.skip(2), this.bitFlag = t.readInt(2), this.compressionMethod = t.readString(2), this.date = t.readDate(), this.crc32 = t.readInt(4), this.compressedSize = t.readInt(4), this.uncompressedSize = t.readInt(4); var e = t.readInt(2); if (this.extraFieldsLength = t.readInt(2), this.fileCommentLength = t.readInt(2), this.diskNumberStart = t.readInt(2), this.internalFileAttributes = t.readInt(2), this.externalFileAttributes = t.readInt(4), this.localHeaderOffset = t.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported"); t.skip(e), this.readExtraFields(t), this.parseZIP64ExtraField(t), this.fileComment = t.readData(this.fileCommentLength) }, processAttributes: function () { this.unixPermissions = null, this.dosPermissions = null; var t = this.versionMadeBy >> 8; this.dir = !!(16 & this.externalFileAttributes), 0 == t && (this.dosPermissions = 63 & this.externalFileAttributes), 3 == t && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || "/" !== this.fileNameStr.slice(-1) || (this.dir = !0) }, parseZIP64ExtraField: function (t) { if (this.extraFields[1]) { var e = i(this.extraFields[1].value); this.uncompressedSize === s.MAX_VALUE_32BITS && (this.uncompressedSize = e.readInt(8)), this.compressedSize === s.MAX_VALUE_32BITS && (this.compressedSize = e.readInt(8)), this.localHeaderOffset === s.MAX_VALUE_32BITS && (this.localHeaderOffset = e.readInt(8)), this.diskNumberStart === s.MAX_VALUE_32BITS && (this.diskNumberStart = e.readInt(4)) } }, readExtraFields: function (t) { var e, r, i, n = t.index + this.extraFieldsLength; for (this.extraFields || (this.extraFields = {}); t.index < n;)e = t.readInt(2), r = t.readInt(2), i = t.readData(r), this.extraFields[e] = { id: e, length: r, value: i } }, handleUTF8: function () { var t = u.uint8array ? "uint8array" : "array"; if (this.useUTF8()) this.fileNameStr = o.utf8decode(this.fileName), this.fileCommentStr = o.utf8decode(this.fileComment); else { var e = this.findExtraFieldUnicodePath(); if (null !== e) this.fileNameStr = e; else { var r = s.transformTo(t, this.fileName); this.fileNameStr = this.loadOptions.decodeFileName(r) } var i = this.findExtraFieldUnicodeComment(); if (null !== i) this.fileCommentStr = i; else { var n = s.transformTo(t, this.fileComment); this.fileCommentStr = this.loadOptions.decodeFileName(n) } } }, findExtraFieldUnicodePath: function () { var t = this.extraFields[28789]; if (t) { var e = i(t.value); return 1 !== e.readInt(1) ? null : a(this.fileName) !== e.readInt(4) ? null : o.utf8decode(e.readData(t.length - 5)) } return null }, findExtraFieldUnicodeComment: function () { var t = this.extraFields[25461]; if (t) { var e = i(t.value); return 1 !== e.readInt(1) ? null : a(this.fileComment) !== e.readInt(4) ? null : o.utf8decode(e.readData(t.length - 5)) } return null } }, e.exports = l }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function (t, e, r) { "use strict"; function i(t, e, r) { this.name = t, this.dir = r.dir, this.date = r.date, this.comment = r.comment, this.unixPermissions = r.unixPermissions, this.dosPermissions = r.dosPermissions, this._data = e, this._dataBinary = r.binary, this.options = { compression: r.compression, compressionOptions: r.compressionOptions } } var s = t("./stream/StreamHelper"), n = t("./stream/DataWorker"), a = t("./utf8"), o = t("./compressedObject"), h = t("./stream/GenericWorker"); i.prototype = { internalStream: function (t) { var e = null, r = "string"; try { if (!t) throw new Error("No output type specified."); var i = "string" === (r = t.toLowerCase()) || "text" === r; "binarystring" !== r && "text" !== r || (r = "string"), e = this._decompressWorker(); var n = !this._dataBinary; n && !i && (e = e.pipe(new a.Utf8EncodeWorker)), !n && i && (e = e.pipe(new a.Utf8DecodeWorker)) } catch (t) { (e = new h("error")).error(t) } return new s(e, r, "") }, async: function (t, e) { return this.internalStream(t).accumulate(e) }, nodeStream: function (t, e) { return this.internalStream(t || "nodebuffer").toNodejsStream(e) }, _compressWorker: function (t, e) { if (this._data instanceof o && this._data.compression.magic === t.magic) return this._data.getCompressedWorker(); var r = this._decompressWorker(); return this._dataBinary || (r = r.pipe(new a.Utf8EncodeWorker)), o.createWorkerFrom(r, t, e) }, _decompressWorker: function () { return this._data instanceof o ? this._data.getContentWorker() : this._data instanceof h ? this._data : new n(this._data) } }; for (var u = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], l = function () { throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.") }, f = 0; f < u.length; f++)i.prototype[u[f]] = l; e.exports = i }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function (t, l, e) { (function (e) { "use strict"; var r, i, t = e.MutationObserver || e.WebKitMutationObserver; if (t) { var n = 0, s = new t(u), a = e.document.createTextNode(""); s.observe(a, { characterData: !0 }), r = function () { a.data = n = ++n % 2 } } else if (e.setImmediate || void 0 === e.MessageChannel) r = "document" in e && "onreadystatechange" in e.document.createElement("script") ? function () { var t = e.document.createElement("script"); t.onreadystatechange = function () { u(), t.onreadystatechange = null, t.parentNode.removeChild(t), t = null }, e.document.documentElement.appendChild(t) } : function () { setTimeout(u, 0) }; else { var o = new e.MessageChannel; o.port1.onmessage = u, r = function () { o.port2.postMessage(0) } } var h = []; function u() { var t, e; i = !0; for (var r = h.length; r;) { for (e = h, h = [], t = -1; ++t < r;)e[t](); r = h.length } i = !1 } l.exports = function (t) { 1 !== h.push(t) || i || r() } }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}) }, {}], 37: [function (t, e, r) { "use strict"; var n = t("immediate"); function u() { } var l = {}, s = ["REJECTED"], a = ["FULFILLED"], i = ["PENDING"]; function o(t) { if ("function" != typeof t) throw new TypeError("resolver must be a function"); this.state = i, this.queue = [], this.outcome = void 0, t !== u && c(this, t) } function h(t, e, r) { this.promise = t, "function" == typeof e && (this.onFulfilled = e, this.callFulfilled = this.otherCallFulfilled), "function" == typeof r && (this.onRejected = r, this.callRejected = this.otherCallRejected) } function f(e, r, i) { n(function () { var t; try { t = r(i) } catch (t) { return l.reject(e, t) } t === e ? l.reject(e, new TypeError("Cannot resolve promise with itself")) : l.resolve(e, t) }) } function d(t) { var e = t && t.then; if (t && ("object" == typeof t || "function" == typeof t) && "function" == typeof e) return function () { e.apply(t, arguments) } } function c(e, t) { var r = !1; function i(t) { r || (r = !0, l.reject(e, t)) } function n(t) { r || (r = !0, l.resolve(e, t)) } var s = p(function () { t(n, i) }); "error" === s.status && i(s.value) } function p(t, e) { var r = {}; try { r.value = t(e), r.status = "success" } catch (t) { r.status = "error", r.value = t } return r } (e.exports = o).prototype.finally = function (e) { if ("function" != typeof e) return this; var r = this.constructor; return this.then(function (t) { return r.resolve(e()).then(function () { return t }) }, function (t) { return r.resolve(e()).then(function () { throw t }) }) }, o.prototype.catch = function (t) { return this.then(null, t) }, o.prototype.then = function (t, e) { if ("function" != typeof t && this.state === a || "function" != typeof e && this.state === s) return this; var r = new this.constructor(u); this.state !== i ? f(r, this.state === a ? t : e, this.outcome) : this.queue.push(new h(r, t, e)); return r }, h.prototype.callFulfilled = function (t) { l.resolve(this.promise, t) }, h.prototype.otherCallFulfilled = function (t) { f(this.promise, this.onFulfilled, t) }, h.prototype.callRejected = function (t) { l.reject(this.promise, t) }, h.prototype.otherCallRejected = function (t) { f(this.promise, this.onRejected, t) }, l.resolve = function (t, e) { var r = p(d, e); if ("error" === r.status) return l.reject(t, r.value); var i = r.value; if (i) c(t, i); else { t.state = a, t.outcome = e; for (var n = -1, s = t.queue.length; ++n < s;)t.queue[n].callFulfilled(e) } return t }, l.reject = function (t, e) { t.state = s, t.outcome = e; for (var r = -1, i = t.queue.length; ++r < i;)t.queue[r].callRejected(e); return t }, o.resolve = function (t) { if (t instanceof this) return t; return l.resolve(new this(u), t) }, o.reject = function (t) { var e = new this(u); return l.reject(e, t) }, o.all = function (t) { var r = this; if ("[object Array]" !== Object.prototype.toString.call(t)) return this.reject(new TypeError("must be an array")); var i = t.length, n = !1; if (!i) return this.resolve([]); var s = new Array(i), a = 0, e = -1, o = new this(u); for (; ++e < i;)h(t[e], e); return o; function h(t, e) { r.resolve(t).then(function (t) { s[e] = t, ++a !== i || n || (n = !0, l.resolve(o, s)) }, function (t) { n || (n = !0, l.reject(o, t)) }) } }, o.race = function (t) { var e = this; if ("[object Array]" !== Object.prototype.toString.call(t)) return this.reject(new TypeError("must be an array")); var r = t.length, i = !1; if (!r) return this.resolve([]); var n = -1, s = new this(u); for (; ++n < r;)a = t[n], e.resolve(a).then(function (t) { i || (i = !0, l.resolve(s, t)) }, function (t) { i || (i = !0, l.reject(s, t)) }); var a; return s } }, { immediate: 36 }], 38: [function (t, e, r) { "use strict"; var i = {}; (0, t("./lib/utils/common").assign)(i, t("./lib/deflate"), t("./lib/inflate"), t("./lib/zlib/constants")), e.exports = i }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function (t, e, r) { "use strict"; var a = t("./zlib/deflate"), o = t("./utils/common"), h = t("./utils/strings"), n = t("./zlib/messages"), s = t("./zlib/zstream"), u = Object.prototype.toString, l = 0, f = -1, d = 0, c = 8; function p(t) { if (!(this instanceof p)) return new p(t); this.options = o.assign({ level: f, method: c, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: d, to: "" }, t || {}); var e = this.options; e.raw && 0 < e.windowBits ? e.windowBits = -e.windowBits : e.gzip && 0 < e.windowBits && e.windowBits < 16 && (e.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new s, this.strm.avail_out = 0; var r = a.deflateInit2(this.strm, e.level, e.method, e.windowBits, e.memLevel, e.strategy); if (r !== l) throw new Error(n[r]); if (e.header && a.deflateSetHeader(this.strm, e.header), e.dictionary) { var i; if (i = "string" == typeof e.dictionary ? h.string2buf(e.dictionary) : "[object ArrayBuffer]" === u.call(e.dictionary) ? new Uint8Array(e.dictionary) : e.dictionary, (r = a.deflateSetDictionary(this.strm, i)) !== l) throw new Error(n[r]); this._dict_set = !0 } } function i(t, e) { var r = new p(e); if (r.push(t, !0), r.err) throw r.msg || n[r.err]; return r.result } p.prototype.push = function (t, e) { var r, i, n = this.strm, s = this.options.chunkSize; if (this.ended) return !1; i = e === ~~e ? e : !0 === e ? 4 : 0, "string" == typeof t ? n.input = h.string2buf(t) : "[object ArrayBuffer]" === u.call(t) ? n.input = new Uint8Array(t) : n.input = t, n.next_in = 0, n.avail_in = n.input.length; do { if (0 === n.avail_out && (n.output = new o.Buf8(s), n.next_out = 0, n.avail_out = s), 1 !== (r = a.deflate(n, i)) && r !== l) return this.onEnd(r), !(this.ended = !0); 0 !== n.avail_out && (0 !== n.avail_in || 4 !== i && 2 !== i) || ("string" === this.options.to ? this.onData(h.buf2binstring(o.shrinkBuf(n.output, n.next_out))) : this.onData(o.shrinkBuf(n.output, n.next_out))) } while ((0 < n.avail_in || 0 === n.avail_out) && 1 !== r); return 4 === i ? (r = a.deflateEnd(this.strm), this.onEnd(r), this.ended = !0, r === l) : 2 !== i || (this.onEnd(l), !(n.avail_out = 0)) }, p.prototype.onData = function (t) { this.chunks.push(t) }, p.prototype.onEnd = function (t) { t === l && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = o.flattenChunks(this.chunks)), this.chunks = [], this.err = t, this.msg = this.strm.msg }, r.Deflate = p, r.deflate = i, r.deflateRaw = function (t, e) { return (e = e || {}).raw = !0, i(t, e) }, r.gzip = function (t, e) { return (e = e || {}).gzip = !0, i(t, e) } }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function (t, e, r) { "use strict"; var d = t("./zlib/inflate"), c = t("./utils/common"), p = t("./utils/strings"), m = t("./zlib/constants"), i = t("./zlib/messages"), n = t("./zlib/zstream"), s = t("./zlib/gzheader"), _ = Object.prototype.toString; function a(t) { if (!(this instanceof a)) return new a(t); this.options = c.assign({ chunkSize: 16384, windowBits: 0, to: "" }, t || {}); var e = this.options; e.raw && 0 <= e.windowBits && e.windowBits < 16 && (e.windowBits = -e.windowBits, 0 === e.windowBits && (e.windowBits = -15)), !(0 <= e.windowBits && e.windowBits < 16) || t && t.windowBits || (e.windowBits += 32), 15 < e.windowBits && e.windowBits < 48 && 0 == (15 & e.windowBits) && (e.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new n, this.strm.avail_out = 0; var r = d.inflateInit2(this.strm, e.windowBits); if (r !== m.Z_OK) throw new Error(i[r]); this.header = new s, d.inflateGetHeader(this.strm, this.header) } function o(t, e) { var r = new a(e); if (r.push(t, !0), r.err) throw r.msg || i[r.err]; return r.result } a.prototype.push = function (t, e) { var r, i, n, s, a, o, h = this.strm, u = this.options.chunkSize, l = this.options.dictionary, f = !1; if (this.ended) return !1; i = e === ~~e ? e : !0 === e ? m.Z_FINISH : m.Z_NO_FLUSH, "string" == typeof t ? h.input = p.binstring2buf(t) : "[object ArrayBuffer]" === _.call(t) ? h.input = new Uint8Array(t) : h.input = t, h.next_in = 0, h.avail_in = h.input.length; do { if (0 === h.avail_out && (h.output = new c.Buf8(u), h.next_out = 0, h.avail_out = u), (r = d.inflate(h, m.Z_NO_FLUSH)) === m.Z_NEED_DICT && l && (o = "string" == typeof l ? p.string2buf(l) : "[object ArrayBuffer]" === _.call(l) ? new Uint8Array(l) : l, r = d.inflateSetDictionary(this.strm, o)), r === m.Z_BUF_ERROR && !0 === f && (r = m.Z_OK, f = !1), r !== m.Z_STREAM_END && r !== m.Z_OK) return this.onEnd(r), !(this.ended = !0); h.next_out && (0 !== h.avail_out && r !== m.Z_STREAM_END && (0 !== h.avail_in || i !== m.Z_FINISH && i !== m.Z_SYNC_FLUSH) || ("string" === this.options.to ? (n = p.utf8border(h.output, h.next_out), s = h.next_out - n, a = p.buf2string(h.output, n), h.next_out = s, h.avail_out = u - s, s && c.arraySet(h.output, h.output, n, s, 0), this.onData(a)) : this.onData(c.shrinkBuf(h.output, h.next_out)))), 0 === h.avail_in && 0 === h.avail_out && (f = !0) } while ((0 < h.avail_in || 0 === h.avail_out) && r !== m.Z_STREAM_END); return r === m.Z_STREAM_END && (i = m.Z_FINISH), i === m.Z_FINISH ? (r = d.inflateEnd(this.strm), this.onEnd(r), this.ended = !0, r === m.Z_OK) : i !== m.Z_SYNC_FLUSH || (this.onEnd(m.Z_OK), !(h.avail_out = 0)) }, a.prototype.onData = function (t) { this.chunks.push(t) }, a.prototype.onEnd = function (t) { t === m.Z_OK && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = c.flattenChunks(this.chunks)), this.chunks = [], this.err = t, this.msg = this.strm.msg }, r.Inflate = a, r.inflate = o, r.inflateRaw = function (t, e) { return (e = e || {}).raw = !0, o(t, e) }, r.ungzip = o }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function (t, e, r) { "use strict"; var i = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array; r.assign = function (t) { for (var e = Array.prototype.slice.call(arguments, 1); e.length;) { var r = e.shift(); if (r) { if ("object" != typeof r) throw new TypeError(r + "must be non-object"); for (var i in r) r.hasOwnProperty(i) && (t[i] = r[i]) } } return t }, r.shrinkBuf = function (t, e) { return t.length === e ? t : t.subarray ? t.subarray(0, e) : (t.length = e, t) }; var n = { arraySet: function (t, e, r, i, n) { if (e.subarray && t.subarray) t.set(e.subarray(r, r + i), n); else for (var s = 0; s < i; s++)t[n + s] = e[r + s] }, flattenChunks: function (t) { var e, r, i, n, s, a; for (e = i = 0, r = t.length; e < r; e++)i += t[e].length; for (a = new Uint8Array(i), e = n = 0, r = t.length; e < r; e++)s = t[e], a.set(s, n), n += s.length; return a } }, s = { arraySet: function (t, e, r, i, n) { for (var s = 0; s < i; s++)t[n + s] = e[r + s] }, flattenChunks: function (t) { return [].concat.apply([], t) } }; r.setTyped = function (t) { t ? (r.Buf8 = Uint8Array, r.Buf16 = Uint16Array, r.Buf32 = Int32Array, r.assign(r, n)) : (r.Buf8 = Array, r.Buf16 = Array, r.Buf32 = Array, r.assign(r, s)) }, r.setTyped(i) }, {}], 42: [function (t, e, r) { "use strict"; var h = t("./common"), n = !0, s = !0; try { String.fromCharCode.apply(null, [0]) } catch (t) { n = !1 } try { String.fromCharCode.apply(null, new Uint8Array(1)) } catch (t) { s = !1 } for (var u = new h.Buf8(256), i = 0; i < 256; i++)u[i] = 252 <= i ? 6 : 248 <= i ? 5 : 240 <= i ? 4 : 224 <= i ? 3 : 192 <= i ? 2 : 1; function l(t, e) { if (e < 65537 && (t.subarray && s || !t.subarray && n)) return String.fromCharCode.apply(null, h.shrinkBuf(t, e)); for (var r = "", i = 0; i < e; i++)r += String.fromCharCode(t[i]); return r } u[254] = u[254] = 1, r.string2buf = function (t) { var e, r, i, n, s, a = t.length, o = 0; for (n = 0; n < a; n++)55296 == (64512 & (r = t.charCodeAt(n))) && n + 1 < a && 56320 == (64512 & (i = t.charCodeAt(n + 1))) && (r = 65536 + (r - 55296 << 10) + (i - 56320), n++), o += r < 128 ? 1 : r < 2048 ? 2 : r < 65536 ? 3 : 4; for (e = new h.Buf8(o), n = s = 0; s < o; n++)55296 == (64512 & (r = t.charCodeAt(n))) && n + 1 < a && 56320 == (64512 & (i = t.charCodeAt(n + 1))) && (r = 65536 + (r - 55296 << 10) + (i - 56320), n++), r < 128 ? e[s++] = r : (r < 2048 ? e[s++] = 192 | r >>> 6 : (r < 65536 ? e[s++] = 224 | r >>> 12 : (e[s++] = 240 | r >>> 18, e[s++] = 128 | r >>> 12 & 63), e[s++] = 128 | r >>> 6 & 63), e[s++] = 128 | 63 & r); return e }, r.buf2binstring = function (t) { return l(t, t.length) }, r.binstring2buf = function (t) { for (var e = new h.Buf8(t.length), r = 0, i = e.length; r < i; r++)e[r] = t.charCodeAt(r); return e }, r.buf2string = function (t, e) { var r, i, n, s, a = e || t.length, o = new Array(2 * a); for (r = i = 0; r < a;)if ((n = t[r++]) < 128) o[i++] = n; else if (4 < (s = u[n])) o[i++] = 65533, r += s - 1; else { for (n &= 2 === s ? 31 : 3 === s ? 15 : 7; 1 < s && r < a;)n = n << 6 | 63 & t[r++], s--; 1 < s ? o[i++] = 65533 : n < 65536 ? o[i++] = n : (n -= 65536, o[i++] = 55296 | n >> 10 & 1023, o[i++] = 56320 | 1023 & n) } return l(o, i) }, r.utf8border = function (t, e) { var r; for ((e = e || t.length) > t.length && (e = t.length), r = e - 1; 0 <= r && 128 == (192 & t[r]);)r--; return r < 0 ? e : 0 === r ? e : r + u[t[r]] > e ? r : e } }, { "./common": 41 }], 43: [function (t, e, r) { "use strict"; e.exports = function (t, e, r, i) { for (var n = 65535 & t | 0, s = t >>> 16 & 65535 | 0, a = 0; 0 !== r;) { for (r -= a = 2e3 < r ? 2e3 : r; s = s + (n = n + e[i++] | 0) | 0, --a;); n %= 65521, s %= 65521 } return n | s << 16 | 0 } }, {}], 44: [function (t, e, r) { "use strict"; e.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 } }, {}], 45: [function (t, e, r) { "use strict"; var o = function () { for (var t, e = [], r = 0; r < 256; r++) { t = r; for (var i = 0; i < 8; i++)t = 1 & t ? 3988292384 ^ t >>> 1 : t >>> 1; e[r] = t } return e }(); e.exports = function (t, e, r, i) { var n = o, s = i + r; t ^= -1; for (var a = i; a < s; a++)t = t >>> 8 ^ n[255 & (t ^ e[a])]; return -1 ^ t } }, {}], 46: [function (t, e, r) { "use strict"; var h, d = t("../utils/common"), u = t("./trees"), c = t("./adler32"), p = t("./crc32"), i = t("./messages"), l = 0, f = 4, m = 0, _ = -2, g = -1, b = 4, n = 2, v = 8, y = 9, s = 286, a = 30, o = 19, w = 2 * s + 1, k = 15, x = 3, S = 258, z = S + x + 1, C = 42, E = 113, A = 1, I = 2, O = 3, B = 4; function R(t, e) { return t.msg = i[e], e } function T(t) { return (t << 1) - (4 < t ? 9 : 0) } function D(t) { for (var e = t.length; 0 <= --e;)t[e] = 0 } function F(t) { var e = t.state, r = e.pending; r > t.avail_out && (r = t.avail_out), 0 !== r && (d.arraySet(t.output, e.pending_buf, e.pending_out, r, t.next_out), t.next_out += r, e.pending_out += r, t.total_out += r, t.avail_out -= r, e.pending -= r, 0 === e.pending && (e.pending_out = 0)) } function N(t, e) { u._tr_flush_block(t, 0 <= t.block_start ? t.block_start : -1, t.strstart - t.block_start, e), t.block_start = t.strstart, F(t.strm) } function U(t, e) { t.pending_buf[t.pending++] = e } function P(t, e) { t.pending_buf[t.pending++] = e >>> 8 & 255, t.pending_buf[t.pending++] = 255 & e } function L(t, e) { var r, i, n = t.max_chain_length, s = t.strstart, a = t.prev_length, o = t.nice_match, h = t.strstart > t.w_size - z ? t.strstart - (t.w_size - z) : 0, u = t.window, l = t.w_mask, f = t.prev, d = t.strstart + S, c = u[s + a - 1], p = u[s + a]; t.prev_length >= t.good_match && (n >>= 2), o > t.lookahead && (o = t.lookahead); do { if (u[(r = e) + a] === p && u[r + a - 1] === c && u[r] === u[s] && u[++r] === u[s + 1]) { s += 2, r++; do { } while (u[++s] === u[++r] && u[++s] === u[++r] && u[++s] === u[++r] && u[++s] === u[++r] && u[++s] === u[++r] && u[++s] === u[++r] && u[++s] === u[++r] && u[++s] === u[++r] && s < d); if (i = S - (d - s), s = d - S, a < i) { if (t.match_start = e, o <= (a = i)) break; c = u[s + a - 1], p = u[s + a] } } } while ((e = f[e & l]) > h && 0 != --n); return a <= t.lookahead ? a : t.lookahead } function j(t) { var e, r, i, n, s, a, o, h, u, l, f = t.w_size; do { if (n = t.window_size - t.lookahead - t.strstart, t.strstart >= f + (f - z)) { for (d.arraySet(t.window, t.window, f, f, 0), t.match_start -= f, t.strstart -= f, t.block_start -= f, e = r = t.hash_size; i = t.head[--e], t.head[e] = f <= i ? i - f : 0, --r;); for (e = r = f; i = t.prev[--e], t.prev[e] = f <= i ? i - f : 0, --r;); n += f } if (0 === t.strm.avail_in) break; if (a = t.strm, o = t.window, h = t.strstart + t.lookahead, u = n, l = void 0, l = a.avail_in, u < l && (l = u), r = 0 === l ? 0 : (a.avail_in -= l, d.arraySet(o, a.input, a.next_in, l, h), 1 === a.state.wrap ? a.adler = c(a.adler, o, l, h) : 2 === a.state.wrap && (a.adler = p(a.adler, o, l, h)), a.next_in += l, a.total_in += l, l), t.lookahead += r, t.lookahead + t.insert >= x) for (s = t.strstart - t.insert, t.ins_h = t.window[s], t.ins_h = (t.ins_h << t.hash_shift ^ t.window[s + 1]) & t.hash_mask; t.insert && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[s + x - 1]) & t.hash_mask, t.prev[s & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = s, s++, t.insert--, !(t.lookahead + t.insert < x));); } while (t.lookahead < z && 0 !== t.strm.avail_in) } function Z(t, e) { for (var r, i; ;) { if (t.lookahead < z) { if (j(t), t.lookahead < z && e === l) return A; if (0 === t.lookahead) break } if (r = 0, t.lookahead >= x && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + x - 1]) & t.hash_mask, r = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), 0 !== r && t.strstart - r <= t.w_size - z && (t.match_length = L(t, r)), t.match_length >= x) if (i = u._tr_tally(t, t.strstart - t.match_start, t.match_length - x), t.lookahead -= t.match_length, t.match_length <= t.max_lazy_match && t.lookahead >= x) { for (t.match_length--; t.strstart++, t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + x - 1]) & t.hash_mask, r = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart, 0 != --t.match_length;); t.strstart++ } else t.strstart += t.match_length, t.match_length = 0, t.ins_h = t.window[t.strstart], t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + 1]) & t.hash_mask; else i = u._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++; if (i && (N(t, !1), 0 === t.strm.avail_out)) return A } return t.insert = t.strstart < x - 1 ? t.strstart : x - 1, e === f ? (N(t, !0), 0 === t.strm.avail_out ? O : B) : t.last_lit && (N(t, !1), 0 === t.strm.avail_out) ? A : I } function W(t, e) { for (var r, i, n; ;) { if (t.lookahead < z) { if (j(t), t.lookahead < z && e === l) return A; if (0 === t.lookahead) break } if (r = 0, t.lookahead >= x && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + x - 1]) & t.hash_mask, r = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), t.prev_length = t.match_length, t.prev_match = t.match_start, t.match_length = x - 1, 0 !== r && t.prev_length < t.max_lazy_match && t.strstart - r <= t.w_size - z && (t.match_length = L(t, r), t.match_length <= 5 && (1 === t.strategy || t.match_length === x && 4096 < t.strstart - t.match_start) && (t.match_length = x - 1)), t.prev_length >= x && t.match_length <= t.prev_length) { for (n = t.strstart + t.lookahead - x, i = u._tr_tally(t, t.strstart - 1 - t.prev_match, t.prev_length - x), t.lookahead -= t.prev_length - 1, t.prev_length -= 2; ++t.strstart <= n && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + x - 1]) & t.hash_mask, r = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), 0 != --t.prev_length;); if (t.match_available = 0, t.match_length = x - 1, t.strstart++, i && (N(t, !1), 0 === t.strm.avail_out)) return A } else if (t.match_available) { if ((i = u._tr_tally(t, 0, t.window[t.strstart - 1])) && N(t, !1), t.strstart++, t.lookahead--, 0 === t.strm.avail_out) return A } else t.match_available = 1, t.strstart++, t.lookahead-- } return t.match_available && (i = u._tr_tally(t, 0, t.window[t.strstart - 1]), t.match_available = 0), t.insert = t.strstart < x - 1 ? t.strstart : x - 1, e === f ? (N(t, !0), 0 === t.strm.avail_out ? O : B) : t.last_lit && (N(t, !1), 0 === t.strm.avail_out) ? A : I } function M(t, e, r, i, n) { this.good_length = t, this.max_lazy = e, this.nice_length = r, this.max_chain = i, this.func = n } function H() { this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = v, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new d.Buf16(2 * w), this.dyn_dtree = new d.Buf16(2 * (2 * a + 1)), this.bl_tree = new d.Buf16(2 * (2 * o + 1)), D(this.dyn_ltree), D(this.dyn_dtree), D(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new d.Buf16(k + 1), this.heap = new d.Buf16(2 * s + 1), D(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new d.Buf16(2 * s + 1), D(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0 } function G(t) { var e; return t && t.state ? (t.total_in = t.total_out = 0, t.data_type = n, (e = t.state).pending = 0, e.pending_out = 0, e.wrap < 0 && (e.wrap = -e.wrap), e.status = e.wrap ? C : E, t.adler = 2 === e.wrap ? 0 : 1, e.last_flush = l, u._tr_init(e), m) : R(t, _) } function K(t) { var e = G(t); return e === m && function (t) { t.window_size = 2 * t.w_size, D(t.head), t.max_lazy_match = h[t.level].max_lazy, t.good_match = h[t.level].good_length, t.nice_match = h[t.level].nice_length, t.max_chain_length = h[t.level].max_chain, t.strstart = 0, t.block_start = 0, t.lookahead = 0, t.insert = 0, t.match_length = t.prev_length = x - 1, t.match_available = 0, t.ins_h = 0 }(t.state), e } function Y(t, e, r, i, n, s) { if (!t) return _; var a = 1; if (e === g && (e = 6), i < 0 ? (a = 0, i = -i) : 15 < i && (a = 2, i -= 16), n < 1 || y < n || r !== v || i < 8 || 15 < i || e < 0 || 9 < e || s < 0 || b < s) return R(t, _); 8 === i && (i = 9); var o = new H; return (t.state = o).strm = t, o.wrap = a, o.gzhead = null, o.w_bits = i, o.w_size = 1 << o.w_bits, o.w_mask = o.w_size - 1, o.hash_bits = n + 7, o.hash_size = 1 << o.hash_bits, o.hash_mask = o.hash_size - 1, o.hash_shift = ~~((o.hash_bits + x - 1) / x), o.window = new d.Buf8(2 * o.w_size), o.head = new d.Buf16(o.hash_size), o.prev = new d.Buf16(o.w_size), o.lit_bufsize = 1 << n + 6, o.pending_buf_size = 4 * o.lit_bufsize, o.pending_buf = new d.Buf8(o.pending_buf_size), o.d_buf = 1 * o.lit_bufsize, o.l_buf = 3 * o.lit_bufsize, o.level = e, o.strategy = s, o.method = r, K(t) } h = [new M(0, 0, 0, 0, function (t, e) { var r = 65535; for (r > t.pending_buf_size - 5 && (r = t.pending_buf_size - 5); ;) { if (t.lookahead <= 1) { if (j(t), 0 === t.lookahead && e === l) return A; if (0 === t.lookahead) break } t.strstart += t.lookahead, t.lookahead = 0; var i = t.block_start + r; if ((0 === t.strstart || t.strstart >= i) && (t.lookahead = t.strstart - i, t.strstart = i, N(t, !1), 0 === t.strm.avail_out)) return A; if (t.strstart - t.block_start >= t.w_size - z && (N(t, !1), 0 === t.strm.avail_out)) return A } return t.insert = 0, e === f ? (N(t, !0), 0 === t.strm.avail_out ? O : B) : (t.strstart > t.block_start && (N(t, !1), t.strm.avail_out), A) }), new M(4, 4, 8, 4, Z), new M(4, 5, 16, 8, Z), new M(4, 6, 32, 32, Z), new M(4, 4, 16, 16, W), new M(8, 16, 32, 32, W), new M(8, 16, 128, 128, W), new M(8, 32, 128, 256, W), new M(32, 128, 258, 1024, W), new M(32, 258, 258, 4096, W)], r.deflateInit = function (t, e) { return Y(t, e, v, 15, 8, 0) }, r.deflateInit2 = Y, r.deflateReset = K, r.deflateResetKeep = G, r.deflateSetHeader = function (t, e) { return t && t.state ? 2 !== t.state.wrap ? _ : (t.state.gzhead = e, m) : _ }, r.deflate = function (t, e) { var r, i, n, s; if (!t || !t.state || 5 < e || e < 0) return t ? R(t, _) : _; if (i = t.state, !t.output || !t.input && 0 !== t.avail_in || 666 === i.status && e !== f) return R(t, 0 === t.avail_out ? -5 : _); if (i.strm = t, r = i.last_flush, i.last_flush = e, i.status === C) if (2 === i.wrap) t.adler = 0, U(i, 31), U(i, 139), U(i, 8), i.gzhead ? (U(i, (i.gzhead.text ? 1 : 0) + (i.gzhead.hcrc ? 2 : 0) + (i.gzhead.extra ? 4 : 0) + (i.gzhead.name ? 8 : 0) + (i.gzhead.comment ? 16 : 0)), U(i, 255 & i.gzhead.time), U(i, i.gzhead.time >> 8 & 255), U(i, i.gzhead.time >> 16 & 255), U(i, i.gzhead.time >> 24 & 255), U(i, 9 === i.level ? 2 : 2 <= i.strategy || i.level < 2 ? 4 : 0), U(i, 255 & i.gzhead.os), i.gzhead.extra && i.gzhead.extra.length && (U(i, 255 & i.gzhead.extra.length), U(i, i.gzhead.extra.length >> 8 & 255)), i.gzhead.hcrc && (t.adler = p(t.adler, i.pending_buf, i.pending, 0)), i.gzindex = 0, i.status = 69) : (U(i, 0), U(i, 0), U(i, 0), U(i, 0), U(i, 0), U(i, 9 === i.level ? 2 : 2 <= i.strategy || i.level < 2 ? 4 : 0), U(i, 3), i.status = E); else { var a = v + (i.w_bits - 8 << 4) << 8; a |= (2 <= i.strategy || i.level < 2 ? 0 : i.level < 6 ? 1 : 6 === i.level ? 2 : 3) << 6, 0 !== i.strstart && (a |= 32), a += 31 - a % 31, i.status = E, P(i, a), 0 !== i.strstart && (P(i, t.adler >>> 16), P(i, 65535 & t.adler)), t.adler = 1 } if (69 === i.status) if (i.gzhead.extra) { for (n = i.pending; i.gzindex < (65535 & i.gzhead.extra.length) && (i.pending !== i.pending_buf_size || (i.gzhead.hcrc && i.pending > n && (t.adler = p(t.adler, i.pending_buf, i.pending - n, n)), F(t), n = i.pending, i.pending !== i.pending_buf_size));)U(i, 255 & i.gzhead.extra[i.gzindex]), i.gzindex++; i.gzhead.hcrc && i.pending > n && (t.adler = p(t.adler, i.pending_buf, i.pending - n, n)), i.gzindex === i.gzhead.extra.length && (i.gzindex = 0, i.status = 73) } else i.status = 73; if (73 === i.status) if (i.gzhead.name) { n = i.pending; do { if (i.pending === i.pending_buf_size && (i.gzhead.hcrc && i.pending > n && (t.adler = p(t.adler, i.pending_buf, i.pending - n, n)), F(t), n = i.pending, i.pending === i.pending_buf_size)) { s = 1; break } s = i.gzindex < i.gzhead.name.length ? 255 & i.gzhead.name.charCodeAt(i.gzindex++) : 0, U(i, s) } while (0 !== s); i.gzhead.hcrc && i.pending > n && (t.adler = p(t.adler, i.pending_buf, i.pending - n, n)), 0 === s && (i.gzindex = 0, i.status = 91) } else i.status = 91; if (91 === i.status) if (i.gzhead.comment) { n = i.pending; do { if (i.pending === i.pending_buf_size && (i.gzhead.hcrc && i.pending > n && (t.adler = p(t.adler, i.pending_buf, i.pending - n, n)), F(t), n = i.pending, i.pending === i.pending_buf_size)) { s = 1; break } s = i.gzindex < i.gzhead.comment.length ? 255 & i.gzhead.comment.charCodeAt(i.gzindex++) : 0, U(i, s) } while (0 !== s); i.gzhead.hcrc && i.pending > n && (t.adler = p(t.adler, i.pending_buf, i.pending - n, n)), 0 === s && (i.status = 103) } else i.status = 103; if (103 === i.status && (i.gzhead.hcrc ? (i.pending + 2 > i.pending_buf_size && F(t), i.pending + 2 <= i.pending_buf_size && (U(i, 255 & t.adler), U(i, t.adler >> 8 & 255), t.adler = 0, i.status = E)) : i.status = E), 0 !== i.pending) { if (F(t), 0 === t.avail_out) return i.last_flush = -1, m } else if (0 === t.avail_in && T(e) <= T(r) && e !== f) return R(t, -5); if (666 === i.status && 0 !== t.avail_in) return R(t, -5); if (0 !== t.avail_in || 0 !== i.lookahead || e !== l && 666 !== i.status) { var o = 2 === i.strategy ? function (t, e) { for (var r; ;) { if (0 === t.lookahead && (j(t), 0 === t.lookahead)) { if (e === l) return A; break } if (t.match_length = 0, r = u._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++, r && (N(t, !1), 0 === t.strm.avail_out)) return A } return t.insert = 0, e === f ? (N(t, !0), 0 === t.strm.avail_out ? O : B) : t.last_lit && (N(t, !1), 0 === t.strm.avail_out) ? A : I }(i, e) : 3 === i.strategy ? function (t, e) { for (var r, i, n, s, a = t.window; ;) { if (t.lookahead <= S) { if (j(t), t.lookahead <= S && e === l) return A; if (0 === t.lookahead) break } if (t.match_length = 0, t.lookahead >= x && 0 < t.strstart && (i = a[n = t.strstart - 1]) === a[++n] && i === a[++n] && i === a[++n]) { s = t.strstart + S; do { } while (i === a[++n] && i === a[++n] && i === a[++n] && i === a[++n] && i === a[++n] && i === a[++n] && i === a[++n] && i === a[++n] && n < s); t.match_length = S - (s - n), t.match_length > t.lookahead && (t.match_length = t.lookahead) } if (t.match_length >= x ? (r = u._tr_tally(t, 1, t.match_length - x), t.lookahead -= t.match_length, t.strstart += t.match_length, t.match_length = 0) : (r = u._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++), r && (N(t, !1), 0 === t.strm.avail_out)) return A } return t.insert = 0, e === f ? (N(t, !0), 0 === t.strm.avail_out ? O : B) : t.last_lit && (N(t, !1), 0 === t.strm.avail_out) ? A : I }(i, e) : h[i.level].func(i, e); if (o !== O && o !== B || (i.status = 666), o === A || o === O) return 0 === t.avail_out && (i.last_flush = -1), m; if (o === I && (1 === e ? u._tr_align(i) : 5 !== e && (u._tr_stored_block(i, 0, 0, !1), 3 === e && (D(i.head), 0 === i.lookahead && (i.strstart = 0, i.block_start = 0, i.insert = 0))), F(t), 0 === t.avail_out)) return i.last_flush = -1, m } return e !== f ? m : i.wrap <= 0 ? 1 : (2 === i.wrap ? (U(i, 255 & t.adler), U(i, t.adler >> 8 & 255), U(i, t.adler >> 16 & 255), U(i, t.adler >> 24 & 255), U(i, 255 & t.total_in), U(i, t.total_in >> 8 & 255), U(i, t.total_in >> 16 & 255), U(i, t.total_in >> 24 & 255)) : (P(i, t.adler >>> 16), P(i, 65535 & t.adler)), F(t), 0 < i.wrap && (i.wrap = -i.wrap), 0 !== i.pending ? m : 1) }, r.deflateEnd = function (t) { var e; return t && t.state ? (e = t.state.status) !== C && 69 !== e && 73 !== e && 91 !== e && 103 !== e && e !== E && 666 !== e ? R(t, _) : (t.state = null, e === E ? R(t, -3) : m) : _ }, r.deflateSetDictionary = function (t, e) { var r, i, n, s, a, o, h, u, l = e.length; if (!t || !t.state) return _; if (2 === (s = (r = t.state).wrap) || 1 === s && r.status !== C || r.lookahead) return _; for (1 === s && (t.adler = c(t.adler, e, l, 0)), r.wrap = 0, l >= r.w_size && (0 === s && (D(r.head), r.strstart = 0, r.block_start = 0, r.insert = 0), u = new d.Buf8(r.w_size), d.arraySet(u, e, l - r.w_size, r.w_size, 0), e = u, l = r.w_size), a = t.avail_in, o = t.next_in, h = t.input, t.avail_in = l, t.next_in = 0, t.input = e, j(r); r.lookahead >= x;) { for (i = r.strstart, n = r.lookahead - (x - 1); r.ins_h = (r.ins_h << r.hash_shift ^ r.window[i + x - 1]) & r.hash_mask, r.prev[i & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = i, i++, --n;); r.strstart = i, r.lookahead = x - 1, j(r) } return r.strstart += r.lookahead, r.block_start = r.strstart, r.insert = r.lookahead, r.lookahead = 0, r.match_length = r.prev_length = x - 1, r.match_available = 0, t.next_in = o, t.input = h, t.avail_in = a, r.wrap = s, m }, r.deflateInfo = "pako deflate (from Nodeca project)" }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function (t, e, r) { "use strict"; e.exports = function () { this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1 } }, {}], 48: [function (t, e, r) { "use strict"; e.exports = function (t, e) { var r, i, n, s, a, o, h, u, l, f, d, c, p, m, _, g, b, v, y, w, k, x, S, z, C; r = t.state, i = t.next_in, z = t.input, n = i + (t.avail_in - 5), s = t.next_out, C = t.output, a = s - (e - t.avail_out), o = s + (t.avail_out - 257), h = r.dmax, u = r.wsize, l = r.whave, f = r.wnext, d = r.window, c = r.hold, p = r.bits, m = r.lencode, _ = r.distcode, g = (1 << r.lenbits) - 1, b = (1 << r.distbits) - 1; t: do { p < 15 && (c += z[i++] << p, p += 8, c += z[i++] << p, p += 8), v = m[c & g]; e: for (; ;) { if (c >>>= y = v >>> 24, p -= y, 0 === (y = v >>> 16 & 255)) C[s++] = 65535 & v; else { if (!(16 & y)) { if (0 == (64 & y)) { v = m[(65535 & v) + (c & (1 << y) - 1)]; continue e } if (32 & y) { r.mode = 12; break t } t.msg = "invalid literal/length code", r.mode = 30; break t } w = 65535 & v, (y &= 15) && (p < y && (c += z[i++] << p, p += 8), w += c & (1 << y) - 1, c >>>= y, p -= y), p < 15 && (c += z[i++] << p, p += 8, c += z[i++] << p, p += 8), v = _[c & b]; r: for (; ;) { if (c >>>= y = v >>> 24, p -= y, !(16 & (y = v >>> 16 & 255))) { if (0 == (64 & y)) { v = _[(65535 & v) + (c & (1 << y) - 1)]; continue r } t.msg = "invalid distance code", r.mode = 30; break t } if (k = 65535 & v, p < (y &= 15) && (c += z[i++] << p, (p += 8) < y && (c += z[i++] << p, p += 8)), h < (k += c & (1 << y) - 1)) { t.msg = "invalid distance too far back", r.mode = 30; break t } if (c >>>= y, p -= y, (y = s - a) < k) { if (l < (y = k - y) && r.sane) { t.msg = "invalid distance too far back", r.mode = 30; break t } if (S = d, (x = 0) === f) { if (x += u - y, y < w) { for (w -= y; C[s++] = d[x++], --y;); x = s - k, S = C } } else if (f < y) { if (x += u + f - y, (y -= f) < w) { for (w -= y; C[s++] = d[x++], --y;); if (x = 0, f < w) { for (w -= y = f; C[s++] = d[x++], --y;); x = s - k, S = C } } } else if (x += f - y, y < w) { for (w -= y; C[s++] = d[x++], --y;); x = s - k, S = C } for (; 2 < w;)C[s++] = S[x++], C[s++] = S[x++], C[s++] = S[x++], w -= 3; w && (C[s++] = S[x++], 1 < w && (C[s++] = S[x++])) } else { for (x = s - k; C[s++] = C[x++], C[s++] = C[x++], C[s++] = C[x++], 2 < (w -= 3);); w && (C[s++] = C[x++], 1 < w && (C[s++] = C[x++])) } break } } break } } while (i < n && s < o); i -= w = p >> 3, c &= (1 << (p -= w << 3)) - 1, t.next_in = i, t.next_out = s, t.avail_in = i < n ? n - i + 5 : 5 - (i - n), t.avail_out = s < o ? o - s + 257 : 257 - (s - o), r.hold = c, r.bits = p } }, {}], 49: [function (t, e, r) { "use strict"; var I = t("../utils/common"), O = t("./adler32"), B = t("./crc32"), R = t("./inffast"), T = t("./inftrees"), D = 1, F = 2, N = 0, U = -2, P = 1, i = 852, n = 592; function L(t) { return (t >>> 24 & 255) + (t >>> 8 & 65280) + ((65280 & t) << 8) + ((255 & t) << 24) } function s() { this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new I.Buf16(320), this.work = new I.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0 } function a(t) { var e; return t && t.state ? (e = t.state, t.total_in = t.total_out = e.total = 0, t.msg = "", e.wrap && (t.adler = 1 & e.wrap), e.mode = P, e.last = 0, e.havedict = 0, e.dmax = 32768, e.head = null, e.hold = 0, e.bits = 0, e.lencode = e.lendyn = new I.Buf32(i), e.distcode = e.distdyn = new I.Buf32(n), e.sane = 1, e.back = -1, N) : U } function o(t) { var e; return t && t.state ? ((e = t.state).wsize = 0, e.whave = 0, e.wnext = 0, a(t)) : U } function h(t, e) { var r, i; return t && t.state ? (i = t.state, e < 0 ? (r = 0, e = -e) : (r = 1 + (e >> 4), e < 48 && (e &= 15)), e && (e < 8 || 15 < e) ? U : (null !== i.window && i.wbits !== e && (i.window = null), i.wrap = r, i.wbits = e, o(t))) : U } function u(t, e) { var r, i; return t ? (i = new s, (t.state = i).window = null, (r = h(t, e)) !== N && (t.state = null), r) : U } var l, f, d = !0; function j(t) { if (d) { var e; for (l = new I.Buf32(512), f = new I.Buf32(32), e = 0; e < 144;)t.lens[e++] = 8; for (; e < 256;)t.lens[e++] = 9; for (; e < 280;)t.lens[e++] = 7; for (; e < 288;)t.lens[e++] = 8; for (T(D, t.lens, 0, 288, l, 0, t.work, { bits: 9 }), e = 0; e < 32;)t.lens[e++] = 5; T(F, t.lens, 0, 32, f, 0, t.work, { bits: 5 }), d = !1 } t.lencode = l, t.lenbits = 9, t.distcode = f, t.distbits = 5 } function Z(t, e, r, i) { var n, s = t.state; return null === s.window && (s.wsize = 1 << s.wbits, s.wnext = 0, s.whave = 0, s.window = new I.Buf8(s.wsize)), i >= s.wsize ? (I.arraySet(s.window, e, r - s.wsize, s.wsize, 0), s.wnext = 0, s.whave = s.wsize) : (i < (n = s.wsize - s.wnext) && (n = i), I.arraySet(s.window, e, r - i, n, s.wnext), (i -= n) ? (I.arraySet(s.window, e, r - i, i, 0), s.wnext = i, s.whave = s.wsize) : (s.wnext += n, s.wnext === s.wsize && (s.wnext = 0), s.whave < s.wsize && (s.whave += n))), 0 } r.inflateReset = o, r.inflateReset2 = h, r.inflateResetKeep = a, r.inflateInit = function (t) { return u(t, 15) }, r.inflateInit2 = u, r.inflate = function (t, e) { var r, i, n, s, a, o, h, u, l, f, d, c, p, m, _, g, b, v, y, w, k, x, S, z, C = 0, E = new I.Buf8(4), A = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]; if (!t || !t.state || !t.output || !t.input && 0 !== t.avail_in) return U; 12 === (r = t.state).mode && (r.mode = 13), a = t.next_out, n = t.output, h = t.avail_out, s = t.next_in, i = t.input, o = t.avail_in, u = r.hold, l = r.bits, f = o, d = h, x = N; t: for (; ;)switch (r.mode) { case P: if (0 === r.wrap) { r.mode = 13; break } for (; l < 16;) { if (0 === o) break t; o--, u += i[s++] << l, l += 8 } if (2 & r.wrap && 35615 === u) { E[r.check = 0] = 255 & u, E[1] = u >>> 8 & 255, r.check = B(r.check, E, 2, 0), l = u = 0, r.mode = 2; break } if (r.flags = 0, r.head && (r.head.done = !1), !(1 & r.wrap) || (((255 & u) << 8) + (u >> 8)) % 31) { t.msg = "incorrect header check", r.mode = 30; break } if (8 != (15 & u)) { t.msg = "unknown compression method", r.mode = 30; break } if (l -= 4, k = 8 + (15 & (u >>>= 4)), 0 === r.wbits) r.wbits = k; else if (k > r.wbits) { t.msg = "invalid window size", r.mode = 30; break } r.dmax = 1 << k, t.adler = r.check = 1, r.mode = 512 & u ? 10 : 12, l = u = 0; break; case 2: for (; l < 16;) { if (0 === o) break t; o--, u += i[s++] << l, l += 8 } if (r.flags = u, 8 != (255 & r.flags)) { t.msg = "unknown compression method", r.mode = 30; break } if (57344 & r.flags) { t.msg = "unknown header flags set", r.mode = 30; break } r.head && (r.head.text = u >> 8 & 1), 512 & r.flags && (E[0] = 255 & u, E[1] = u >>> 8 & 255, r.check = B(r.check, E, 2, 0)), l = u = 0, r.mode = 3; case 3: for (; l < 32;) { if (0 === o) break t; o--, u += i[s++] << l, l += 8 } r.head && (r.head.time = u), 512 & r.flags && (E[0] = 255 & u, E[1] = u >>> 8 & 255, E[2] = u >>> 16 & 255, E[3] = u >>> 24 & 255, r.check = B(r.check, E, 4, 0)), l = u = 0, r.mode = 4; case 4: for (; l < 16;) { if (0 === o) break t; o--, u += i[s++] << l, l += 8 } r.head && (r.head.xflags = 255 & u, r.head.os = u >> 8), 512 & r.flags && (E[0] = 255 & u, E[1] = u >>> 8 & 255, r.check = B(r.check, E, 2, 0)), l = u = 0, r.mode = 5; case 5: if (1024 & r.flags) { for (; l < 16;) { if (0 === o) break t; o--, u += i[s++] << l, l += 8 } r.length = u, r.head && (r.head.extra_len = u), 512 & r.flags && (E[0] = 255 & u, E[1] = u >>> 8 & 255, r.check = B(r.check, E, 2, 0)), l = u = 0 } else r.head && (r.head.extra = null); r.mode = 6; case 6: if (1024 & r.flags && (o < (c = r.length) && (c = o), c && (r.head && (k = r.head.extra_len - r.length, r.head.extra || (r.head.extra = new Array(r.head.extra_len)), I.arraySet(r.head.extra, i, s, c, k)), 512 & r.flags && (r.check = B(r.check, i, c, s)), o -= c, s += c, r.length -= c), r.length)) break t; r.length = 0, r.mode = 7; case 7: if (2048 & r.flags) { if (0 === o) break t; for (c = 0; k = i[s + c++], r.head && k && r.length < 65536 && (r.head.name += String.fromCharCode(k)), k && c < o;); if (512 & r.flags && (r.check = B(r.check, i, c, s)), o -= c, s += c, k) break t } else r.head && (r.head.name = null); r.length = 0, r.mode = 8; case 8: if (4096 & r.flags) { if (0 === o) break t; for (c = 0; k = i[s + c++], r.head && k && r.length < 65536 && (r.head.comment += String.fromCharCode(k)), k && c < o;); if (512 & r.flags && (r.check = B(r.check, i, c, s)), o -= c, s += c, k) break t } else r.head && (r.head.comment = null); r.mode = 9; case 9: if (512 & r.flags) { for (; l < 16;) { if (0 === o) break t; o--, u += i[s++] << l, l += 8 } if (u !== (65535 & r.check)) { t.msg = "header crc mismatch", r.mode = 30; break } l = u = 0 } r.head && (r.head.hcrc = r.flags >> 9 & 1, r.head.done = !0), t.adler = r.check = 0, r.mode = 12; break; case 10: for (; l < 32;) { if (0 === o) break t; o--, u += i[s++] << l, l += 8 } t.adler = r.check = L(u), l = u = 0, r.mode = 11; case 11: if (0 === r.havedict) return t.next_out = a, t.avail_out = h, t.next_in = s, t.avail_in = o, r.hold = u, r.bits = l, 2; t.adler = r.check = 1, r.mode = 12; case 12: if (5 === e || 6 === e) break t; case 13: if (r.last) { u >>>= 7 & l, l -= 7 & l, r.mode = 27; break } for (; l < 3;) { if (0 === o) break t; o--, u += i[s++] << l, l += 8 } switch (r.last = 1 & u, l -= 1, 3 & (u >>>= 1)) { case 0: r.mode = 14; break; case 1: if (j(r), r.mode = 20, 6 !== e) break; u >>>= 2, l -= 2; break t; case 2: r.mode = 17; break; case 3: t.msg = "invalid block type", r.mode = 30 }u >>>= 2, l -= 2; break; case 14: for (u >>>= 7 & l, l -= 7 & l; l < 32;) { if (0 === o) break t; o--, u += i[s++] << l, l += 8 } if ((65535 & u) != (u >>> 16 ^ 65535)) { t.msg = "invalid stored block lengths", r.mode = 30; break } if (r.length = 65535 & u, l = u = 0, r.mode = 15, 6 === e) break t; case 15: r.mode = 16; case 16: if (c = r.length) { if (o < c && (c = o), h < c && (c = h), 0 === c) break t; I.arraySet(n, i, s, c, a), o -= c, s += c, h -= c, a += c, r.length -= c; break } r.mode = 12; break; case 17: for (; l < 14;) { if (0 === o) break t; o--, u += i[s++] << l, l += 8 } if (r.nlen = 257 + (31 & u), u >>>= 5, l -= 5, r.ndist = 1 + (31 & u), u >>>= 5, l -= 5, r.ncode = 4 + (15 & u), u >>>= 4, l -= 4, 286 < r.nlen || 30 < r.ndist) { t.msg = "too many length or distance symbols", r.mode = 30; break } r.have = 0, r.mode = 18; case 18: for (; r.have < r.ncode;) { for (; l < 3;) { if (0 === o) break t; o--, u += i[s++] << l, l += 8 } r.lens[A[r.have++]] = 7 & u, u >>>= 3, l -= 3 } for (; r.have < 19;)r.lens[A[r.have++]] = 0; if (r.lencode = r.lendyn, r.lenbits = 7, S = { bits: r.lenbits }, x = T(0, r.lens, 0, 19, r.lencode, 0, r.work, S), r.lenbits = S.bits, x) { t.msg = "invalid code lengths set", r.mode = 30; break } r.have = 0, r.mode = 19; case 19: for (; r.have < r.nlen + r.ndist;) { for (; g = (C = r.lencode[u & (1 << r.lenbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l);) { if (0 === o) break t; o--, u += i[s++] << l, l += 8 } if (b < 16) u >>>= _, l -= _, r.lens[r.have++] = b; else { if (16 === b) { for (z = _ + 2; l < z;) { if (0 === o) break t; o--, u += i[s++] << l, l += 8 } if (u >>>= _, l -= _, 0 === r.have) { t.msg = "invalid bit length repeat", r.mode = 30; break } k = r.lens[r.have - 1], c = 3 + (3 & u), u >>>= 2, l -= 2 } else if (17 === b) { for (z = _ + 3; l < z;) { if (0 === o) break t; o--, u += i[s++] << l, l += 8 } l -= _, k = 0, c = 3 + (7 & (u >>>= _)), u >>>= 3, l -= 3 } else { for (z = _ + 7; l < z;) { if (0 === o) break t; o--, u += i[s++] << l, l += 8 } l -= _, k = 0, c = 11 + (127 & (u >>>= _)), u >>>= 7, l -= 7 } if (r.have + c > r.nlen + r.ndist) { t.msg = "invalid bit length repeat", r.mode = 30; break } for (; c--;)r.lens[r.have++] = k } } if (30 === r.mode) break; if (0 === r.lens[256]) { t.msg = "invalid code -- missing end-of-block", r.mode = 30; break } if (r.lenbits = 9, S = { bits: r.lenbits }, x = T(D, r.lens, 0, r.nlen, r.lencode, 0, r.work, S), r.lenbits = S.bits, x) { t.msg = "invalid literal/lengths set", r.mode = 30; break } if (r.distbits = 6, r.distcode = r.distdyn, S = { bits: r.distbits }, x = T(F, r.lens, r.nlen, r.ndist, r.distcode, 0, r.work, S), r.distbits = S.bits, x) { t.msg = "invalid distances set", r.mode = 30; break } if (r.mode = 20, 6 === e) break t; case 20: r.mode = 21; case 21: if (6 <= o && 258 <= h) { t.next_out = a, t.avail_out = h, t.next_in = s, t.avail_in = o, r.hold = u, r.bits = l, R(t, d), a = t.next_out, n = t.output, h = t.avail_out, s = t.next_in, i = t.input, o = t.avail_in, u = r.hold, l = r.bits, 12 === r.mode && (r.back = -1); break } for (r.back = 0; g = (C = r.lencode[u & (1 << r.lenbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l);) { if (0 === o) break t; o--, u += i[s++] << l, l += 8 } if (g && 0 == (240 & g)) { for (v = _, y = g, w = b; g = (C = r.lencode[w + ((u & (1 << v + y) - 1) >> v)]) >>> 16 & 255, b = 65535 & C, !(v + (_ = C >>> 24) <= l);) { if (0 === o) break t; o--, u += i[s++] << l, l += 8 } u >>>= v, l -= v, r.back += v } if (u >>>= _, l -= _, r.back += _, r.length = b, 0 === g) { r.mode = 26; break } if (32 & g) { r.back = -1, r.mode = 12; break } if (64 & g) { t.msg = "invalid literal/length code", r.mode = 30; break } r.extra = 15 & g, r.mode = 22; case 22: if (r.extra) { for (z = r.extra; l < z;) { if (0 === o) break t; o--, u += i[s++] << l, l += 8 } r.length += u & (1 << r.extra) - 1, u >>>= r.extra, l -= r.extra, r.back += r.extra } r.was = r.length, r.mode = 23; case 23: for (; g = (C = r.distcode[u & (1 << r.distbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l);) { if (0 === o) break t; o--, u += i[s++] << l, l += 8 } if (0 == (240 & g)) { for (v = _, y = g, w = b; g = (C = r.distcode[w + ((u & (1 << v + y) - 1) >> v)]) >>> 16 & 255, b = 65535 & C, !(v + (_ = C >>> 24) <= l);) { if (0 === o) break t; o--, u += i[s++] << l, l += 8 } u >>>= v, l -= v, r.back += v } if (u >>>= _, l -= _, r.back += _, 64 & g) { t.msg = "invalid distance code", r.mode = 30; break } r.offset = b, r.extra = 15 & g, r.mode = 24; case 24: if (r.extra) { for (z = r.extra; l < z;) { if (0 === o) break t; o--, u += i[s++] << l, l += 8 } r.offset += u & (1 << r.extra) - 1, u >>>= r.extra, l -= r.extra, r.back += r.extra } if (r.offset > r.dmax) { t.msg = "invalid distance too far back", r.mode = 30; break } r.mode = 25; case 25: if (0 === h) break t; if (c = d - h, r.offset > c) { if ((c = r.offset - c) > r.whave && r.sane) { t.msg = "invalid distance too far back", r.mode = 30; break } p = c > r.wnext ? (c -= r.wnext, r.wsize - c) : r.wnext - c, c > r.length && (c = r.length), m = r.window } else m = n, p = a - r.offset, c = r.length; for (h < c && (c = h), h -= c, r.length -= c; n[a++] = m[p++], --c;); 0 === r.length && (r.mode = 21); break; case 26: if (0 === h) break t; n[a++] = r.length, h--, r.mode = 21; break; case 27: if (r.wrap) { for (; l < 32;) { if (0 === o) break t; o--, u |= i[s++] << l, l += 8 } if (d -= h, t.total_out += d, r.total += d, d && (t.adler = r.check = r.flags ? B(r.check, n, d, a - d) : O(r.check, n, d, a - d)), d = h, (r.flags ? u : L(u)) !== r.check) { t.msg = "incorrect data check", r.mode = 30; break } l = u = 0 } r.mode = 28; case 28: if (r.wrap && r.flags) { for (; l < 32;) { if (0 === o) break t; o--, u += i[s++] << l, l += 8 } if (u !== (4294967295 & r.total)) { t.msg = "incorrect length check", r.mode = 30; break } l = u = 0 } r.mode = 29; case 29: x = 1; break t; case 30: x = -3; break t; case 31: return -4; case 32: default: return U }return t.next_out = a, t.avail_out = h, t.next_in = s, t.avail_in = o, r.hold = u, r.bits = l, (r.wsize || d !== t.avail_out && r.mode < 30 && (r.mode < 27 || 4 !== e)) && Z(t, t.output, t.next_out, d - t.avail_out) ? (r.mode = 31, -4) : (f -= t.avail_in, d -= t.avail_out, t.total_in += f, t.total_out += d, r.total += d, r.wrap && d && (t.adler = r.check = r.flags ? B(r.check, n, d, t.next_out - d) : O(r.check, n, d, t.next_out - d)), t.data_type = r.bits + (r.last ? 64 : 0) + (12 === r.mode ? 128 : 0) + (20 === r.mode || 15 === r.mode ? 256 : 0), (0 == f && 0 === d || 4 === e) && x === N && (x = -5), x) }, r.inflateEnd = function (t) { if (!t || !t.state) return U; var e = t.state; return e.window && (e.window = null), t.state = null, N }, r.inflateGetHeader = function (t, e) { var r; return t && t.state ? 0 == (2 & (r = t.state).wrap) ? U : ((r.head = e).done = !1, N) : U }, r.inflateSetDictionary = function (t, e) { var r, i = e.length; return t && t.state ? 0 !== (r = t.state).wrap && 11 !== r.mode ? U : 11 === r.mode && O(1, e, i, 0) !== r.check ? -3 : Z(t, e, i, i) ? (r.mode = 31, -4) : (r.havedict = 1, N) : U }, r.inflateInfo = "pako inflate (from Nodeca project)" }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function (t, e, r) { "use strict"; var D = t("../utils/common"), F = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], N = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], U = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], P = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64]; e.exports = function (t, e, r, i, n, s, a, o) { var h, u, l, f, d, c, p, m, _, g = o.bits, b = 0, v = 0, y = 0, w = 0, k = 0, x = 0, S = 0, z = 0, C = 0, E = 0, A = null, I = 0, O = new D.Buf16(16), B = new D.Buf16(16), R = null, T = 0; for (b = 0; b <= 15; b++)O[b] = 0; for (v = 0; v < i; v++)O[e[r + v]]++; for (k = g, w = 15; 1 <= w && 0 === O[w]; w--); if (w < k && (k = w), 0 === w) return n[s++] = 20971520, n[s++] = 20971520, o.bits = 1, 0; for (y = 1; y < w && 0 === O[y]; y++); for (k < y && (k = y), b = z = 1; b <= 15; b++)if (z <<= 1, (z -= O[b]) < 0) return -1; if (0 < z && (0 === t || 1 !== w)) return -1; for (B[1] = 0, b = 1; b < 15; b++)B[b + 1] = B[b] + O[b]; for (v = 0; v < i; v++)0 !== e[r + v] && (a[B[e[r + v]]++] = v); if (c = 0 === t ? (A = R = a, 19) : 1 === t ? (A = F, I -= 257, R = N, T -= 257, 256) : (A = U, R = P, -1), b = y, d = s, S = v = E = 0, l = -1, f = (C = 1 << (x = k)) - 1, 1 === t && 852 < C || 2 === t && 592 < C) return 1; for (; ;) { for (p = b - S, _ = a[v] < c ? (m = 0, a[v]) : a[v] > c ? (m = R[T + a[v]], A[I + a[v]]) : (m = 96, 0), h = 1 << b - S, y = u = 1 << x; n[d + (E >> S) + (u -= h)] = p << 24 | m << 16 | _ | 0, 0 !== u;); for (h = 1 << b - 1; E & h;)h >>= 1; if (0 !== h ? (E &= h - 1, E += h) : E = 0, v++, 0 == --O[b]) { if (b === w) break; b = e[r + a[v]] } if (k < b && (E & f) !== l) { for (0 === S && (S = k), d += y, z = 1 << (x = b - S); x + S < w && !((z -= O[x + S]) <= 0);)x++, z <<= 1; if (C += 1 << x, 1 === t && 852 < C || 2 === t && 592 < C) return 1; n[l = E & f] = k << 24 | x << 16 | d - s | 0 } } return 0 !== E && (n[d + E] = b - S << 24 | 64 << 16 | 0), o.bits = k, 0 } }, { "../utils/common": 41 }], 51: [function (t, e, r) { "use strict"; e.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" } }, {}], 52: [function (t, e, r) { "use strict"; var n = t("../utils/common"), o = 0, h = 1; function i(t) { for (var e = t.length; 0 <= --e;)t[e] = 0 } var s = 0, a = 29, u = 256, l = u + 1 + a, f = 30, d = 19, _ = 2 * l + 1, g = 15, c = 16, p = 7, m = 256, b = 16, v = 17, y = 18, w = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], k = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], x = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], S = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], z = new Array(2 * (l + 2)); i(z); var C = new Array(2 * f); i(C); var E = new Array(512); i(E); var A = new Array(256); i(A); var I = new Array(a); i(I); var O, B, R, T = new Array(f); function D(t, e, r, i, n) { this.static_tree = t, this.extra_bits = e, this.extra_base = r, this.elems = i, this.max_length = n, this.has_stree = t && t.length } function F(t, e) { this.dyn_tree = t, this.max_code = 0, this.stat_desc = e } function N(t) { return t < 256 ? E[t] : E[256 + (t >>> 7)] } function U(t, e) { t.pending_buf[t.pending++] = 255 & e, t.pending_buf[t.pending++] = e >>> 8 & 255 } function P(t, e, r) { t.bi_valid > c - r ? (t.bi_buf |= e << t.bi_valid & 65535, U(t, t.bi_buf), t.bi_buf = e >> c - t.bi_valid, t.bi_valid += r - c) : (t.bi_buf |= e << t.bi_valid & 65535, t.bi_valid += r) } function L(t, e, r) { P(t, r[2 * e], r[2 * e + 1]) } function j(t, e) { for (var r = 0; r |= 1 & t, t >>>= 1, r <<= 1, 0 < --e;); return r >>> 1 } function Z(t, e, r) { var i, n, s = new Array(g + 1), a = 0; for (i = 1; i <= g; i++)s[i] = a = a + r[i - 1] << 1; for (n = 0; n <= e; n++) { var o = t[2 * n + 1]; 0 !== o && (t[2 * n] = j(s[o]++, o)) } } function W(t) { var e; for (e = 0; e < l; e++)t.dyn_ltree[2 * e] = 0; for (e = 0; e < f; e++)t.dyn_dtree[2 * e] = 0; for (e = 0; e < d; e++)t.bl_tree[2 * e] = 0; t.dyn_ltree[2 * m] = 1, t.opt_len = t.static_len = 0, t.last_lit = t.matches = 0 } function M(t) { 8 < t.bi_valid ? U(t, t.bi_buf) : 0 < t.bi_valid && (t.pending_buf[t.pending++] = t.bi_buf), t.bi_buf = 0, t.bi_valid = 0 } function H(t, e, r, i) { var n = 2 * e, s = 2 * r; return t[n] < t[s] || t[n] === t[s] && i[e] <= i[r] } function G(t, e, r) { for (var i = t.heap[r], n = r << 1; n <= t.heap_len && (n < t.heap_len && H(e, t.heap[n + 1], t.heap[n], t.depth) && n++, !H(e, i, t.heap[n], t.depth));)t.heap[r] = t.heap[n], r = n, n <<= 1; t.heap[r] = i } function K(t, e, r) { var i, n, s, a, o = 0; if (0 !== t.last_lit) for (; i = t.pending_buf[t.d_buf + 2 * o] << 8 | t.pending_buf[t.d_buf + 2 * o + 1], n = t.pending_buf[t.l_buf + o], o++, 0 === i ? L(t, n, e) : (L(t, (s = A[n]) + u + 1, e), 0 !== (a = w[s]) && P(t, n -= I[s], a), L(t, s = N(--i), r), 0 !== (a = k[s]) && P(t, i -= T[s], a)), o < t.last_lit;); L(t, m, e) } function Y(t, e) { var r, i, n, s = e.dyn_tree, a = e.stat_desc.static_tree, o = e.stat_desc.has_stree, h = e.stat_desc.elems, u = -1; for (t.heap_len = 0, t.heap_max = _, r = 0; r < h; r++)0 !== s[2 * r] ? (t.heap[++t.heap_len] = u = r, t.depth[r] = 0) : s[2 * r + 1] = 0; for (; t.heap_len < 2;)s[2 * (n = t.heap[++t.heap_len] = u < 2 ? ++u : 0)] = 1, t.depth[n] = 0, t.opt_len--, o && (t.static_len -= a[2 * n + 1]); for (e.max_code = u, r = t.heap_len >> 1; 1 <= r; r--)G(t, s, r); for (n = h; r = t.heap[1], t.heap[1] = t.heap[t.heap_len--], G(t, s, 1), i = t.heap[1], t.heap[--t.heap_max] = r, t.heap[--t.heap_max] = i, s[2 * n] = s[2 * r] + s[2 * i], t.depth[n] = (t.depth[r] >= t.depth[i] ? t.depth[r] : t.depth[i]) + 1, s[2 * r + 1] = s[2 * i + 1] = n, t.heap[1] = n++, G(t, s, 1), 2 <= t.heap_len;); t.heap[--t.heap_max] = t.heap[1], function (t, e) { var r, i, n, s, a, o, h = e.dyn_tree, u = e.max_code, l = e.stat_desc.static_tree, f = e.stat_desc.has_stree, d = e.stat_desc.extra_bits, c = e.stat_desc.extra_base, p = e.stat_desc.max_length, m = 0; for (s = 0; s <= g; s++)t.bl_count[s] = 0; for (h[2 * t.heap[t.heap_max] + 1] = 0, r = t.heap_max + 1; r < _; r++)p < (s = h[2 * h[2 * (i = t.heap[r]) + 1] + 1] + 1) && (s = p, m++), h[2 * i + 1] = s, u < i || (t.bl_count[s]++, a = 0, c <= i && (a = d[i - c]), o = h[2 * i], t.opt_len += o * (s + a), f && (t.static_len += o * (l[2 * i + 1] + a))); if (0 !== m) { do { for (s = p - 1; 0 === t.bl_count[s];)s--; t.bl_count[s]--, t.bl_count[s + 1] += 2, t.bl_count[p]--, m -= 2 } while (0 < m); for (s = p; 0 !== s; s--)for (i = t.bl_count[s]; 0 !== i;)u < (n = t.heap[--r]) || (h[2 * n + 1] !== s && (t.opt_len += (s - h[2 * n + 1]) * h[2 * n], h[2 * n + 1] = s), i--) } }(t, e), Z(s, u, t.bl_count) } function X(t, e, r) { var i, n, s = -1, a = e[1], o = 0, h = 7, u = 4; for (0 === a && (h = 138, u = 3), e[2 * (r + 1) + 1] = 65535, i = 0; i <= r; i++)n = a, a = e[2 * (i + 1) + 1], ++o < h && n === a || (o < u ? t.bl_tree[2 * n] += o : 0 !== n ? (n !== s && t.bl_tree[2 * n]++, t.bl_tree[2 * b]++) : o <= 10 ? t.bl_tree[2 * v]++ : t.bl_tree[2 * y]++, s = n, u = (o = 0) === a ? (h = 138, 3) : n === a ? (h = 6, 3) : (h = 7, 4)) } function V(t, e, r) { var i, n, s = -1, a = e[1], o = 0, h = 7, u = 4; for (0 === a && (h = 138, u = 3), i = 0; i <= r; i++)if (n = a, a = e[2 * (i + 1) + 1], !(++o < h && n === a)) { if (o < u) for (; L(t, n, t.bl_tree), 0 != --o;); else 0 !== n ? (n !== s && (L(t, n, t.bl_tree), o--), L(t, b, t.bl_tree), P(t, o - 3, 2)) : o <= 10 ? (L(t, v, t.bl_tree), P(t, o - 3, 3)) : (L(t, y, t.bl_tree), P(t, o - 11, 7)); s = n, u = (o = 0) === a ? (h = 138, 3) : n === a ? (h = 6, 3) : (h = 7, 4) } } i(T); var q = !1; function J(t, e, r, i) { P(t, (s << 1) + (i ? 1 : 0), 3), function (t, e, r, i) { M(t), i && (U(t, r), U(t, ~r)), n.arraySet(t.pending_buf, t.window, e, r, t.pending), t.pending += r }(t, e, r, !0) } r._tr_init = function (t) { q || (function () { var t, e, r, i, n, s = new Array(g + 1); for (i = r = 0; i < a - 1; i++)for (I[i] = r, t = 0; t < 1 << w[i]; t++)A[r++] = i; for (A[r - 1] = i, i = n = 0; i < 16; i++)for (T[i] = n, t = 0; t < 1 << k[i]; t++)E[n++] = i; for (n >>= 7; i < f; i++)for (T[i] = n << 7, t = 0; t < 1 << k[i] - 7; t++)E[256 + n++] = i; for (e = 0; e <= g; e++)s[e] = 0; for (t = 0; t <= 143;)z[2 * t + 1] = 8, t++, s[8]++; for (; t <= 255;)z[2 * t + 1] = 9, t++, s[9]++; for (; t <= 279;)z[2 * t + 1] = 7, t++, s[7]++; for (; t <= 287;)z[2 * t + 1] = 8, t++, s[8]++; for (Z(z, l + 1, s), t = 0; t < f; t++)C[2 * t + 1] = 5, C[2 * t] = j(t, 5); O = new D(z, w, u + 1, l, g), B = new D(C, k, 0, f, g), R = new D(new Array(0), x, 0, d, p) }(), q = !0), t.l_desc = new F(t.dyn_ltree, O), t.d_desc = new F(t.dyn_dtree, B), t.bl_desc = new F(t.bl_tree, R), t.bi_buf = 0, t.bi_valid = 0, W(t) }, r._tr_stored_block = J, r._tr_flush_block = function (t, e, r, i) { var n, s, a = 0; 0 < t.level ? (2 === t.strm.data_type && (t.strm.data_type = function (t) { var e, r = 4093624447; for (e = 0; e <= 31; e++, r >>>= 1)if (1 & r && 0 !== t.dyn_ltree[2 * e]) return o; if (0 !== t.dyn_ltree[18] || 0 !== t.dyn_ltree[20] || 0 !== t.dyn_ltree[26]) return h; for (e = 32; e < u; e++)if (0 !== t.dyn_ltree[2 * e]) return h; return o }(t)), Y(t, t.l_desc), Y(t, t.d_desc), a = function (t) { var e; for (X(t, t.dyn_ltree, t.l_desc.max_code), X(t, t.dyn_dtree, t.d_desc.max_code), Y(t, t.bl_desc), e = d - 1; 3 <= e && 0 === t.bl_tree[2 * S[e] + 1]; e--); return t.opt_len += 3 * (e + 1) + 5 + 5 + 4, e }(t), n = t.opt_len + 3 + 7 >>> 3, (s = t.static_len + 3 + 7 >>> 3) <= n && (n = s)) : n = s = r + 5, r + 4 <= n && -1 !== e ? J(t, e, r, i) : 4 === t.strategy || s === n ? (P(t, 2 + (i ? 1 : 0), 3), K(t, z, C)) : (P(t, 4 + (i ? 1 : 0), 3), function (t, e, r, i) { var n; for (P(t, e - 257, 5), P(t, r - 1, 5), P(t, i - 4, 4), n = 0; n < i; n++)P(t, t.bl_tree[2 * S[n] + 1], 3); V(t, t.dyn_ltree, e - 1), V(t, t.dyn_dtree, r - 1) }(t, t.l_desc.max_code + 1, t.d_desc.max_code + 1, a + 1), K(t, t.dyn_ltree, t.dyn_dtree)), W(t), i && M(t) }, r._tr_tally = function (t, e, r) { return t.pending_buf[t.d_buf + 2 * t.last_lit] = e >>> 8 & 255, t.pending_buf[t.d_buf + 2 * t.last_lit + 1] = 255 & e, t.pending_buf[t.l_buf + t.last_lit] = 255 & r, t.last_lit++, 0 === e ? t.dyn_ltree[2 * r]++ : (t.matches++, e--, t.dyn_ltree[2 * (A[r] + u + 1)]++, t.dyn_dtree[2 * N(e)]++), t.last_lit === t.lit_bufsize - 1 }, r._tr_align = function (t) { P(t, 2, 3), L(t, m, z), function (t) { 16 === t.bi_valid ? (U(t, t.bi_buf), t.bi_buf = 0, t.bi_valid = 0) : 8 <= t.bi_valid && (t.pending_buf[t.pending++] = 255 & t.bi_buf, t.bi_buf >>= 8, t.bi_valid -= 8) }(t) } }, { "../utils/common": 41 }], 53: [function (t, e, r) { "use strict"; e.exports = function () { this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0 } }, {}], 54: [function (t, e, r) { "use strict"; e.exports = "function" == typeof setImmediate ? setImmediate : function () { var t = [].slice.apply(arguments); t.splice(1, 0, 0), setTimeout.apply(null, t) } }, {}] }, {}, [10])(10) });

// edit panel variables
ELEMENT.locale(ELEMENT.lang.en);
var vue = undefined;
var editCanvas = undefined;
var editButton = undefined;

Vue.component('object-svg-keyboard', {
  template: `<svg xmlns="http://www.w3.org/2000/svg" width="1040" height="520" viewBox="0 0 1040 520">
  <g id="Product">
    <path class="productfill"
      d="M981,43H264l-1.23,1.84c-.48,.73-1.3,1.16-2.17,1.16h-.6v-.72c0-1.26-1.02-2.28-2.28-2.28h-4.72V17h-10v26h-4.72c-1.26,0-2.28,1.02-2.28,2.28v.72h-12v-.72c0-1.26-1.02-2.28-2.28-2.28h-4.72V17h-10v26h-4.72c-1.26,0-2.28,1.02-2.28,2.28v.72h-.6c-.87,0-1.69-.44-2.17-1.16l-1.23-1.84H57c-2.63,0-4,.5-4,.5V116h-2l-1,1v38l.79,1h2.21v1h-2l-1,1v36l.79,1h2.21v1h-2l-1,1v38l.79,1h2.21v108.7c0,1.82,1.48,3.3,3.3,3.3H981.7c1.82,0,3.3-1.48,3.3-3.3V43.5s-2-.5-4-.5Z" />
    <path class="productoutline1"
      d="M981,43h-22.03c-.71-.63-1.63-1-2.59-1h-129.76c-.96,0-1.88,.37-2.59,1H264l-1.23,1.84c-.48,.72-1.29,1.16-2.17,1.16h-.6v-.72c0-1.26-1.02-2.28-2.28-2.28h-4.72V17h-1v26h-8V17h-1v26h-4.72c-1.26,0-2.28,1.02-2.28,2.28v.72h-12v-.72c0-1.26-1.02-2.28-2.28-2.28h-4.72V17h-1v26h-8V17h-1v26h-4.72c-1.26,0-2.28,1.02-2.28,2.28v.72h-.6c-.88,0-1.69-.44-2.17-1.16l-1.23-1.84H57c-2.63,0-4,.5-4,.5V116h-2l-1,1v38l.79,1h2.21v1h-2l-1,1v36l.79,1h2.21v1h-2l-1,1v38l.79,1h2.21v108.7c0,1.82,1.48,3.3,3.3,3.3H981.7c1.82,0,3.3-1.48,3.3-3.3V43.5s-2-.5-4-.5ZM53,235h-1.73l-.27-.35v-37.24l.41-.41h1.59v38Zm0-41h-1.73l-.27-.35v-35.24l.41-.41h1.59v36Zm0-39h-1.73l-.27-.35v-37.24l.41-.41h1.59v38ZM843,43h97s0,19.5,0,19.5c0,.83-.67,1.5-1.5,1.5h-94c-.83,0-1.5-.67-1.5-1.5v-19.5Zm-18.44,.85c.55-.55,1.28-.85,2.06-.85h15.38v19.5c0,1.38,1.12,2.5,2.5,2.5h94c1.38,0,2.5-1.12,2.5-2.5v-19.5h15.38c.78,0,1.51,.3,2.06,.85l.71,.71c.55,.55,.85,1.28,.85,2.06v22.07c0,2.92-2.38,5.3-5.3,5.3h-126.39c-2.92,0-5.3-2.38-5.3-5.3v-22.07c0-.78,.3-1.51,.85-2.06l.71-.71Zm-587.56,1.43c0-.7,.58-1.28,1.28-1.28h19.44c.7,0,1.28,.58,1.28,1.28v.72h-22v-.72Zm-36,0c0-.7,.58-1.28,1.28-1.28h19.44c.7,0,1.28,.58,1.28,1.28v.72h-22v-.72Zm-147-1.01c.6-.12,1.61-.27,3-.27H195.46l.93,1.39c.67,1.01,1.8,1.61,3.01,1.61h61.2c1.21,0,2.34-.6,3.01-1.61l.93-1.39H823.03c-.65,.72-1.03,1.65-1.03,2.62v1.38H54v-3.73ZM984,344.7c0,1.27-1.03,2.3-2.3,2.3H56.3c-1.27,0-2.3-1.03-2.3-2.3v-20.7H984v20.7Zm0-21.7H54V49H822v19.7c0,3.48,2.82,6.3,6.3,6.3h126.39c3.48,0,6.3-2.82,6.3-6.3v-19.7h23V323Zm0-275h-23v-1.38c0-.97-.37-1.9-1.03-2.62h21.03c1.13,0,2.28,.17,3,.31v3.69ZM89,70c9.93,0,18,8.07,18,18s-8.07,18-18,18-18-8.07-18-18,8.07-18,18-18m0-1c-10.49,0-19,8.51-19,19s8.51,19,19,19,19-8.51,19-19-8.51-19-19-19h0Zm0,4c8.27,0,15,6.73,15,15s-6.73,15-15,15-15-6.73-15-15,6.73-15,15-15m0-1c-8.84,0-16,7.16-16,16s7.16,16,16,16,16-7.16,16-16-7.16-16-16-16h0Zm745.5,13c5.24,0,9.5,4.26,9.5,9.5s-4.26,9.5-9.5,9.5-9.5-4.26-9.5-9.5,4.26-9.5,9.5-9.5m0-1c-5.8,0-10.5,4.7-10.5,10.5s4.7,10.5,10.5,10.5,10.5-4.7,10.5-10.5-4.7-10.5-10.5-10.5h0Zm38,1c5.24,0,9.5,4.26,9.5,9.5s-4.26,9.5-9.5,9.5-9.5-4.26-9.5-9.5,4.26-9.5,9.5-9.5m0-1c-5.8,0-10.5,4.7-10.5,10.5s4.7,10.5,10.5,10.5,10.5-4.7,10.5-10.5-4.7-10.5-10.5-10.5h0Zm38,1c5.24,0,9.5,4.26,9.5,9.5s-4.26,9.5-9.5,9.5-9.5-4.26-9.5-9.5,4.26-9.5,9.5-9.5m0-1c-5.8,0-10.5,4.7-10.5,10.5s4.7,10.5,10.5,10.5,10.5-4.7,10.5-10.5-4.7-10.5-10.5-10.5h0Zm38,1c5.24,0,9.5,4.26,9.5,9.5s-4.26,9.5-9.5,9.5-9.5-4.26-9.5-9.5,4.26-9.5,9.5-9.5m0-1c-5.8,0-10.5,4.7-10.5,10.5s4.7,10.5,10.5,10.5,10.5-4.7,10.5-10.5-4.7-10.5-10.5-10.5h0Z" />
    <path id="productRAZER" class="productoutline2"
      d="M507.89,332.31l3.2,7.92h-.94l-2.26-5.6-2.26,5.6h-.94l3.2-7.92Zm19.42,.87h5.04l.5-.87h-5.55v.87Zm-11.09-.87v.87h4.07l-4.07,7.05h5.07l.5-.87h-4.07l4.07-7.05h-5.58Zm11.09,4.4h5.04l.5-.87h-5.55v.87Zm0,3.53h5.04l.5-.87h-5.55v.87Zm-29.76-3.53c.68,1.18,1.36,2.35,2.04,3.53h-1.01c-.68-1.18-1.36-2.35-2.04-3.53h-1.63v3.53h-.87v-7.92c.27,0,.53,0,.79,0,.26,0,.5,0,.74,0,.24,0,.47,0,.7,0s.44,0,.65,0c.21,0,.41-.01,.59,0,.19,0,.37,.03,.55,.07,.18,.04,.35,.09,.5,.16,.15,.08,.29,.18,.41,.3,.12,.12,.23,.25,.33,.4,.09,.15,.16,.31,.21,.48,.05,.17,.06,.34,.08,.52,.01,.17,.02,.34,0,.51,0,.27-.05,.52-.15,.75s-.23,.42-.38,.59c-.15,.17-.3,.3-.53,.4s-.53,.17-.71,.21c-.18,.04-.25,.04-.27,.01Zm.22-.89c.2-.03,.38-.1,.53-.21,.15-.11,.26-.28,.33-.47,.07-.19,.09-.42,.09-.65,0-.23-.02-.46-.12-.67-.1-.21-.27-.38-.44-.49s-.36-.14-.53-.15c-.17-.01-.33,0-.49,0-.16,0-.31,0-.46,0-.15,0-.3,0-.45,0-.15,0-.3,0-.45,0-.15,0-.3,0-.45,0h-.45v2.65c.28,0,.54,0,.8,0,.26,0,.5,0,.74,0,.24,0,.47,0,.69,0,.22,0,.44,.01,.63-.02Zm44.14,.89c.68,1.18,1.36,2.35,2.04,3.53h-1.01c-.68-1.18-1.36-2.35-2.04-3.53h-1.63v3.53h-.87v-7.92c.27,0,.53,0,.79,0,.26,0,.5,0,.74,0,.24,0,.47,0,.7,0s.44,0,.65,0c.21,0,.41-.01,.59,0,.19,0,.37,.03,.55,.07,.18,.04,.35,.09,.5,.16,.15,.08,.29,.18,.41,.3,.12,.12,.23,.25,.33,.4,.09,.15,.16,.31,.21,.48,.05,.17,.06,.34,.08,.52,.01,.17,.02,.34,0,.51,0,.27-.05,.52-.15,.75s-.23,.42-.38,.59-.3,.3-.53,.4-.53,.17-.71,.21c-.18,.04-.25,.04-.27,.01Zm.22-.89c.2-.03,.38-.1,.53-.21,.15-.11,.26-.28,.33-.47,.07-.19,.09-.42,.09-.65,0-.23-.02-.46-.12-.67-.1-.21-.27-.38-.44-.49-.17-.11-.36-.14-.53-.15-.17-.01-.33,0-.49,0-.16,0-.31,0-.46,0-.15,0-.3,0-.45,0-.15,0-.3,0-.45,0-.15,0-.3,0-.45,0h-.45v2.65c.28,0,.54,0,.8,0,.26,0,.5,0,.74,0s.47,0,.69,0c.22,0,.44,.01,.63-.02Z" />
    <path id="productIndicator" class="productoutline2"
      d="M768.85,211.43c-1.94,0-3.52,1.57-3.52,3.52s1.57,3.52,3.52,3.52,3.52-1.57,3.52-3.52-1.57-3.52-3.52-3.52m1.53,5h-.61v-2.32h-.07l-.59,2.19h-.61l-.59-2.19h-.07v2.32h-.61v-3h1.04l.53,2.19,.53-2.19h1.04v3Zm18.23-1.53v1.44c-.16,.02-.64,.09-.96,.09-.94-.01-1.15-.49-1.16-1.49,.01-1.09,.29-1.48,1.14-1.49,.37,0,.83,.08,.98,.11v.35c-.17-.01-.56-.05-.88-.05-.26,0-.46,.04-.58,.22-.12,.17-.15,.43-.15,.86,0,.4,.02,.66,.13,.84,.11,.18,.31,.24,.59,.24,.19,0,.37-.02,.37-.02h.06v-.71h-.27v-.4h.75Zm2.51-.17h-.15v-.06c-.13-1.66-1.45-2.99-3.12-3.14h-.06v-.15h0c0-.09-.08-.17-.16-.17h-.13c-.09,0-.17,.07-.17,.17v.15h-.06c-1.66,.14-2.99,1.46-3.14,3.12v.06s-.06,0-.06,0h-.09c-.09,0-.17,.07-.17,.16v.13c0,.09,.07,.16,.16,.17h.15v.06c.14,1.66,1.46,2.99,3.12,3.14h.06v.15c0,.09,.07,.17,.17,.17h.13c.09,0,.16-.07,.16-.16v-.15h.06c1.67-.14,2.99-1.46,3.14-3.12v-.06h.15c.09,0,.16-.07,.16-.16v-.13c0-.09-.07-.16-.16-.16m-1.43,.45h.75s0,.07,0,.07c-.15,1.35-1.22,2.43-2.58,2.56v-.06h-.07v-.68c0-.09-.07-.17-.16-.17h-.14s0,0,0,0c-.09,0-.16,.07-.16,.17v.75s-.07,0-.07,0c-1.36-.14-2.43-1.22-2.56-2.58v-.07s.74,0,.74,0h0c.09,0,.17-.07,.17-.16v-.13c0-.09-.07-.16-.16-.16h-.75s0-.07,0-.07c.15-1.36,1.23-2.43,2.58-2.56h.07s0,.74,0,.74c0,.09,.07,.16,.16,.16h.13c.09,0,.17-.07,.17-.16v-.75s.07,0,.07,0c1.36,.14,2.43,1.23,2.56,2.58v.07s-.74,0-.74,0c-.09,0-.16,.07-.16,.16v.14c0,.09,.07,.16,.16,.16m-38,.76c0,1.02-.46,1.47-1.51,1.47-.21,0-.51-.02-.91-.05l-.62-.06,.05-.42,.61,.07c.27,.03,.62,.05,.86,.05,.76,0,1.08-.3,1.08-1.05,0-.61-.29-.76-1.09-.88-.85-.13-1.53-.23-1.53-1.33,0-.85,.5-1.26,1.54-1.26,.27,0,.6,.02,.87,.05l.57,.06-.05,.42-.6-.06c-.32-.04-.61-.06-.78-.06-.76,0-1.1,.26-1.1,.83,0,.74,.34,.79,1.18,.92,.93,.15,1.44,.4,1.44,1.29m-37.41,.91l.04,.42-.08,.02c-.3,.06-.76,.13-1.25,.13-1.46,0-1.76-.97-1.76-2.44,0-1.26,.14-2.5,1.76-2.5,.39,0,.81,.04,1.25,.13l.08,.02-.04,.42-.1-.02c-.26-.05-.8-.13-1.2-.13-1.12,0-1.31,.67-1.31,2.08s.2,2.03,1.31,2.03c.5,0,.96-.08,1.2-.13l.1-.02Zm17.75-4.38h.38v4.94h-.45v-4.38l-1.21,.81-.22-.38,1.5-1Zm-17.3-7.47c0,1.1-.89,1.99-1.99,1.99s-1.99-.89-1.99-1.99,.89-1.99,1.99-1.99,1.99,.89,1.99,1.99Zm18.88,0c0,1.1-.89,1.99-1.99,1.99s-1.99-.89-1.99-1.99,.89-1.99,1.99-1.99,1.99,.89,1.99,1.99Zm18.88,0c0,1.1-.89,1.99-1.99,1.99s-1.99-.89-1.99-1.99,.89-1.99,1.99-1.99,1.99,.89,1.99,1.99Zm17.88,0c0,1.1-.89,1.99-1.99,1.99s-1.99-.89-1.99-1.99,.89-1.99,1.99-1.99,1.99,.89,1.99,1.99Zm18.88,0c0,1.1-.89,1.99-1.99,1.99s-1.99-.89-1.99-1.99,.89-1.99,1.99-1.99,1.99,.89,1.99,1.99Z" />
    <path id="productMedia" class="cls-7"
      d="M950.52,94.39c-.16-.16-.32-.32-.48-.48-.16-.16-.32-.32-.48-.48-.16-.16-.32-.32-.49-.49,.06-.06,.12-.12,.17-.17,.06-.06,.12-.12,.17-.18,.06-.06,.12-.12,.17-.17,.16,.16,.32,.32,.48,.49,.16,.16,.32,.32,.49,.48,.16,.16,.32,.32,.49,.48,.16-.16,.32-.32,.48-.48,.16-.16,.32-.32,.47-.48,.16-.16,.32-.32,.48-.47,.06,.06,.11,.11,.17,.17,.06,.06,.11,.11,.17,.17,.06,.06,.11,.11,.17,.17-.16,.16-.32,.32-.47,.47-.16,.16-.32,.32-.48,.48-.16,.16-.32,.32-.48,.47,0,0,.01,0,.01,.02,.16,.16,.32,.32,.48,.48,.16,.16,.33,.33,.49,.49,.16,.16,.33,.33,.49,.49-.06,.06-.12,.12-.17,.17-.06,.06-.12,.12-.17,.17-.06,.06-.12,.12-.17,.17-.16-.16-.33-.33-.49-.49-.16-.16-.33-.33-.49-.49-.16-.16-.33-.33-.49-.49-.16,.16-.31,.31-.47,.47-.16,.16-.31,.31-.47,.47-.16,.16-.31,.31-.47,.47-.06-.06-.11-.11-.17-.17-.06-.06-.11-.11-.17-.17-.06-.06-.11-.11-.17-.17,.16-.16,.31-.31,.47-.47,.16-.16,.31-.31,.47-.47,.16-.16,.31-.31,.47-.47m-4.36,2.14c-.27-.19-.54-.38-.81-.57h-1.85v-3.13h1.85c.27-.19,.54-.38,.81-.57,.27-.19,.54-.38,.81-.57,.27-.19,.54-.38,.81-.57v6.55c-.27-.19-.54-.38-.81-.57-.27-.19-.54-.38-.81-.57m-35.93-4.22l-.08-.05v2.06l-3.49-2.02-.08-.05v4.19l3.55-2.05h.03s0,2.05,0,2.05l3.55-2.05h.02s0,2.01,0,2.01h.71v-4.11h-.71v2.02l-3.49-2.02Zm-35.27,4.39h.78v-4.54h-.78v4.54Zm-5.68-4.53l-.09-.05v4.62l3.91-2.26,.05-.03v2.24h.78v-4.54h-.78v2.24l-3.87-2.24Zm-38.05,2.08v-1.99h-.71v4.11h.71v-1.99l3.44,1.98,.08,.05v-2.03l3.43,1.98,.08,.05v-4.19l-3.52,2.03v-2.03l-3.52,2.03Z" />
    <rect class="productfill" x="53" y="317" width="932" height="156" rx="8" ry="8" />
    <path class="productoutline1"
      d="M977,318c3.86,0,7,3.14,7,7v140c0,3.86-3.14,7-7,7H61c-3.86,0-7-3.14-7-7v-140c0-3.86,3.14-7,7-7H977m0-1H61c-4.42,0-8,3.58-8,8v140c0,4.42,3.58,8,8,8H977c4.42,0,8-3.58,8-8v-140c0-4.42-3.58-8-8-8h0Z" />
    <path id="productLogo" class="productoutline2"
      d="M540.65,372.28c.06-.32-.07-.66-.34-.86-.36-.26-.85-.21-1.15,.12l-.46,.51-.73,.31c-.26-.08-.55-.09-.85-.01-.17,.04-.22,.03-.38,0-.34-.07-.69-.11-1.25,.07-.2-.01-.43,.02-.8,.14-.46,.15-.74,.51-.95,.78-.02,.03-.05,.06-.07,.09-1.31,.34-1.83,1.07-2.03,1.65-.04,.11-.07,.22-.09,.33-1.38-1.05-3.28-1.14-4.89-.2-1.85,1.08-2.68,3.13-2.11,5.22,.92,3.38,4.12,6.56,6.04,8.46l.62,.62c1,1.02,2.29,3.07,2.03,4.44-.06,.34-.24,.84-1.08,1.22-.43,.19-.83,.31-1.23,.36,.71-1.98,.36-4.11-.98-5.51-1.91-1.99-3.72-1.49-4.41-.95-.29,.23-.41,.62-.29,.97,.12,.35,.45,.58,.82,.58,.92,0,1.95,.68,2.4,1.59,.38,.76,.31,1.59-.21,2.42-.39-.32-.73-.67-1.01-.97-.12-.12-.23-.24-.33-.34-.01-.01-.04-.05-.07-.08-1.37-1.55-2.78-2.45-4.18-2.7-.18-2.48-1.93-4.99-4.58-6.44-.22-.12-.44-.22-.67-.32-.5-2.59-2.08-4.33-4.61-5.04-3.69-1.04-6.62,.61-8.03,4.52-.48,1.33-1.51,5.88-2.36,9.7l-.16,.71c-.11,.5-.7,1.41-1.33,1.63-.17,.06-.39,.09-.69-.16-.61-.5-.25-1.95-.06-2.72,.04-.15,.07-.28,.1-.4,.16-.74-.08-1.56-.63-2.15-.54-.57-1.28-.84-2.05-.72-1.61,.24-2.12,1.55-2.32,2.13-.16-.3-.37-.69-.78-.92-.33-.19-.55-.26-.75-.29-.52-.29-.87-.32-1.22-.32-.16,0-.21,0-.37-.08-.32-.15-.65-.2-.96-.14l-.6-.38-.38-.58c-.24-.37-.73-.5-1.13-.29-.3,.16-.47,.47-.47,.79-.3,.13-.51,.43-.52,.77-.01,.44,.31,.82,.75,.88l.68,.1,.59,.37c.07,.3,.25,.57,.52,.8,.14,.12,.16,.16,.22,.31,.14,.31,.31,.62,.79,.98,.11,.17,.26,.34,.57,.56,.39,.28,.85,.31,1.18,.32,.03,0,.07,0,.11,0,1.04,.87,1.94,.86,2.52,.69,.11-.03,.22-.08,.32-.12-.05,1.73,.98,3.33,2.69,4.09,1.96,.87,4.11,.35,5.47-1.33,2.21-2.72,2.93-7.17,3.36-9.84l.14-.87c.25-1.4,1.16-3.65,2.43-4.24,.31-.15,.82-.29,1.62,.17,.4,.23,.74,.5,1,.79-2.02,.58-3.55,2.1-3.91,4-.5,2.71,.95,3.9,1.8,4.14,.36,.1,.74-.03,.95-.33,.21-.3,.21-.71,0-1.01-.54-.75-.58-1.99-.11-2.88,.4-.75,1.12-1.18,2.09-1.24-.03,.5-.12,.98-.2,1.39-.03,.17-.06,.33-.08,.46,0,.01-.01,.06-.02,.1-.42,1.84-.39,3.38,.09,4.62-2.04,1.26-3.48,3.83-3.69,6.7-.02,.24-.02,.49-.01,.74-2.15,1.53-3.07,3.69-2.66,6.29,.59,3.79,3.31,5.76,7.46,5.42,1.41-.12,5.98-1.07,9.8-1.9l.72-.15c.51-.11,1.57,.05,2.03,.53,.13,.13,.24,.32,.15,.7-.2,.77-1.66,1.04-2.45,1.18-.15,.03-.28,.05-.4,.08-.74,.16-1.39,.73-1.69,1.47-.3,.73-.23,1.52,.19,2.16,.89,1.36,2.29,1.29,2.91,1.22-.21,.27-.47,.62-.51,1.09-.03,.38,0,.61,.05,.8-.05,.59,.07,.93,.21,1.24,.06,.14,.09,.19,.08,.37,0,.37,.1,.7,.29,.96l-.13,.89-.37,.58c-.24,.38-.16,.87,.19,1.15,.27,.21,.62,.24,.91,.1,.24,.22,.6,.29,.91,.16,.41-.17,.62-.62,.5-1.04l-.19-.66,.14-.95c.22-.19,.4-.46,.49-.78,.05-.17,.08-.21,.19-.33,.23-.26,.44-.55,.56-1.13,.11-.17,.2-.38,.27-.76,.1-.47-.08-.9-.2-1.21-.01-.03-.03-.07-.04-.1,.36-1.31-.02-2.12-.42-2.58-.08-.09-.16-.17-.25-.24,1.59-.68,2.62-2.28,2.6-4.15-.02-2.14-1.39-3.88-3.49-4.42-3.39-.88-7.74,.32-10.34,1.04l-.85,.23c-1.38,.36-3.8,.46-4.86-.44-.26-.22-.61-.63-.52-1.54,.04-.47,.14-.88,.3-1.24,1.37,1.6,3.39,2.36,5.27,1.89,2.68-.67,3.14-2.49,3.02-3.36-.05-.37-.33-.66-.7-.73-.36-.07-.73,.1-.91,.42-.46,.8-1.56,1.36-2.58,1.3-.85-.05-1.54-.53-2-1.38,.47-.18,.94-.3,1.34-.4,.17-.04,.32-.08,.45-.12,.01,0,.06-.01,.1-.02,2.1-.44,3.6-1.24,4.5-2.39,2.1,1.06,4.92,1,7.47-.22,.22-.11,.44-.23,.65-.36,2.39,1.1,4.73,.83,6.78-.81,2.99-2.39,3.36-5.73,1-9.16-.8-1.17-3.9-4.66-6.51-7.56l-.49-.54c-.34-.39-.74-1.39-.55-2.03,.05-.18,.16-.37,.53-.47,.76-.21,1.73,.93,2.24,1.54,.1,.12,.19,.22,.27,.31,.51,.56,1.32,.84,2.12,.74,.78-.1,1.43-.56,1.78-1.24,.74-1.45-.02-2.63-.38-3.13,.33,.05,.78,.1,1.2-.1,.34-.16,.53-.29,.67-.44,.54-.25,.77-.52,.97-.8,.09-.13,.12-.17,.28-.26,.43-.24,.62-.55,.71-.79l.64-.27h.69c.45,.02,.83-.31,.88-.75,.04-.34-.12-.66-.39-.83Zm-1.35,.71l-1.26,.54c.02,.06,.02,.14-.01,.24,0,0,0,.02,0,.02-.04,.13-.14,.26-.33,.37-.71,.39-.44,.71-1.3,1.07-.17,.07-.03,.14-.57,.39-.37,.17-1-.09-1.25,0-.17,.07-.93,.43-.45,1.17,.23,.35,1.07,1.25,.46,2.44-.51,.99-1.86,1-2.48,.32-.57-.63-1.9-2.51-3.38-2.1-1.92,.52-1.18,3.03-.4,3.91,.82,.92,5.93,6.57,6.93,8.02,1.17,1.7,2.74,5.14-.83,7.99-2.34,1.88-4.62,1.39-6.3,.49-.29,.22-.61,.41-.96,.58-2.45,1.18-5.42,1.23-7.37-.18-1.07,2.21-4.26,2.68-4.55,2.76-.64,.18-1.71,.36-2.69,.92,.04,.14,.09,.28,.15,.42,1.45,3.43,5.21,2.42,6.29,.53,0,0,.25,1.73-2.37,2.39-1.91,.48-4.01-.64-5.07-2.58-.59,.61-1.03,1.47-1.15,2.7-.34,3.61,4.45,3.43,6.46,2.9,2.23-.58,7.18-2.19,10.75-1.27,3.79,.98,3.66,6.15,.35,7.08-.96,.27-1.57,.35-1.99,.46-.26,.07-.28,.47,.39,.36,.54-.09,2.92,.11,2.13,2.58-.08,.26,.36,.81,.27,1.22-.12,.58-.22,.45-.25,.64-.16,.92-.53,.73-.75,1.51-.09,.32-.28,.44-.45,.47l-.23,1.56,.24,.84-.4-.71-.55,.57,.47-.74,.22-1.55s-.08-.03-.1-.05h0s-.02-.02-.03-.02c-.02-.02-.03-.03-.03-.03h0c-.11-.09-.19-.25-.18-.49,.01-.81-.4-.74-.29-1.66,.02-.19-.11-.1-.06-.69,.04-.41,.57-.82,.61-1.09,.03-.18,.09-1.02-.79-.97-.42,.02-1.62,.3-2.35-.81-.61-.93,.06-2.11,.96-2.31,.83-.18,3.12-.41,3.51-1.89,.5-1.93-2.04-2.53-3.2-2.29-1.21,.26-8.64,1.89-10.4,2.03-2.05,.17-5.82-.17-6.53-4.69-.46-2.97,1.09-4.7,2.7-5.71-.04-.36-.05-.73-.03-1.12,.2-2.78,1.7-5.45,3.98-6.38-1.22-1.9-.41-4.67-.36-4.95,.1-.65,.38-1.71,.29-2.83-.15-.02-.29-.03-.45-.04-3.72-.11-4.37,3.73-3.1,5.5,0,0-1.68-.49-1.19-3.15,.36-1.93,2.25-3.37,4.45-3.53-.31-.79-.9-1.55-1.97-2.17-3.14-1.82-4.97,2.61-5.33,4.67-.4,2.27-1,7.44-3.32,10.3-2.47,3.04-7.12,.76-6.58-2.63,.16-.99,.34-1.58,.41-2,.04-.27-.31-.45-.49,.21-.14,.53-1.32,2.61-3.23,.86-.2-.18-.89-.01-1.22-.26-.48-.35-.32-.39-.48-.5-.77-.52-.44-.79-1.06-1.31-.26-.22-.29-.46-.23-.63l-1.14-.72-.87-.12,.81-.07-.3-.74,.48,.73,1.15,.73s.07-.07,.12-.1c.13-.06,.31-.07,.54,.04,.73,.35,.84-.06,1.63,.43,.16,.1,.13-.06,.65,.23,.36,.2,.51,.86,.73,1.01,.15,.1,.89,.5,1.21-.32,.15-.39,.4-1.6,1.72-1.8,1.1-.17,1.9,.93,1.7,1.83-.18,.83-.93,3,.26,3.97,1.54,1.26,3.15-.8,3.41-1.95,.27-1.2,1.88-8.65,2.48-10.31,.7-1.94,2.58-5.22,6.98-3.98,2.89,.81,3.82,2.95,4.07,4.84,.35,.11,.69,.26,1.03,.44,2.51,1.38,4.34,3.95,4.13,6.48,2.38-.05,4.29,2.38,4.5,2.59,.47,.47,1.17,1.31,2.14,1.88,.1-.11,.2-.22,.29-.34,2.26-2.96-.48-5.73-2.67-5.72,0,0,1.38-1.08,3.25,.87,1.36,1.42,1.43,3.8,.28,5.68,.82,.21,1.79,.17,2.91-.34,3.31-1.5,.77-5.56-.69-7.05-1.61-1.64-5.47-5.14-6.44-8.7-1.03-3.78,3.52-6.23,5.97-3.82,.71,.7,1.08,1.19,1.39,1.5,.19,.19,.55,0,.12-.52-.35-.43-1.35-2.59,1.18-3.13,.26-.06,.53-.71,.92-.84,.56-.19,.5-.03,.68-.1,.87-.32,.9,.1,1.68-.09,.3-.07,.49,0,.6,.13l1.29-.55,.59-.65-.4,.71,.78,.17-.88-.02Zm-18.94,21.53c-.35,.63,.29,1.91,2.1,2.47,1.24,.39,2.85,.45,4.23-.06-.24-.19-.45-.37-.63-.52-1.39-1.22-4.54-3.99-5.7-1.89Zm2.36,1.64c-1.21-.37-1.58-1.06-1.58-1.25,.12-.21,.24-.26,.35-.28,.79-.14,2.27,.97,3.26,1.78-.68,.02-1.39-.06-2.03-.26Zm-8.21,.02c-.95,.89-1.81,2.25-2.05,3.7,.28-.12,.54-.21,.77-.29,1.75-.6,5.71-1.96,4.47-4.01-.37-.62-1.8-.69-3.18,.6Zm2.53,.32c-.27,.75-1.97,1.49-3.17,1.94,.32-.6,.74-1.17,1.23-1.63,.93-.86,1.7-.84,1.87-.75,.12,.21,.1,.34,.07,.44Zm-.32-10.36c-.01,.3-.03,.58-.06,.82-.18,1.84-.6,6.01,1.79,5.74,.72-.08,1.38-1.35,.78-3.14-.41-1.24-1.29-2.58-2.51-3.41Zm1.59,5.69c-.24,.02-.35-.05-.43-.12-.57-.56-.54-2.41-.45-3.69,.42,.54,.76,1.16,.97,1.8,.4,1.2,.05,1.9-.09,2.01Z" />
    <path id="productCharactersUS" class="characters" d="
    M743.68,79.59c-.95-.15-1.4-.33-1.4-1.17,0-.93,.75-1.23,1.51-1.23,.63,0,1.52,.16,1.52,.16,0,.18-.01,.36-.02,.54,0,0-.93-.13-1.47-.13s-.92,.14-.92,.64c0,.4,.2,.5,1.09,.66,1.05,.18,1.45,.39,1.45,1.2,0,.98-.62,1.3-1.63,1.3-.54,0-1.48-.15-1.48-.15,.01-.18,.02-.36,.03-.55,0,0,.96,.14,1.39,.14,.69,0,1.06-.15,1.06-.72,0-.44-.22-.55-1.13-.69m10.67-4.14h-.63v6.04h.63v-6.04Zm-46.67,2.49s.77-.43,1.58-.59v-.66c-.84,.17-1.59,.69-1.59,.69v-.59h-.64v4.35h.65v-3.19Zm71.68,5.11h-.68v-6.52h.67v.33s.69-.42,1.36-.42c1.14,0,1.64,.7,1.64,2.3,0,1.77-.58,2.39-1.97,2.39-.43,0-.89-.07-1.01-.09v2.01Zm0-2.59c.12,.02,.59,.1,.98,.1,.99,0,1.32-.51,1.32-1.82s-.39-1.69-1.05-1.69c-.62,0-1.25,.36-1.25,.36v3.05Zm4.87-2.03c.47-.04,.95-.09,1.42-.14v-.39c0-.63-.27-.86-.81-.86-.63,0-1.71,.12-1.71,.12,0-.17-.02-.34-.03-.51,0,0,.99-.2,1.77-.2,1.02,0,1.45,.47,1.45,1.45v3.15h-.68v-.23s-.71,.32-1.53,.32-1.27-.46-1.27-1.37,.45-1.25,1.38-1.34m1.42,.38c-.45,.04-.89,.08-1.34,.13-.55,.05-.77,.32-.77,.81,0,.53,.23,.83,.69,.83,.67,0,1.42-.28,1.42-.28v-1.49Zm-75.29,.83c0,1.25,.3,1.58,1.2,1.58,.3,0,.89-.09,.89-.09-.01-.18-.03-.36-.04-.54,0,0-.53,.05-.77,.05-.57,0-.63-.27-.63-1.22v-2.08h1.38v-.57h-1.38v-1.33h-.64v1.33h-.62v.57h.62v2.29Zm-5.66-2.94c1.1,0,1.58,.67,1.58,2.21,0,1.71-.56,2.31-1.9,2.31-.41,0-.85-.07-.97-.09v1.93h-.65v-6.27h.64v.31s.66-.4,1.3-.4m-.36,3.96c.96,0,1.27-.5,1.27-1.75s-.37-1.63-1.01-1.63c-.59,0-1.2,.35-1.2,.35v2.93c.11,.02,.57,.1,.94,.1m11.7-2.04c-.92-.16-1.13-.27-1.13-.68,0-.51,.41-.66,.95-.66s1.52,.14,1.52,.14c0-.19,.01-.37,.02-.56,0,0-.92-.16-1.58-.16-.79,0-1.57,.31-1.57,1.27,0,.87,.47,1.05,1.45,1.21,.95,.15,1.17,.26,1.17,.71,0,.59-.38,.75-1.1,.75-.44,0-1.44-.15-1.44-.15-.01,.19-.02,.38-.04,.57,0,0,.98,.16,1.53,.16,1.04,0,1.69-.33,1.69-1.35,0-.84-.41-1.06-1.5-1.24m77.06,.41c.98,.15,1.22,.27,1.22,.74,0,.61-.4,.78-1.14,.78-.46,0-1.49-.15-1.49-.15-.01,.2-.02,.39-.04,.59,0,0,1.01,.16,1.59,.16,1.09,0,1.75-.34,1.75-1.4,0-.88-.42-1.1-1.56-1.29-.96-.16-1.17-.28-1.17-.71,0-.53,.42-.69,.98-.69s1.58,.14,1.58,.14c0-.19,.01-.39,.02-.58,0,0-.96-.17-1.64-.17-.82,0-1.63,.33-1.63,1.32,0,.9,.49,1.09,1.51,1.26m-45.42,2.54c.39,0,1.17-.11,1.17-.11,0-.17-.02-.35-.02-.52,0,0-.67,.07-.99,.07-1.04,0-1.24-.45-1.24-1.7,0-1.13,.26-1.55,1.23-1.55,.32,0,.99,.08,.99,.08,0-.17,.02-.34,.03-.51,0,0-.76-.13-1.14-.13-1.25,0-1.75,.59-1.75,2.11,0,1.65,.39,2.25,1.73,2.25m41.15-.42c.66,0,1.34-.4,1.34-.4v.32h.68v-4.52h-.68v3.67s-.57,.33-1.24,.33c-.84,0-.95-.41-.95-1.65v-2.35h-.68v2.36c0,1.66,.26,2.24,1.53,2.24m8.58-4.69c1.2,0,1.92,.63,1.82,2.11-.01,.17-.02,.34-.04,.52h-2.98c0,.97,.3,1.47,1.18,1.47,.68,0,1.66-.08,1.66-.08,0,.18,.01,.36,.02,.53,0,0-1.03,.14-1.76,.14-1.35,0-1.79-.78-1.79-2.31,0-1.72,.74-2.38,1.89-2.38m1.14,2.09c0-1.12-.34-1.52-1.14-1.52s-1.2,.42-1.21,1.52h2.35Zm-5.45,14.01c-.51,.4-1.14,.64-1.84,.64-1.66,0-3-1.34-3-3,0-.83,.34-1.58,.88-2.12-1.53,.34-2.67,1.7-2.67,3.33,0,1.88,1.53,3.41,3.41,3.41,1.48,0,2.74-.94,3.21-2.27Zm-73.1-11.9c-1.08,0-1.28-.47-1.28-1.76,0-1.17,.27-1.6,1.27-1.6,.33,0,1.03,.08,1.03,.08,0-.18,.02-.35,.03-.53,0,0-.78-.13-1.18-.13-1.3,0-1.81,.61-1.81,2.18,0,1.71,.41,2.33,1.79,2.33,.4,0,1.21-.11,1.21-.11,0-.18-.02-.36-.03-.54,0,0-.7,.08-1.03,.08m35.95-1.08l.66-.02,1.25,1.95h.72l-1.43-2.27,1.37-1.93h-.71l-1.2,1.7-.66,.03v-3.57h-.63v6.04h.63v-1.93Zm-5.83-1.16s.74-.41,1.53-.57v-.64c-.81,.16-1.54,.66-1.54,.66v-.57h-.62v4.2h.63v-3.09Zm-34.47,51.11c.96,.15,1.18,.26,1.18,.72,0,.6-.39,.75-1.11,.75-.45,0-1.45-.15-1.45-.15-.01,.19-.02,.38-.03,.57,0,0,.98,.16,1.54,.16,1.05,0,1.7-.33,1.7-1.36,0-.85-.41-1.07-1.51-1.26-.93-.16-1.14-.27-1.14-.68,0-.52,.41-.67,.96-.67s1.54,.14,1.54,.14c0-.19,.01-.37,.02-.56,0,0-.93-.17-1.59-.17-.8,0-1.58,.32-1.58,1.28,0,.88,.47,1.06,1.47,1.22m27.37-2.51c-.63,0-1.32,.33-1.32,.33v-2.11h-.64v6.15h.64v-3.54s.6-.26,1.21-.26c.79,0,.92,.42,.92,1.55v2.24h.64v-2.26c0-1.52-.27-2.11-1.45-2.11m-33.01,.1v4.39h.66v-3.57s.6-.32,1.24-.32c.82,0,.95,.43,.95,1.59v2.3h.65v-2.32c0-1.56-.27-2.16-1.48-2.16-.65,0-1.36,.39-1.36,.39v-.31h-.65Zm4.04,36.94c1.26,0,2,.66,1.9,2.21-.01,.18-.02,.36-.04,.54h-3.12c0,1.01,.31,1.54,1.24,1.54,.71,0,1.74-.08,1.74-.08,0,.19,.01,.37,.02,.56,0,0-1.08,.14-1.84,.14-1.41,0-1.87-.81-1.87-2.42,0-1.8,.77-2.49,1.97-2.49m1.19,2.18c0-1.17-.36-1.59-1.19-1.59s-1.26,.44-1.27,1.59h2.46Zm34.98-38.83v-.3h-.63v4.28h.64v-3.48s.54-.32,1.15-.32c.78,0,.9,.4,.9,1.58v2.21h.64v-2.23c0-.51-.04-1.05-.11-1.25,0,0,.57-.32,1.21-.32,.77,0,.9,.42,.9,1.55v2.24h.64v-2.26c0-1.55-.28-2.11-1.45-2.11-.76,0-1.53,.44-1.53,.44-.22-.31-.54-.44-1.11-.44-.61,0-1.25,.39-1.25,.39m-33.44,41.46h.71v-6.78h-.71v6.78Zm-6.24-.32s-.73,.41-1.44,.41c-.93,0-1.7-.37-1.7-2.41,0-1.66,.54-2.49,1.97-2.49,.41,0,1.02,.09,1.16,.12v-2.09h.7v6.78h-.7v-.32Zm-1.35-.22c.67,0,1.35-.35,1.35-.35v-3.2c-.15-.03-.74-.11-1.12-.11-.99,0-1.29,.65-1.29,1.88,0,1.53,.5,1.79,1.06,1.79m37.82-36.86c-1.44,0-1.83-.71-1.83-2.27,0-1.47,.48-2.18,1.83-2.18s1.83,.7,1.83,2.18c0,1.56-.38,2.27-1.83,2.27m0-3.89c-.91,0-1.17,.43-1.17,1.62s.16,1.72,1.17,1.72,1.17-.51,1.17-1.72-.26-1.62-1.17-1.62m11.05-.56c1.14,0,1.82,.6,1.72,2-.01,.16-.02,.33-.03,.49h-2.83c0,.92,.28,1.4,1.12,1.4,.64,0,1.58-.08,1.58-.08,0,.17,.01,.34,.02,.51,0,0-.98,.13-1.67,.13-1.28,0-1.7-.74-1.7-2.19,0-1.63,.7-2.25,1.79-2.25m1.08,1.98c0-1.06-.33-1.44-1.08-1.44s-1.14,.4-1.15,1.44h2.23Zm-11.22,38.95c0,.17,.01,.33,.02,.5,0,0-.96,.13-1.64,.13-1.25,0-1.66-.72-1.66-2.15,0-1.6,.69-2.21,1.76-2.21s1.78,.59,1.69,1.97c-.01,.16-.02,.32-.03,.48h-2.77c0,.9,.28,1.37,1.1,1.37,.63,0,1.55-.08,1.55-.08m-1.53-3.21c-.71,0-1.12,.39-1.13,1.41h2.19c0-1.04-.32-1.41-1.06-1.41m-38-33.24h.66v-4.39h-.66v4.39Zm40.38,32.79v4.2h.63v-3.41s.58-.31,1.18-.31c.78,0,.91,.41,.91,1.52v2.2h.62v-2.22c0-1.5-.26-2.07-1.42-2.07-.62,0-1.3,.38-1.3,.38v-.29h-.62Zm6.83-1.83h.62v6.03h-.62v-.29s-.65,.36-1.28,.36c-.82,0-1.51-.33-1.51-2.14,0-1.48,.48-2.22,1.76-2.22,.36,0,.91,.08,1.03,.11v-1.86Zm0,2.4c-.13-.02-.66-.1-1-.1-.88,0-1.14,.58-1.14,1.67,0,1.36,.44,1.59,.94,1.59,.6,0,1.2-.31,1.2-.31v-2.85Zm-46.55-39.5h-.66v.76h.66v-.76Zm74.77,7.42c-.1-.22-.12-.47-.12-.7,0-.25,.05-.46,.21-.66,.13-.17,.34-.33,.52-.46-.2-.13-.26-.42-.26-.63,0-.15,.24-.6,.31-.72-.58-.26-.72-.82-.72-1.38,0-1.12,.69-1.57,1.71-1.57,.16,0,.32,.01,.48,.03,.14,.02,.34,.05,.47,.08,.45-.01,.9-.02,1.36-.04v.59l-.87-.02c.25,.25,.3,.59,.3,.92,0,.45-.08,.95-.47,1.24-.35,.26-.88,.3-1.3,.3-.1,0-.35-.02-.45-.04-.04,.09-.17,.42-.17,.52,0,.06,0,.13,.02,.19,.02,.07,.05,.11,.12,.15,.09,.05,.25,.07,.35,.07,.19,.01,.44,.02,.63,.02,.37,0,.9,.02,1.25,.19,.22,.11,.35,.27,.43,.5,.07,.2,.09,.44,.09,.65,0,.53-.19,.95-.68,1.2-.4,.21-.92,.25-1.36,.25-.41,0-.96-.02-1.34-.19-.23-.1-.41-.26-.51-.49Zm.87-3.8c.2,.19,.52,.23,.78,.23s.59-.03,.8-.21c.22-.19,.26-.52,.26-.79s-.04-.59-.25-.79c-.21-.19-.54-.22-.8-.22s-.58,.04-.78,.23c-.21,.2-.25,.51-.25,.78s.04,.58,.25,.77Zm-.31,3.04c0,.35,.07,.62,.44,.76,.25,.09,.6,.11,.87,.11s.6-.02,.86-.12c.33-.13,.47-.38,.47-.73,0-.13,0-.28-.06-.41-.06-.15-.15-.23-.3-.28-.21-.07-.56-.07-.77-.07-.25,0-.74-.03-.99-.05-.12,.09-.28,.2-.37,.33-.11,.14-.14,.29-.14,.47Zm2.2,31.68c.46-.01,.91-.02,1.37-.04v.59c-.29,0-.59-.01-.88-.02,.25,.25,.31,.59,.31,.92,0,.45-.08,.96-.48,1.26-.36,.27-.89,.31-1.31,.31-.1,0-.36-.02-.45-.04-.04,.09-.17,.42-.17,.53,0,.06,0,.13,.02,.19,.02,.07,.05,.11,.12,.15,.09,.05,.25,.07,.35,.07,.19,.01,.45,.02,.63,.02,.37,0,.91,.02,1.26,.19,.22,.11,.36,.27,.44,.5,.07,.2,.09,.44,.09,.66,0,.53-.19,.96-.68,1.21-.4,.21-.93,.26-1.37,.26-.41,0-.96-.02-1.35-.19-.24-.1-.41-.26-.52-.5-.1-.22-.12-.47-.12-.71,0-.25,.05-.47,.21-.67,.14-.18,.35-.34,.52-.47-.2-.13-.26-.42-.26-.64,0-.15,.24-.61,.31-.73-.58-.26-.73-.83-.73-1.4,0-1.13,.7-1.58,1.73-1.58,.16,0,.33,.01,.48,.03,.14,.02,.34,.05,.48,.09Zm-1.92,4.83c-.11,.15-.14,.3-.14,.48,0,.35,.07,.63,.44,.76,.25,.09,.61,.11,.87,.11s.61-.02,.87-.12c.34-.14,.48-.38,.48-.74,0-.13-.01-.29-.06-.41-.06-.15-.15-.23-.3-.28-.21-.07-.56-.07-.78-.07-.25,0-.75-.03-1-.05-.13,.09-.28,.2-.37,.33Zm2.02-3.37c0-.27-.04-.6-.26-.8-.21-.19-.54-.22-.81-.22s-.58,.04-.79,.23c-.21,.2-.25,.52-.25,.78s.04,.58,.25,.78c.21,.19,.52,.23,.79,.23s.59-.03,.81-.21c.22-.2,.26-.52,.26-.79Zm6.37-3.51h.68v6.64h-.68v-.31c-.09,.05-.24,.12-.33,.16-.11,.05-.23,.09-.35,.12-.23,.07-.48,.12-.73,.12-.62,0-1.11-.17-1.4-.78-.22-.46-.27-1.08-.27-1.58,0-.55,.06-1.22,.35-1.71,.35-.58,.96-.74,1.58-.74,.18,0,.39,.02,.57,.04,.15,.02,.42,.05,.57,.08v-2.04Zm0,2.64c-.15-.03-.4-.06-.55-.08-.17-.02-.38-.04-.55-.04-.48,0-.86,.15-1.07,.62-.16,.36-.19,.84-.19,1.22,0,.35,.03,.77,.14,1.1,.06,.19,.16,.37,.33,.49,.17,.12,.37,.16,.57,.16,.23,0,.46-.04,.68-.1,.19-.05,.46-.15,.64-.24v-3.14Zm4.63-.58c-.25-.11-.54-.13-.81-.13-.25,0-.5,.05-.74,.13-.21,.07-.5,.18-.69,.29v-.32h-.68v4.62h.69v-3.76c.2-.11,.48-.21,.71-.26,.25-.06,.49-.09,.75-.07,.67,.05,.78,.5,.83,1.06,.02,.31,.02,1.2,.02,1.51v1.51h.68v-2.44c0-.46-.02-1.11-.2-1.55-.11-.28-.29-.48-.56-.6Zm-14.73,.64c.23,.46,.28,1.08,.28,1.58,0,.55-.05,1.27-.37,1.76-.18,.28-.43,.46-.73,.56-.29,.1-.61,.13-.92,.13-.35,0-.69-.04-1.04-.09v2.05h-.69v-6.67h.68v.33c.09-.05,.23-.12,.33-.17,.11-.05,.23-.09,.34-.13,.23-.07,.48-.13,.72-.13,.61,0,1.11,.19,1.4,.77Zm-.43,1.58c0-.35-.03-.77-.16-1.1-.17-.42-.46-.63-.91-.63-.22,0-.45,.05-.66,.11-.19,.06-.45,.16-.62,.26v3.12c.2,.03,.3,.05,.5,.07,.16,.02,.34,.03,.5,.03,.22,0,.46-.02,.66-.11,.22-.1,.38-.25,.48-.47,.18-.36,.2-.88,.2-1.28Zm-2.59-32.59h-.69v-6.61h.68v.33c.09-.05,.23-.12,.32-.16,.11-.05,.22-.09,.34-.13,.23-.07,.47-.13,.71-.13,.6,0,1.1,.19,1.39,.76,.23,.46,.27,1.07,.27,1.57,0,.55-.05,1.26-.36,1.74-.18,.28-.42,.45-.73,.56-.29,.1-.61,.13-.91,.13-.35,0-.68-.04-1.03-.09v2.04Zm0-2.63c.2,.03,.29,.05,.49,.07,.16,.02,.34,.03,.5,.03,.22,0,.45-.02,.66-.11,.22-.09,.37-.25,.48-.47,.18-.36,.2-.88,.2-1.26,0-.35-.03-.76-.16-1.09-.16-.42-.46-.62-.9-.62-.22,0-.45,.05-.65,.11-.19,.06-.44,.16-.61,.26v3.09Zm15.71,2.63h-.69v-6.61h.68v.33c.09-.05,.23-.12,.32-.16,.11-.05,.22-.09,.34-.13,.23-.07,.47-.13,.71-.13,.6,0,1.1,.19,1.39,.76,.23,.46,.27,1.07,.27,1.57,0,.55-.05,1.26-.36,1.75-.18,.28-.42,.45-.73,.56-.29,.1-.61,.13-.91,.13-.35,0-.68-.04-1.03-.09v2.04Zm0-2.63c.2,.03,.3,.05,.49,.07,.16,.02,.34,.03,.5,.03,.22,0,.45-.02,.66-.11,.22-.09,.37-.25,.48-.47,.18-.36,.2-.88,.2-1.27,0-.35-.03-.76-.16-1.09-.16-.42-.46-.62-.9-.62-.22,0-.44,.05-.65,.11-.19,.06-.44,.16-.61,.26v3.09Zm-2.51-.26c-.2,.12-.47,.21-.69,.27-.25,.06-.49,.09-.74,.06-.26-.02-.49-.1-.62-.35-.11-.21-.14-.5-.15-.72-.02-.3-.01-1.19-.01-1.49v-1.49h-.69v2.39c0,.45,.01,1.11,.18,1.54,.11,.28,.28,.48,.56,.6,.25,.11,.55,.13,.81,.13,.24,0,.48-.05,.7-.12,.11-.04,.23-.08,.33-.13,.09-.04,.23-.11,.32-.16v.32h.69v-4.58h-.69v3.72Zm-503.63-51.39c.15-.1,.78-.45,.78-1.28,0-.93-.44-1.4-1.68-1.4-.8,0-1.55,.22-1.55,.22,.02,.16,.04,.32,.06,.49,0,0,.74-.16,1.47-.16,.78,0,1.08,.27,1.08,.87s-.56,1.04-.96,1.04h-1.06v.53h1.06c.6,0,1.08,.33,1.08,1.05,0,.68-.36,1.09-1.14,1.1-.75,0-1.61-.18-1.61-.18-.02,.17-.04,.33-.06,.5,0,0,.9,.21,1.73,.21,1.19,0,1.71-.6,1.71-1.66,0-.85-.37-1.15-.91-1.34m-3.44,.1h-2.27v-2.15h2.69v-.54h-3.3v5.52h.61v-2.28h2.27v-.54Zm38.83,0h-2.27v-2.15h2.69v-.54h-3.3v5.52h.61v-2.28h2.27v-.54Zm3.9-.39h-.61v1.64h-1.91l1.52-3.95h-.67l-1.5,4.01v.48h2.55v1.03h.61v-1.03h.67v-.54h-.67v-1.64Zm50.8,.9h2.27v-.54h-2.27v-2.15h2.69v-.54h-3.3v5.52h.61v-2.28Zm6.73,.44c0-1.12-.65-1.64-1.67-1.64-.62,0-1.24,.33-1.24,.33l.14-1.81h2.56v-.56h-3.07c-.05,.94-.1,1.89-.14,2.83,.14,.03,.28,.05,.42,.08,0,0,.6-.32,1.25-.32s1.12,.33,1.12,1.13-.46,1.32-1.19,1.32-1.62-.18-1.62-.18c-.02,.16-.05,.32-.07,.49,0,0,.94,.22,1.75,.22,1.1,0,1.76-.69,1.76-1.91m36.21-1.58c1.16,0,1.77,.61,1.77,1.71s-.67,1.81-1.84,1.81c-1.31,0-1.88-1.18-1.88-2.89,0-1.91,.81-2.78,2.06-2.78,.67,0,1.44,.14,1.44,.14-.02,.17-.04,.33-.06,.5,0,0-.72-.1-1.39-.1-.92,0-1.42,.75-1.42,1.91,0,0,.74-.31,1.32-.31m-.07,2.99c.78,0,1.2-.5,1.2-1.28s-.44-1.17-1.17-1.17c-.61,0-1.28,.3-1.28,.3,0,1.12,.34,2.14,1.25,2.14m-2.7-2.36h-2.27v-2.15h2.69v-.54h-3.3v5.52h.61v-2.28h2.27v-.54Zm39.1-2.18h2.65v.21l-1.99,4.65,.58,.18,2.03-4.79v-.81h-3.27v.56Zm-3.3-.02h2.69v-.54h-3.3v5.52h.61v-2.28h2.27v-.54h-2.27v-2.15Zm44.72,2.11c.57,.26,.96,.65,.96,1.4,0,1.16-.89,1.58-1.99,1.58s-1.96-.4-1.96-1.49c0-.82,.37-1.2,.91-1.49-.55-.27-.82-.66-.82-1.32,0-.91,.73-1.37,1.87-1.37s1.91,.45,1.91,1.38c0,.68-.26,1.04-.88,1.31m-2.25-1.24c0,.49,.26,.82,.78,1h.84c.54-.18,.85-.51,.85-1,0-.63-.47-.89-1.24-.89s-1.23,.25-1.23,.88m1.22,3.68c.78,0,1.33-.32,1.33-1.09,0-.61-.41-.89-.93-1.04h-.84c-.55,.15-.87,.5-.87,1.09,0,.73,.56,1.04,1.31,1.04m-4.91-1.8h2.27v-.54h-2.27v-2.15h2.69v-.54h-3.3v5.52h.61v-2.28Zm61.83-3.32c1.32,0,1.91,1.23,1.91,2.9,0,2.04-.79,2.77-2.09,2.77-.67,0-1.44-.14-1.44-.14,.02-.17,.04-.33,.06-.49,0,0,.72,.1,1.39,.1,.96,0,1.44-.67,1.45-1.91,0,0-.8,.3-1.37,.3-1.1,0-1.72-.57-1.72-1.68s.72-1.84,1.83-1.84m-.06,2.98c.55,0,1.33-.29,1.33-.29-.02-1.15-.35-2.15-1.28-2.15-.74,0-1.19,.56-1.19,1.3s.4,1.14,1.13,1.14m-2.69-.21h-2.27v-2.15h2.69v-.54h-3.3v5.52h.61v-2.28h2.27v-.54Zm42.36-2.78c1.24,0,1.92,.72,1.92,2.89,0,2.02-.71,2.78-1.91,2.78s-1.92-.75-1.92-2.77c0-2.17,.7-2.9,1.91-2.9m0,5.14c.83,0,1.28-.6,1.28-2.25,0-1.77-.41-2.34-1.28-2.34s-1.28,.55-1.28,2.34c0,1.65,.45,2.24,1.28,2.24m-3.52-4.37v4.83h.61v-5.52h-.57l-1.68,1.12,.28,.46,1.36-.89Zm-4.85-.14h2.69v-.54h-3.3v5.52h.61v-2.28h2.27v-.54h-2.27v-2.15Zm43.48,.14v4.83h.61v-5.52h-.57l-1.68,1.12,.28,.46,1.36-.89Zm-2.58,2.01h-2.27v-2.15h2.69v-.54h-3.3v5.52h.61v-2.28h2.27v-.54Zm6.03-2.01v4.83h.61v-5.52h-.57l-1.68,1.12,.28,.46,1.36-.89Zm29.07,1.7h2.27v-.54h-2.27v-2.15h2.69v-.54h-3.3v5.52h.61v-2.28Zm8.92,.24c.73-.73,1-1.26,1-2.05,0-.99-.56-1.51-1.67-1.51-.76,0-1.52,.21-1.52,.21,.02,.17,.03,.34,.05,.51,0,0,.78-.18,1.36-.18,.76,0,1.15,.32,1.15,1.02,0,.62-.31,1.13-.96,1.81-.55,.57-1.09,1.13-1.63,1.7v.52h3.37v-.53h-2.64c.5-.5,1-1,1.5-1.51m-4.06-2.79v4.83h.61v-5.52h-.57l-1.68,1.12,.28,.46,1.36-.89Zm-420.16,2.9h-2.27v-2.15h2.69v-.54h-3.3v5.52h.61v-2.28h2.27v-.54Zm3.19,.78c.73-.73,1.01-1.26,1.01-2.05,0-.99-.56-1.51-1.67-1.51-.77,0-1.52,.21-1.52,.21,.02,.17,.03,.34,.05,.51h0s.78-.17,1.36-.17c.76,0,1.15,.32,1.15,1.02,0,.62-.31,1.13-.96,1.81-.55,.57-1.09,1.13-1.63,1.7v.52h3.37v-.53h-2.64c.5-.5,1-1.01,1.5-1.51m-42.84-.28h2.27v-.54h-2.27v-2.15h2.69v-.54h-3.3v5.52h.61v-2.28Zm4.85-2.55v4.83h.61v-5.52h-.57l-1.67,1.12,.28,.46,1.36-.89Zm-80.89,3.51c0,.19,.01,.37,.02,.56,0,0-1.08,.14-1.84,.14-1.41,0-1.87-.81-1.87-2.42,0-1.79,.77-2.48,1.97-2.48s2,.66,1.9,2.21c-.01,.18-.02,.36-.04,.54h-3.12c0,1.01,.31,1.54,1.24,1.54,.71,0,1.74-.09,1.74-.09m-1.72-3.61c-.8,0-1.26,.44-1.27,1.59h2.45c0-1.17-.36-1.59-1.19-1.59m4,2.1c1.03,.16,1.27,.28,1.27,.77,0,.64-.42,.81-1.19,.81-.48,0-1.56-.16-1.56-.16-.01,.2-.02,.41-.04,.61,0,0,1.06,.17,1.66,.17,1.13,0,1.83-.36,1.83-1.46,0-.92-.44-1.15-1.62-1.35-1-.17-1.23-.29-1.23-.74,0-.56,.44-.72,1.03-.72s1.65,.15,1.65,.15c0-.2,.01-.4,.02-.6,0,0-1-.18-1.71-.18-.86,0-1.7,.34-1.7,1.38,0,.94,.51,1.14,1.58,1.31m4.49,2.21c.43,0,1.31-.12,1.31-.12,0-.19-.02-.39-.03-.59,0,0-.75,.08-1.11,.08-1.17,0-1.39-.51-1.39-1.91,0-1.27,.29-1.74,1.38-1.74,.36,0,1.11,.08,1.11,.08,0-.19,.02-.38,.03-.58,0,0-.85-.14-1.28-.14-1.41,0-1.96,.66-1.96,2.37,0,1.85,.44,2.53,1.95,2.53m575.65,196.1l-3.39,2.85,3.39,2.85,.49-.59-2.69-2.26,2.69-2.26-.49-.59Zm72.68,.59l2.69,2.26-2.69,2.26,.49,.59,3.39-2.85-3.39-2.85-.49,.59Zm-36.59,3.01l-2.26-2.69-.59,.49,2.85,3.39,2.85-3.39-.59-.49-2.26,2.69Zm-3.04-37.12l.63,.53,2.41-2.88,2.41,2.88,.63-.53-3.04-3.63-3.04,3.63Zm-528.74-3.72h3.76v.23l-3.76,5.36v.92h4.69v-.71h-3.77v-.21l3.77-5.36v-.94h-4.69v.71Zm193.61,5.8h-.22l-2.76-6.51h-1.5v7.22h.8v-6.51h.2l2.81,6.51h1.47v-7.22h-.79v6.51Zm-37.44-1.31c0,1.52-.88,2.02-2.23,2.02h-2.75v-7.22h2.62c1.41,0,2.15,.55,2.15,1.83,0,.94-.34,1.39-.93,1.66,.64,.22,1.15,.66,1.15,1.7m-4.18-1.99h1.86c.91,0,1.28-.43,1.28-1.29s-.44-1.2-1.36-1.2h-1.78v2.49Zm1.92,3.31c.88,0,1.45-.28,1.45-1.35s-.95-1.26-1.5-1.26h-1.87v2.61h1.92Zm75.94-.41l-2.04-6.1h-1.45v7.22h.8v-6.36h.15l2.1,6.1h.9l2.1-6.1h.15v6.36h.8v-7.22h-1.45l-2.04,6.1Zm-113.96,.41h-.58l-1.66-6.51h-.83l1.89,7.22h1.79l1.89-7.22h-.83l-1.66,6.51Zm-74.61-6.51l-1.84,3.09-1.82-3.09h-.91l2.23,3.68-2.23,3.53h.87l1.85-2.99,1.81,2.99h.91l-2.22-3.56,2.22-3.66h-.87Zm36.64,.62c.56,0,1.41,.1,1.88,.19l.03-.68c-.46-.09-1.25-.23-1.99-.23-2.17,0-2.64,1.29-2.64,3.73s.48,3.68,2.64,3.68c.69,0,1.48-.1,1.99-.21l-.03-.69c-.5,.09-1.27,.19-1.86,.19-1.65,0-1.91-.96-1.91-2.97s.28-3.01,1.89-3.01m338.34-.36h.76v-.88h-.76v.88Zm2.16,.69v.46h-.64v.66h.64v4.41h.76v-4.41h1.47v-.66h-1.47v-.45c0-.94,.18-1.19,.75-1.19,.3,0,.87,.02,.87,.02,0-.21,0-.42,.01-.63,0,0-.68-.07-1.02-.07-.99,0-1.37,.4-1.37,1.86m-2.16,5.53h.76v-5.07h-.76v5.07Zm7.13-.57c-.66,0-.73-.31-.73-1.42v-2.43h1.61v-.66h-1.61v-1.55h-.75v1.55h-.72v.66h.72v2.67c0,1.46,.35,1.85,1.4,1.85,.36,0,1.04-.1,1.04-.1-.02-.21-.03-.42-.05-.63,0,0-.62,.06-.9,.06m-9.86-4.61c-.75,0-1.56,.39-1.56,.39v-2.5h-.76v7.28h.76v-4.19s.71-.3,1.43-.3c.93,0,1.09,.5,1.09,1.84v2.66h.76v-2.68c0-1.81-.32-2.5-1.71-2.5m-5.04,2.24c-1.08-.18-1.32-.31-1.32-.79,0-.6,.48-.77,1.11-.77s1.78,.16,1.78,.16c0-.22,.01-.43,.02-.65,0,0-1.07-.19-1.84-.19-.92,0-1.83,.37-1.83,1.48,0,1.01,.55,1.23,1.69,1.41,1.11,.17,1.37,.3,1.37,.83,0,.69-.45,.87-1.28,.87-.52,0-1.67-.17-1.67-.17-.01,.22-.03,.44-.04,.66,0,0,1.14,.18,1.79,.18,1.22,0,1.97-.39,1.97-1.57,0-.98-.48-1.24-1.74-1.45m-468.95-3.07h.73v-.85h-.73v.85Zm2.08,.67v.44h-.62v.64h.62v4.26h.73v-4.26h1.42v-.64h-1.42v-.43c0-.91,.18-1.15,.72-1.15,.29,0,.84,.02,.84,.02,0-.2,0-.41,.01-.61,0,0-.66-.07-.99-.07-.96,0-1.32,.38-1.32,1.79m-2.08,5.34h.73v-4.9h-.73v4.9Zm6.88-.55c-.64,0-.71-.3-.71-1.37v-2.34h1.56v-.64h-1.56v-1.5h-.72v1.5h-.7v.64h.7v2.58c0,1.41,.34,1.78,1.35,1.78,.34,0,1-.1,1-.1l-.05-.61s-.6,.06-.87,.06m-9.52-4.45c-.72,0-1.51,.37-1.51,.37v-2.41h-.73v7.03h.73v-4.04s.69-.29,1.38-.29c.9,0,1.05,.48,1.05,1.77v2.57h.73v-2.58c0-1.74-.31-2.41-1.66-2.41m-4.87,2.16c-1.04-.18-1.27-.3-1.27-.76,0-.58,.46-.74,1.07-.74s1.71,.16,1.71,.16c0-.21,.01-.42,.02-.63,0,0-1.04-.19-1.77-.19-.89,0-1.76,.35-1.76,1.43,0,.98,.53,1.18,1.64,1.36,1.07,.17,1.32,.29,1.32,.8,0,.67-.43,.84-1.23,.84-.5,0-1.62-.17-1.62-.17-.01,.21-.03,.42-.04,.64,0,0,1.1,.18,1.72,.18,1.18,0,1.9-.37,1.9-1.52,0-.95-.46-1.19-1.68-1.4m418.61-3.63c-.55,0-1.4,.25-1.4,.25,.01,.17,.03,.34,.04,.51,0,0,.83-.19,1.3-.19,.75,0,1.12,.23,1.12,.82,0,.47-.14,.66-.75,1.18-.44,.38-.78,.7-.78,1.12,0,.29,.11,.51,.11,.51h.53v-.29c0-.38,.25-.64,.75-1.05,.65-.55,.78-.8,.78-1.52,0-.97-.57-1.34-1.69-1.34m-40.7,.94l2.44,1.61-2.44,1.64v.93l3.39-2.23v-.67l-3.39-2.21v.92Zm40.24,5.76h.69v-.94h-.69v.94Zm-78.64-3.92v.74l3.78,2.48v-1.04l-2.72-1.82,2.65-1.76,.06-.04v-1.03l-3.72,2.42-.06,.04Zm65.91,3.91l.74,.26,3.13-7.73-.74-.28-3.13,7.75Zm-73.7-4.96h-1.07l-.59,2.94h.8l.86-2.94Zm37.61,.03h-1.21v1.68h1.21v-1.68Zm-166.68-39.76c1.01,0,2.38,.23,2.38,.23,.01-.24,.02-.47,.03-.71,0,0-1.35-.29-2.51-.29-2.3,0-2.94,1.41-2.94,3.96s.62,3.9,2.96,3.9c.84,0,2.25-.21,2.49-.25v-3.76h-2.11v.76h1.27v2.35c-.29,.06-1.03,.16-1.58,.16-1.77,0-2.14-1.04-2.14-3.16s.39-3.19,2.16-3.19m-151.83-.66l2.1,7.65h-.84l-.55-1.97h-3.27l-.55,1.97h-.84l2.1-7.65h1.86Zm.52,4.92l-1.16-4.19h-.57l-1.16,4.19h2.9Zm303.3-4.92h-.85v7.65h4.21v-.76h-3.36v-6.88Zm-74.54,6.2v-6.6h-.85v6.48c0,1.14-.24,1.19-1.25,1.19v.76c1.46,0,2.1-.19,2.1-1.83m-37.46-2.78h-3.89v-3.43h-.85v7.65h.85v-3.46h3.89v3.46h.84v-7.65h-.84v3.43Zm77.23-3.43h-.97l-1.96,3.51-1.26,.04v-3.56h-.85v7.65h.85v-3.34l1.27-.04,2.03,3.38h1.01l-2.31-3.8,2.19-3.85Zm-193.31,0c2.22,0,2.83,1.55,2.83,3.71s-.57,3.93-2.83,3.93h-2.73v-7.65h2.73m0,6.9c1.59,0,1.96-1.54,1.96-3.18s-.36-2.96-1.96-2.96h-1.88v6.14h1.88m-38.05-3.54c-1.34-.3-1.87-.46-1.87-1.46,0-.88,.55-1.25,1.66-1.25,.32,0,.85,.05,1.33,.1,.28,.03,.57,.06,.85,.09,.03-.24,.05-.48,.08-.72-.28-.04-.54-.08-.82-.11-.48-.06-1.04-.11-1.49-.11-1.49,0-2.46,.57-2.46,2.06s.8,1.85,2.38,2.18c1.25,.27,1.7,.5,1.7,1.35,0,1.06-.53,1.54-1.64,1.54-.4,0-.96-.04-1.44-.1-.28-.03-.57-.07-.85-.1-.03,.24-.06,.47-.09,.71,.3,.06,.57,.08,.87,.12,.49,.05,1.09,.11,1.55,.11,1.5,0,2.44-.66,2.44-2.34,0-1.34-.66-1.7-2.2-2.06m74.02,1.13h3.15v-.75h-3.15v-2.98h3.72v-.75h-4.57v7.65h.85v-3.16Zm-157.75-1.15c-1.02-.17-1.26-.3-1.26-.75,0-.57,.45-.73,1.05-.73s1.69,.16,1.69,.16c0-.21,.01-.41,.02-.62,0,0-1.02-.18-1.75-.18-.88,0-1.74,.35-1.74,1.41,0,.97,.52,1.17,1.61,1.34,1.05,.16,1.3,.29,1.3,.79,0,.66-.42,.83-1.22,.83-.49,0-1.59-.16-1.59-.16-.01,.21-.03,.42-.04,.63,0,0,1.08,.17,1.7,.17,1.16,0,1.87-.37,1.87-1.5,0-.94-.45-1.18-1.66-1.38m-9.23-2.13c1.09,0,1.55,.5,1.55,1.55v3.37h-.72v-.25s-.76,.34-1.63,.34-1.36-.49-1.36-1.47,.48-1.33,1.48-1.43c.51-.05,1.01-.1,1.52-.15v-.41c0-.68-.29-.92-.87-.92-.67,0-1.82,.13-1.82,.13,0-.18-.02-.37-.03-.55,0,0,1.06-.21,1.89-.21m.83,2.52c-.48,.04-.95,.09-1.43,.14-.59,.06-.82,.34-.82,.87,0,.56,.24,.89,.73,.89,.72,0,1.52-.3,1.52-.3v-1.59Zm-4.94,1.85c-1.2,0-1.42-.52-1.42-1.95,0-1.29,.3-1.78,1.41-1.78,.37,0,1.14,.09,1.14,.09,.01-.2,.02-.39,.03-.59,0,0-.87-.15-1.31-.15-1.44,0-2.01,.68-2.01,2.42,0,1.89,.45,2.59,1.99,2.59,.44,0,1.34-.13,1.34-.13,0-.2-.02-.4-.03-.6,0,0-.77,.09-1.14,.09m8.88-4.37c1.22,0,1.75,.74,1.75,2.45,0,1.89-.62,2.56-2.1,2.56-.45,0-.95-.08-1.08-.1v2.14h-.72v-6.96h.71v.35s.73-.44,1.45-.44m-.4,4.39c1.06,0,1.41-.55,1.41-1.94s-.42-1.81-1.12-1.81c-.66,0-1.33,.39-1.33,.39v3.25c.13,.02,.63,.11,1.04,.11m490.75-4.89c-.75,0-1.57,.46-1.57,.46v-.36h-.75v5.07h.76v-4.12s.7-.38,1.43-.38c.94,0,1.1,.5,1.1,1.84v2.66h.75v-2.68c0-1.8-.31-2.49-1.71-2.49m4.6,4.6c-.66,0-.73-.31-.73-1.42v-2.42h1.61v-.66h-1.61v-1.55h-.75v1.55h-.72v.66h.72v2.67c0,1.46,.35,1.85,1.4,1.85,.36,0,1.04-.1,1.04-.1l-.05-.63s-.62,.06-.9,.06m7.15-4.5h-.75v5.07h.76v-3.72s.89-.5,1.85-.69v-.77c-.97,.19-1.86,.8-1.86,.8v-.69Zm-17.13,5.16c-1.51,0-2.01-.87-2.01-2.6,0-1.93,.83-2.67,2.12-2.67s2.15,.71,2.04,2.37c-.01,.19-.03,.39-.04,.58h-3.35c0,1.08,.33,1.65,1.33,1.65,.76,0,1.87-.09,1.87-.09,0,.2,.01,.4,.02,.6,0,0-1.16,.15-1.98,.15m.11-4.63c-.86,0-1.35,.48-1.36,1.7h2.64c0-1.26-.39-1.7-1.28-1.7m13.32-.64c1.35,0,2.15,.71,2.04,2.37-.01,.19-.03,.39-.04,.58h-3.35c0,1.09,.33,1.65,1.33,1.65,.76,0,1.87-.09,1.87-.09,0,.2,.01,.4,.02,.6,0,0-1.16,.15-1.98,.15-1.51,0-2.01-.87-2.01-2.6,0-1.93,.83-2.67,2.12-2.67m1.28,2.34c0-1.26-.38-1.7-1.28-1.7s-1.35,.48-1.36,1.7h2.64Zm-63.2,.44h.91l.48-2.41h-.73l-.66,2.41Zm-1.51,0h.91l.48-2.41h-.73l-.66,2.41Zm-36.47,2.88h.93v-1.3h-.93v1.3Zm0-3.46h.93v-1.31h-.93v1.31Zm28.01-2.31h-.76l-.81,3.3h.91l.66-3.3Zm-38.69-.14h-.66v1.08h.66v-1.08Zm-1.09,6.03h.56l.61-2.45h-.69l-.48,2.45Zm106.41-78.24h14.83v-.61h-14.83l1.77-1.48-.39-.46-2.68,2.25,2.68,2.25,.39-.46-1.77-1.48Zm-122.43-2.98h-.55s.03,.09,.05,.13c0,.02,.56,1.52,.56,2.61s-.55,2.46-.56,2.47c-.02,.05-.04,.09-.06,.14h.56s.02-.04,.03-.06c.02-.05,.61-1.3,.61-2.55s-.58-2.63-.6-2.69c0-.02-.02-.04-.03-.06m-38.3,2.75c0-1.1,.55-2.6,.56-2.61,.02-.05,.03-.09,.05-.14h-.55l-.03,.06c-.02,.06-.6,1.44-.6,2.69s.58,2.5,.6,2.55c0,.02,.02,.04,.03,.06h.56s-.04-.09-.06-.14c0-.01-.55-1.39-.55-2.47m-306.24-3.1h-.69l.04,4.06h.6l.04-4.06Zm153.63,.07l-1.73,5.79,.41,.12,1.73-5.77-.41-.14Zm-38.75,2.73c.88,.21,1.28,.45,1.28,1.26,0,1.05-.58,1.46-1.52,1.46h-.11c-.03,.28-.07,.55-.1,.83,0,0-.37-.02-.37-.05,.03-.27,.07-.53,.1-.8-.5-.04-1.03-.12-1.03-.12,.02-.15,.04-.29,.06-.44,0,0,.56,.08,1.03,.11l.24-1.8c-.91-.21-1.36-.46-1.36-1.33,0-.92,.61-1.28,1.53-1.28,.05,0,.11,0,.17,0,.04-.31,.08-.62,.12-.93h.37c-.04,.32-.08,.63-.12,.95,.45,.04,.9,.11,.9,.11-.01,.15-.03,.3-.04,.45,0,0-.5-.06-.92-.09-.07,.56-.14,1.12-.22,1.68m-.36-.08c.07-.54,.14-1.08,.21-1.62h-.07c-.67,0-1.03,.24-1.03,.78s.26,.69,.89,.84m.09,2.34c.68,0,1.02-.3,1.02-.96,0-.47-.22-.65-.81-.79-.07,.58-.15,1.16-.22,1.74h.01m154.13-3.46l-.64-.21-.41,1.28-1.09-.8-.4,.53,1.09,.8-1.1,.8,.39,.53,1.09-.8,.42,1.29,.63-.19-.41-1.28h1.35v-.66h-1.33l.41-1.29Zm-37.31,1.23c-.06,.56-.21,1.28-.37,1.65,.34,.32,.68,.65,1.03,.97-.12,.13-.24,.26-.36,.39-.32-.3-.64-.59-.96-.89-.37,.6-.95,.9-1.71,.9-1.49,0-1.96-.64-1.96-1.69,0-.95,.4-1.34,1.23-1.61-.4-.45-.45-.72-.45-1.18,0-.7,.5-1.17,1.38-1.17,.93,0,1.38,.47,1.38,1.21s-.37,1.11-1.22,1.5c.4,.4,.81,.8,1.21,1.19,.09-.25,.2-.91,.22-1.29,.19,0,.39,0,.58,0m-2.16-2.11c-.5,0-.79,.24-.79,.75,0,.29,.06,.59,.36,.87,.08,.07,.15,.15,.23,.22,.7-.3,.98-.54,.98-1.11,0-.48-.23-.73-.78-.73m-.25,4.59c.6,0,1.09-.22,1.34-.72-.56-.56-1.12-1.11-1.68-1.67-.69,.21-.97,.52-.97,1.19,0,.78,.37,1.19,1.3,1.19m-190.96-5.31c1.97,0,2.81,.9,2.81,2.73v.08c0,1.68-.44,1.94-1.14,1.94-.65,0-.77-.39-.77-.39,0,0-.64,.38-1.14,.38-.56,0-1.15-.2-1.15-1.64,0-1.1,.31-1.69,1.33-1.69,.32,0,.75,.17,.75,.17v-.1h.49v1.25c0,1.47,.03,1.62,.5,1.62,.39,0,.63-.13,.63-1.54v-.09c0-1.6-.65-2.3-2.31-2.3s-2.47,.77-2.47,2.59c0,1.93,.75,2.6,2.47,2.6,.29,0,.94-.07,.94-.07,0,.15,.01,.29,.02,.44,0,0-.62,.06-.95,.06-1.94,0-2.96-.67-2.96-3.03,0-2.16,1.08-3.02,2.96-3.02m-.22,4.33c.35,0,.9-.27,.95-.3-.01-.08-.06-.63-.06-1.13v-.91s-.39-.13-.67-.13c-.75,0-.91,.44-.91,1.28,0,1.01,.35,1.2,.69,1.2m153.06-2.8l-1.62,2.98h.7l1.22-2.33,1.25,2.33h.7l-1.67-2.98h-.59Zm-38.22-.2c0,.82-.36,1.19-.93,1.19s-.93-.37-.93-1.19,.36-1.17,.93-1.17,.93,.36,.93,1.17m-.93,.76c.31,0,.42-.26,.42-.76s-.11-.74-.42-.74-.41,.24-.41,.74,.11,.76,.41,.76m-152.45,3.96h.72v-.98h-.72v.98Zm154.86-2.49c.58,0,.93,.36,.93,1.17s-.36,1.18-.93,1.18-.92-.37-.92-1.19,.35-1.16,.92-1.16m0,1.93c.32,0,.42-.26,.42-.76s-.1-.74-.42-.74c-.3,0-.41,.24-.41,.73s.11,.77,.41,.77m-76.53-3.87h1.01v.58h-1.01v1.69h1.01v.58h-1.01v1.58h-.62v-1.58h-1.4v1.58h-.62v-1.58h-1.01v-.58h1.01v-1.69h-1.01v-.58h1.01v-1.62h.62v1.62h1.4v-1.62h.62v1.62Zm-.62,.58h-1.4v1.69h1.4v-1.69Zm344.48-.92h-.53v1.48h-1.43v.52h1.43v1.49h.53v-1.49h1.45v-.52h-1.45v-1.48Zm-40.94,3.49h4.71v-.73h-4.71v.73Zm-417.34-1.65c-.03-.18-.06-.36-.09-.53,0,0-.57,.4-.89,.4-.4,0-1.26-.53-1.75-.53s-1.01,.46-1.01,.46c.03,.18,.06,.36,.1,.54,0,0,.56-.41,.91-.41,.37,0,1.26,.54,1.75,.54s.99-.47,.99-.47m296.1-.29c.75,.34,1.26,.85,1.26,1.85,0,1.52-1.17,2.08-2.61,2.08s-2.58-.53-2.58-1.96c0-1.08,.48-1.57,1.2-1.96-.72-.36-1.08-.87-1.08-1.73,0-1.2,.95-1.8,2.47-1.8s2.51,.6,2.51,1.82c0,.89-.35,1.36-1.15,1.72m-2.96-1.64c0,.64,.35,1.08,1.03,1.32h1.1c.71-.23,1.12-.67,1.12-1.31,0-.83-.62-1.18-1.64-1.18s-1.62,.34-1.62,1.16m1.61,4.84c1.03,0,1.75-.42,1.75-1.44,0-.81-.54-1.18-1.23-1.37h-1.1c-.72,.2-1.14,.66-1.14,1.44,0,.95,.73,1.37,1.72,1.37m-270.54-5.17l.37,.61,1.78-1.17v6.36h.81v-7.26h-.76l-2.2,1.47Zm155.69,1.22c-.82,0-1.63,.43-1.63,.43,.06-.79,.13-1.59,.19-2.38h3.37v-.73h-4.04l-.19,3.73c.18,.03,.37,.07,.56,.1,0,0,.79-.42,1.65-.42s1.47,.44,1.47,1.49-.61,1.74-1.56,1.74-2.13-.23-2.13-.23c-.03,.21-.06,.43-.09,.64,0,0,1.24,.29,2.3,.29,1.45,0,2.32-.91,2.32-2.51,0-1.48-.85-2.15-2.2-2.15m-117.29,3.89v.68h4.43v-.7h-3.47c.66-.66,1.31-1.32,1.97-1.98,.96-.97,1.32-1.66,1.32-2.7,0-1.3-.73-1.98-2.19-1.98-1.01,0-2,.28-2,.28,.02,.22,.04,.45,.06,.67,0,0,1.03-.23,1.79-.23,1,0,1.51,.42,1.51,1.34,0,.82-.41,1.49-1.27,2.38-.72,.75-1.43,1.49-2.15,2.24m311.33-2.89c0,2.65-.93,3.66-2.52,3.66s-2.53-.99-2.53-3.65c0-2.85,.92-3.81,2.52-3.81s2.53,.94,2.53,3.8m-4.21,.01c0,2.17,.6,2.95,1.69,2.95s1.69-.79,1.69-2.96c0-2.33-.54-3.07-1.69-3.07s-1.69,.72-1.69,3.08m-226.62-.67h-.81v2.16h-2.51l2-5.19h-.88l-1.97,5.28v.63h3.36v1.35h.81v-1.35h.88v-.71h-.88v-2.16Zm114.66-2.02l-2.61,6.12,.77,.23,2.67-6.3v-1.06h-4.3v.73h3.48v.27Zm-152.54,.72c0-1.23-.58-1.84-2.21-1.84-1.05,0-2.04,.29-2.04,.29,.02,.21,.05,.43,.07,.64,0,0,.98-.21,1.93-.21,1.03,0,1.42,.36,1.42,1.14s-.73,1.36-1.26,1.36h-1.4v.69h1.4c.79,0,1.43,.43,1.43,1.38,0,.89-.47,1.44-1.5,1.45-.99,0-2.12-.23-2.12-.23-.02,.22-.05,.44-.07,.66,0,0,1.19,.27,2.28,.27,1.56,0,2.25-.79,2.25-2.18,0-1.12-.49-1.51-1.2-1.76,.2-.13,1.03-.6,1.03-1.68m113,.99c1.53,0,2.33,.8,2.33,2.26s-.88,2.38-2.42,2.38c-1.72,0-2.48-1.55-2.48-3.8,0-2.51,1.06-3.66,2.71-3.66,.88,0,1.9,.18,1.9,.18-.02,.22-.05,.44-.07,.66,0,0-.94-.13-1.83-.13-1.21,0-1.87,.99-1.87,2.52,0,.01,.98-.41,1.73-.41m-.09,3.94c1.03,0,1.58-.66,1.58-1.68s-.58-1.53-1.54-1.53c-.81,0-1.69,.4-1.69,.4,0,1.48,.45,2.81,1.65,2.81m114.89-6.76c1.74,0,2.51,1.62,2.51,3.82,0,2.69-1.04,3.64-2.75,3.64-.88,0-1.9-.18-1.9-.18,.02-.22,.05-.43,.07-.65,0,0,.94,.13,1.83,.13,1.27,0,1.9-.88,1.91-2.52,0,0-1.05,.4-1.8,.4-1.45,0-2.27-.76-2.27-2.21s.94-2.42,2.4-2.42m-.07,3.92c.72,0,1.75-.38,1.75-.38-.02-1.51-.46-2.83-1.68-2.83-.98,0-1.56,.73-1.56,1.71s.52,1.5,1.49,1.5m75.18,.17h3.18v-.73h-3.18v.73Zm37.65-.98h4.53v-.72h-4.53v.72Zm0,1.94h4.53v-.72h-4.53v.72Zm-458.78-2.46l2.04,.97,.28-.5-2.03-1.02-.28,.54Zm776.64,152.9h-.72v1.18h.72v-1.18Zm3.27-113.85c0-1.42,.95-2.44,2.42-2.44,1.75,0,2.52,1.62,2.52,3.84,0,2.7-1.04,3.66-2.76,3.66-.89,0-1.91-.18-1.91-.18,.02-.22,.05-.44,.07-.65,0,0,.95,.13,1.83,.13,1.28,0,1.91-.89,1.92-2.53,0,0-1.06,.4-1.81,.4-1.46,0-2.28-.76-2.28-2.23m2.42-1.72c-.98,0-1.57,.74-1.57,1.72s.53,1.51,1.5,1.51c.73,0,1.76-.38,1.76-.38-.02-1.52-.46-2.85-1.69-2.85m-41.84,2.84c.75,.34,1.27,.85,1.27,1.86,0,1.53-1.18,2.09-2.63,2.09s-2.6-.53-2.6-1.97c0-1.09,.49-1.58,1.2-1.97-.73-.36-1.09-.88-1.09-1.74,0-1.2,.96-1.81,2.48-1.81s2.52,.6,2.52,1.82c0,.9-.35,1.37-1.16,1.73m-2.98-1.65c0,.64,.35,1.09,1.03,1.33h1.11c.72-.23,1.13-.68,1.13-1.32,0-.83-.62-1.18-1.64-1.18s-1.63,.34-1.63,1.17m1.61,4.86c1.03,0,1.76-.42,1.76-1.45,0-.81-.54-1.18-1.23-1.38h-1.11c-.73,.2-1.15,.66-1.15,1.45,0,.96,.74,1.38,1.73,1.38m-2.79,74.05v.69h4.45v-.71h-3.49c.66-.67,1.32-1.33,1.98-1.99,.96-.97,1.33-1.67,1.33-2.71,0-1.31-.74-1.99-2.2-1.99-1.01,0-2.02,.28-2.02,.28,.02,.23,.04,.45,.06,.68,0,0,1.03-.23,1.8-.23,1,0,1.52,.42,1.52,1.35,0,.82-.41,1.5-1.28,2.39-.72,.75-1.44,1.5-2.16,2.25m-31.88-80.04h3.5v.27l-2.63,6.15,.77,.23,2.68-6.33v-1.07h-4.33v.74Zm-1.19,43.14v-1.36h.89v-.72h-.89v-2.17h-.81v2.17h-2.52l2.01-5.22h-.89l-1.98,5.31v.63h3.38v1.36h.81Zm80.05,36.92c-.99,0-2.13-.23-2.13-.23-.03,.22-.05,.44-.07,.66,0,0,1.19,.27,2.29,.27,1.57,0,2.26-.79,2.26-2.19,0-1.13-.5-1.52-1.2-1.77,.2-.13,1.03-.6,1.03-1.69,0-1.23-.58-1.85-2.23-1.85-1.06,0-2.05,.29-2.05,.29,.03,.22,.05,.43,.07,.64,0,0,.98-.21,1.94-.21,1.03,0,1.42,.36,1.42,1.15s-.74,1.37-1.27,1.37h-1.4v.7h1.4c.79,0,1.43,.43,1.43,1.39,0,.9-.47,1.44-1.51,1.46m-76.11,.61v-7.3h-.76l-2.21,1.48,.37,.61,1.79-1.18v6.39h.81Zm70.72-42.09c1.54,0,2.34,.8,2.34,2.27s-.89,2.39-2.44,2.39c-1.73,0-2.49-1.56-2.49-3.82,0-2.52,1.07-3.68,2.72-3.68,.89,0,1.91,.18,1.91,.18-.02,.22-.05,.44-.07,.66,0,0-.95-.13-1.84-.13-1.21,0-1.88,.99-1.88,2.53,0,.01,.98-.41,1.74-.41m-.1,3.96c1.03,0,1.59-.66,1.59-1.69s-.58-1.54-1.55-1.54c-.81,0-1.7,.4-1.7,.4,.01,1.49,.45,2.83,1.66,2.83m-58.6,77.84c-1.82,0-2.91-1.13-2.91-4.2,0-3.28,1.06-4.38,2.89-4.38s2.91,1.09,2.91,4.37c0,3.05-1.07,4.21-2.89,4.21m0-7.74c-1.3,0-1.94,.83-1.94,3.55,0,2.5,.69,3.39,1.94,3.39s1.94-.9,1.94-3.4c0-2.68-.62-3.53-1.94-3.53m25.32-69.45c1.46,0,2.33-.92,2.33-2.52,0-1.49-.85-2.16-2.22-2.16-.82,0-1.63,.43-1.63,.43,.06-.8,.13-1.6,.19-2.4h3.39v-.74h-4.06c-.06,1.25-.13,2.5-.19,3.75,.19,.04,.37,.07,.56,.11,0,0,.79-.42,1.66-.42s1.48,.44,1.48,1.5-.61,1.75-1.57,1.75-2.14-.23-2.14-.23c-.03,.21-.06,.43-.09,.64,0,0,1.24,.3,2.31,.3m-44.12-79.51c-.71,0-1.5,.43-1.5,.43v-.34h-.71v4.83h.72v-3.92s.67-.36,1.36-.36c.9,0,1.04,.47,1.04,1.75v2.53h.71v-2.55c0-1.72-.3-2.37-1.63-2.37m7.43,.1v4.83h.72v-3.92s.61-.36,1.29-.36c.88,0,1.01,.45,1.01,1.79v2.49h.72v-2.51c0-.58-.04-1.19-.13-1.41,0,0,.65-.36,1.36-.36,.87,0,1.01,.47,1.01,1.75v2.53h.72v-2.55c0-1.75-.32-2.37-1.63-2.37-.86,0-1.72,.49-1.72,.49-.25-.35-.61-.49-1.26-.49-.69,0-1.41,.43-1.41,.43v-.34h-.71Zm-3.21,4.91c.7,0,1.43-.42,1.43-.42v.34h.72v-4.83h-.72v3.92s-.61,.36-1.32,.36c-.9,0-1.01-.43-1.01-1.77v-2.51h-.72v2.52c0,1.78,.28,2.39,1.63,2.39m124.09,127.57v-.69h-.75v5.05h.76v-3.7s.89-.49,1.84-.69v-.77c-.97,.19-1.85,.8-1.85,.8m-11.91-.79c-.75,0-1.56,.46-1.56,.46v-.35h-.75v5.05h.76v-4.1s.7-.37,1.42-.37c.94,0,1.09,.49,1.09,1.83v2.64h.75v-2.66c0-1.8-.31-2.48-1.71-2.48m4.65,4.58c-.66,0-.73-.31-.73-1.41v-2.41h1.6v-.66h-1.6v-1.54h-.75v1.54h-.72v.66h.72v2.65c0,1.45,.35,1.84,1.39,1.84,.35,0,1.03-.1,1.03-.1l-.05-.63s-.62,.06-.9,.06m3.5-4.58c1.34,0,2.14,.71,2.03,2.36-.01,.19-.03,.38-.04,.57h-3.33c0,1.08,.33,1.64,1.32,1.64,.76,0,1.86-.09,1.86-.09,0,.2,.01,.4,.02,.6,0,0-1.15,.15-1.97,.15-1.5,0-2-.87-2-2.58,0-1.92,.83-2.66,2.11-2.66m1.27,2.33c0-1.25-.38-1.7-1.27-1.7s-1.34,.47-1.35,1.7h2.62Zm-14.75-2.33c1.34,0,2.14,.71,2.03,2.36-.01,.19-.03,.38-.04,.57h-3.33c0,1.08,.33,1.64,1.32,1.64,.76,0,1.86-.09,1.86-.09,0,.2,.01,.4,.02,.6,0,0-1.15,.15-1.97,.15-1.5,0-2-.87-2-2.58,0-1.92,.83-2.66,2.11-2.66m1.27,2.33c0-1.25-.38-1.7-1.27-1.7s-1.34,.47-1.35,1.7h2.62Zm-32.15-131.04l1.09-.8,.42,1.3,.63-.2-.41-1.29h1.36v-.66h-1.34l.41-1.3-.64-.21-.41,1.29-1.09-.8-.41,.54,1.1,.8-1.11,.8,.39,.53Zm39.83,58.44v-2.09h2.02v-.87h-2.02v-2.07h-.88v2.07h-1.99v.87h1.99v2.09h.88Zm-1.97-60.13v.71h3.94v-.71h-3.94Zm-72.14-3.2c-.06-.03-.12-.05-.18-.08-.06-.03-.12-.05-.18-.08-.32,.81-.65,1.62-.97,2.42-.32,.8-.65,1.61-.97,2.4-.32,.8-.64,1.59-.95,2.39,.06,.02,.12,.04,.18,.07,.06,.02,.12,.04,.18,.07,.06,.02,.12,.04,.18,.07,.32-.79,.63-1.57,.95-2.36,.32-.79,.69-1.61,1.01-2.4,.32-.79,.57-1.53,.89-2.32l.04-.1c-.06-.03-.12-.05-.18-.08ZM239.3,281.86c-.57,0-.63-.27-.63-1.22v-2.09h1.39v-.57h-1.39v-1.34h-.65v1.34h-.62v.57h.62v2.3c0,1.26,.31,1.59,1.21,1.59,.31,0,.89-.09,.89-.09l-.04-.54s-.53,.05-.78,.05m-6.22-3.97c.99,0,1.41,.45,1.41,1.41v3.05h-.66v-.23s-.69,.31-1.48,.31-1.23-.45-1.23-1.33,.44-1.21,1.34-1.29c.46-.04,.92-.09,1.37-.13v-.38c0-.61-.26-.83-.79-.83-.61,0-1.65,.11-1.65,.11,0-.17-.02-.33-.03-.5,0,0,.96-.19,1.71-.19m.75,2.28c-.43,.04-.86,.08-1.29,.12-.53,.05-.74,.31-.74,.79,0,.51,.22,.8,.66,.8,.65,0,1.37-.27,1.37-.27v-1.44Zm2,2.18h.66v-6.28h-.66v6.28Zm282.46-3.86c.9,0,1.29,.42,1.29,1.29v2.79h-.6v-.21s-.63,.28-1.35,.28-1.13-.41-1.13-1.22,.4-1.1,1.23-1.18c.42-.04,.84-.08,1.26-.12v-.34c0-.56-.24-.76-.72-.76-.56,0-1.51,.1-1.51,.1,0-.15-.02-.3-.02-.46,0,0,.88-.18,1.57-.18m.69,2.09c-.4,.04-.79,.07-1.19,.11-.49,.05-.68,.28-.68,.72,0,.46,.2,.74,.61,.74,.59,0,1.26-.25,1.26-.25v-1.32Zm51.35-2.09c-.59,0-1.24,.36-1.24,.36v-.28h-.59v4h.6v-3.25s.55-.3,1.13-.3c.75,0,.87,.39,.87,1.45v2.1h.59v-2.11c0-1.43-.25-1.97-1.35-1.97m-430.77,3.37c-.57,0-.63-.27-.63-1.22v-2.09h1.39v-.57h-1.39v-1.34h-.65v1.34h-.62v.57h.62v2.3c0,1.26,.31,1.59,1.21,1.59,.31,0,.89-.09,.89-.09l-.04-.54s-.53,.05-.78,.05m-3.54,0c-1.08,0-1.28-.47-1.28-1.77,0-1.17,.27-1.61,1.28-1.61,.33,0,1.03,.08,1.03,.08,0-.18,.02-.36,.03-.53,0,0-.79-.13-1.19-.13-1.3,0-1.82,.61-1.82,2.19,0,1.71,.41,2.34,1.8,2.34,.4,0,1.22-.11,1.22-.11,0-.18-.02-.36-.03-.54,0,0-.7,.08-1.03,.08m387.97,.27c-.52,0-.58-.25-.58-1.12v-1.91h1.27v-.52h-1.27v-1.23h-.59v1.23h-.57v.52h.57v2.11c0,1.15,.28,1.46,1.1,1.46,.28,0,.82-.08,.82-.08l-.04-.5s-.49,.05-.71,.05m42.02-3.91v.36h-.5v.52h.5v3.48h.6v-3.48h1.16v-.52h-1.16v-.35c0-.75,.14-.94,.59-.94,.24,0,.69,.02,.69,.02,0-.17,0-.33,0-.5,0,0-.54-.06-.81-.06-.78,0-1.08,.31-1.08,1.47m-424.24-.23h-.65v4.37h.66v-3.21s.77-.43,1.59-.59v-.66c-.84,.17-1.6,.69-1.6,.69v-.59Zm2.43,4.37h.66v-6.28h-.66v6.28Zm376.61,.22h.6v-5.75h-.6v5.75Zm138.95,.02c-1.19,0-1.42-.52-1.42-1.94,0-1.29,.3-1.77,1.41-1.77,.37,0,1.14,.09,1.14,.09,.01-.2,.02-.39,.03-.59,0,0-.87-.14-1.31-.14-1.43,0-2,.67-2,2.42,0,1.89,.45,2.58,1.98,2.58,.44,0,1.34-.12,1.34-.12,0-.2-.02-.4-.03-.6,0,0-.77,.09-1.14,.09m9.01,.55h.72v-6.91h-.72v6.91Zm-2.68-4.81h-.71v4.81h.72v-3.53s.85-.47,1.75-.65v-.73c-.92,.18-1.76,.76-1.76,.76v-.65Zm-2.44,4.27c-.63,0-.69-.3-.69-1.35v-2.3h1.53v-.63h-1.53v-1.47h-.71v1.47h-.68v.63h.68v2.53c0,1.39,.34,1.75,1.33,1.75,.34,0,.98-.1,.98-.1l-.05-.6s-.59,.06-.86,.06m-51.94-5.89h7.7v7.7h-7.7v-7.7Zm.65,7.05h6.4v-6.39h-6.4v6.39Zm1.57-2.87h3.26v-.65h-3.26v.65Zm0-1.61h3.26v-.64h-3.26v.64Zm0,3.22h3.26v-.65h-3.26v.65Zm-244.94-2.58h16.92v-.61h-16.92v.61Zm-176.67,.93h-4.34v4.34h4.34v-4.34Zm-4.79-4.79h-4.34v4.34h4.34v-4.34Zm4.79,0h-4.34v4.34h4.34v-4.34Zm-4.79,4.79h-4.34v4.34h4.34v-4.34Zm727.66,.12c.82,0,1.31,.43,1.24,1.44,0,.12-.02,.24-.02,.35h-2.04c0,.66,.2,1.01,.81,1.01,.46,0,1.14-.06,1.14-.06,0,.12,0,.24,.01,.36,0,0-.7,.09-1.2,.09-.92,0-1.22-.53-1.22-1.58,0-1.17,.51-1.62,1.29-1.62m.78,1.43c0-.77-.23-1.04-.78-1.04s-.82,.29-.83,1.04h1.6Zm1.01,1.72h.46v-4.43h-.46v4.43Zm-63.14,0h.46v-3.09h-.46v3.09Zm23.98-116.31l1.79,2.13,.47-.39-2.26-2.69-2.26,2.69,.47,.39,1.79-2.13Zm-18.64,114.53c-.65-.11-.8-.19-.8-.48,0-.36,.29-.47,.67-.47s1.08,.1,1.08,.1c0-.13,0-.26,.01-.39,0,0-.65-.12-1.12-.12-.56,0-1.11,.22-1.11,.9,0,.62,.33,.75,1.03,.86,.67,.1,.83,.19,.83,.51,0,.42-.27,.53-.78,.53-.31,0-1.02-.11-1.02-.11,0,.13-.02,.27-.02,.4,0,0,.69,.11,1.09,.11,.74,0,1.2-.23,1.2-.96,0-.6-.29-.75-1.06-.88m-2.79-1.36c-.46,0-.96,.28-.96,.28v-.22h-.46v3.09h.46v-2.51s.43-.23,.87-.23c.57,0,.67,.3,.67,1.12v1.62h.46v-1.63c0-1.1-.19-1.52-1.04-1.52m56.51-1.28h.46v4.43h-.46v-.21s-.48,.27-.94,.27c-.61,0-1.11-.24-1.11-1.57,0-1.09,.35-1.63,1.29-1.63,.27,0,.67,.06,.76,.08v-1.36Zm0,1.76c-.1-.02-.48-.07-.73-.07-.65,0-.84,.43-.84,1.23,0,1,.33,1.17,.69,1.17,.44,0,.88-.23,.88-.23v-2.09Zm-34.67-38.51l-1.79-2.13-.47,.39,2.26,2.69,2.26-2.69-.47-.39-1.79,2.13Zm-24.4,37.4h.46v-.54h-.46v.54Zm61.43-74.21l2.69-2.26-2.69-2.26-.39,.47,2.13,1.79-2.13,1.79,.39,.46Zm-73.77-4.51l-2.69,2.26,2.69,2.26,.39-.47-2.13-1.79,2.13-1.79-.39-.47Zm-283.48-110.59c0,2.04-1.66,3.7-3.7,3.7s-3.7-1.66-3.7-3.7,1.66-3.71,3.7-3.71,3.7,1.66,3.7,3.71Zm-2.09-1.6h-1.09l-.56,2.31-.56-2.31h-1.09v3.16h.64v-2.44h.07l.62,2.31h.64l.62-2.31h.07v2.44h.64v-3.16Zm38.04,1.49v1.52c-.16,.02-.67,.1-1.01,.1-.99-.01-1.21-.51-1.23-1.57,.02-1.14,.3-1.55,1.2-1.57,.39,0,.87,.09,1.03,.12v.37c-.18-.02-.59-.05-.93-.05-.28,0-.48,.05-.61,.23-.12,.18-.16,.46-.16,.9,0,.42,.03,.7,.14,.89,.12,.19,.33,.26,.62,.25,.19,0,.39-.02,.39-.02h.06v-.74h-.29v-.43h.79Zm2.81,.05v.14c0,.1-.08,.17-.17,.17h-.16v.06c-.16,1.75-1.55,3.14-3.31,3.28h-.06v.16c0,.09-.08,.17-.17,.17h-.14c-.1,0-.17-.08-.17-.18v-.15h-.06c-1.75-.16-3.14-1.56-3.28-3.31v-.06h-.16c-.1,0-.17-.08-.17-.17v-.14c0-.09,.08-.17,.18-.17h.09s.06,0,.06,0v-.06c.16-1.75,1.56-3.14,3.31-3.28h.06v-.16c0-.09,.08-.17,.18-.17h.14c.09,0,.17,.08,.17,.17h0v.16h.06c1.75,.16,3.14,1.56,3.28,3.31v.06h.16c.1,0,.17,.07,.17,.17Zm-1.85,.13v-.14c0-.09,.08-.17,.17-.17h.79s0-.07,0-.07c-.14-1.43-1.27-2.57-2.7-2.72h-.07s0,.78,0,.78c0,.09-.08,.17-.17,.17h-.14c-.1,0-.17-.08-.17-.17v-.79s-.07,0-.07,0c-1.43,.14-2.56,1.27-2.72,2.7v.07s.78,0,.78,0c.1,0,.17,.08,.17,.17v.14c0,.09-.07,.17-.17,.17h-.79v.07c.15,1.43,1.28,2.56,2.71,2.72h.07s0-.78,0-.78c0-.1,.08-.17,.17-.17h0s.14,0,.14,0c.1,0,.17,.08,.17,.17v.71s0,.08,0,.08h.07c1.43-.15,2.56-1.29,2.72-2.71v-.07s-.78,0-.78,0c-.1,0-.17-.07-.17-.17Zm71,.78h4.24v.62h-4.24v-.62Zm1.81-2.33h.62v1.07h-.62v-1.07Zm1.72,1.28l-.59-.16,.28-1.03,.6,.16-.28,1.04Zm1.07-.79l.54,.31-.54,.93-.54-.31,.54-.93Zm-3.58-.4l.28,1.03-.6,.16-.28-1.04,.6-.16Zm-.85,1.33l-.53,.31-.54-.93,.53-.31,.54,.93Zm-38.77,.7h4.24v.62h-4.24v-.62Zm2.43-1.9v.62h-.62v-.62h.62Zm.7,.07l.6,.16-.16,.6-.6-.16,.16-.6Zm1.5,1.2l-.54-.31,.31-.54,.54,.31-.31,.54Zm-3.51-1.2l.16,.6-.59,.16-.16-.6,.6-.16Zm-.97,.89l-.53,.31-.31-.54,.54-.31,.31,.54Zm-93.2,72.63c1.6,0,2.34,.77,2.34,2.36s-.74,2.5-2.34,2.5h-1.87v2.47h-.82v-7.33h2.68m-.01,4.14c1.07,0,1.52-.65,1.52-1.78s-.45-1.64-1.52-1.64h-1.85v3.42h1.85m-268.25,3.19h4.46v-.72h-3.64v-2.65h3.01v-.71h-3.01v-2.53h3.64v-.72h-4.46v7.33Zm113.57-7.33l2.34,4.25v3.08h.82v-3.08l2.33-4.25h-.92l-1.82,3.43-1.82-3.43h-.92Zm-184.83,3.7c0,1.73-.3,2.82-1.22,3.36,.3,.48,.6,.96,.9,1.44-.25,.12-.51,.24-.76,.36-.31-.51-.62-1.02-.93-1.53-.24,.07-.55,.1-.89,.1-2.28,0-2.89-1.27-2.89-3.73s.63-3.8,2.89-3.8,2.9,1.38,2.9,3.8m-2.9,3.02c1.71,0,2.06-.94,2.06-3.02s-.38-3.08-2.06-3.08-2.06,1.09-2.06,3.08,.36,3.02,2.06,3.02m150.13-5.99h2.26v6.6h.81v-6.6h2.24v-.73h-5.3v.73Zm80.8,4.4c0,1.14-.65,1.59-1.79,1.59-1.08,0-1.72-.44-1.72-1.59v-5.13h-.82v5.11c0,1.68,.92,2.32,2.53,2.32s2.6-.65,2.6-2.32v-5.11h-.81v5.13Zm73.62-5.23c2.27,0,2.9,1.37,2.9,3.8s-.63,3.73-2.9,3.73-2.89-1.27-2.89-3.73,.63-3.8,2.89-3.8m0,6.82c1.71,0,2.06-.95,2.06-3.02s-.38-3.08-2.06-3.08-2.06,1.09-2.06,3.08,.36,3.02,2.06,3.02m-264.57-.11h-.31l-1.49-6.55h-.95l-1.49,6.55h-.31l-1.25-6.61h-.85l1.49,7.33h1.49l1.39-6.26,1.39,6.26h1.49l1.48-7.33h-.84l-1.25,6.61Zm226.47,.72h.82v-7.33h-.82v7.33Zm-319.73-.71c-.02-.19-.03-.38-.05-.56,0,0-.56,.05-.81,.05-.59,0-.66-.28-.66-1.27v-2.18h1.45v-.59h-1.45v-1.39h-.67v1.39h-.65v.59h.65v2.4c0,1.31,.32,1.66,1.26,1.66,.32,0,.93-.09,.93-.09m2.59-4.64c1.03,0,1.47,.47,1.47,1.47v3.18h-.68v-.24s-.72,.32-1.54,.32-1.28-.46-1.28-1.38,.46-1.26,1.39-1.35c.48-.05,.95-.09,1.43-.14v-.39c0-.64-.27-.87-.82-.87-.64,0-1.72,.12-1.72,.12,0-.17-.02-.35-.03-.52,0,0,1-.2,1.78-.2m.78,2.38c-.45,.04-.9,.09-1.35,.13-.56,.05-.77,.32-.77,.82,0,.53,.23,.84,.69,.84,.67,0,1.43-.28,1.43-.28v-1.5Zm3.63-2.38c1.24,0,1.66,.66,1.66,2.3,0,1.81-.49,2.43-2.15,2.43-.55,0-1.52-.09-1.52-.09v-6.53h.67v2.21s.69-.32,1.34-.32m-.5,4.13c1.25,0,1.47-.56,1.47-1.83,0-1.17-.24-1.69-1.04-1.69-.63,0-1.27,.26-1.27,.26v3.21s.59,.05,.84,.05m434.73-4.98c0-.15,0-.29,0-.44-.92,.03-1.27,.36-1.27,1.19,0,.25,.05,.68,.05,.87,0,.39-.2,.62-.72,.74v.41c.51,.14,.72,.37,.72,.76,0,.17-.05,.56-.05,.83,0,.8,.34,1.14,1.26,1.18,0-.15,0-.29,.01-.44-.63-.03-.78-.32-.78-.79,0-.24,.05-.55,.05-.79,0-.56-.15-.8-.71-.96,.56-.16,.71-.37,.71-.95,0-.2-.05-.61-.05-.83,0-.47,.16-.74,.78-.78m37.97,1.62c0-.19,.05-.62,.05-.87,0-.83-.34-1.16-1.27-1.19,0,.15,0,.29,0,.44,.62,.03,.78,.3,.78,.78,0,.22-.05,.64-.05,.83,0,.58,.15,.78,.71,.95-.56,.16-.72,.4-.71,.96,0,.24,.05,.54,.05,.79,0,.46-.15,.75-.78,.79,0,.15,0,.29,.01,.44,.92-.03,1.26-.38,1.26-1.18,0-.26-.05-.66-.05-.83,0-.39,.21-.62,.72-.76v-.41c-.52-.12-.72-.35-.72-.74m-9.43-2.74h-1.77v.56h1.13v6.2h-1.13v.56h1.77v-7.33Zm-38.69,6.77h-1.13v-6.2h1.13v-.56h-1.77v7.33h1.77v-.56Zm89.16,.43l-3.26-7.34-.71,.31,3.26,7.32,.71-.29Zm-351.73-2.84c.92-.3,1.35-1.05,1.35-2.13,0-1.55-.8-2.23-2.34-2.23h-2.71v7.33h.82v-2.81h2.08c.44,.94,.88,1.87,1.32,2.81h.9c-.47-.99-.94-1.99-1.41-2.98Zm-.86-.56s-.04,0-.06,0c-.02,0-.04,0-.06,0h-1.67c-.08,0-.15,0-.23,0v-3.08h0s1.9,0,1.9,0c.02,0,.04,0,.06,0,.14,0,.28,.02,.41,.04,.03,0,.06,.02,.1,.03,.06,.01,.11,.03,.16,.05,.13,.05,.25,.1,.34,.19,.01,.01,.02,.03,.04,.04,.03,.02,.05,.05,.07,.08,.09,.11,.17,.23,.22,.38,.01,.03,.02,.07,.03,.1,.05,.18,.09,.37,.08,.59,0,0,0,0,0,0,0,.36-.06,.67-.2,.93,0,0-.01,.01-.01,.02-.04,.07-.08,.14-.13,.19,0,0,0,0,0,.01-.02,.02-.05,.04-.07,.06-.21,.2-.51,.32-.91,.35-.01,0-.02,0-.04,0Zm360.27-4.69h-.71v7.91h.71v-7.91ZM90.42,130.62c.48,.1,.97,.19,1.45,.29l.75-.17,.25-.25,.17-.41v-.33l-.08-.41-.25-.25-.33-.17-.33-.08-.41,.08-.66,.33-.58-.08,.17-2.99h3.15v.91h-2.41l-.08,1.16,1.08-.25,.5,.08,.5,.25,.33,.41,.25,.5,.08,.58-.08,.5-.17,.5-.33,.41-.41,.33-.58,.08h-1l-1.08-.17v-.03c.05-.28,.09-.56,.13-.84m-4.52,.64h1.13s1.24-4.24,1.24-4.24h.08v4.48h.91v-5.48h-1.49l-1.24,4.31-1.16-4.31h-1.58v5.48h.91v-4.5s1.19,4.26,1.19,4.26Zm-1.61,34.01c.48,1.44,.96,2.88,1.44,4.32h.93l1.27-4.32h.08v4.57h.93v-5.59h-1.52l-1.27,4.32-1.19-4.32h-1.61v5.59h.93v-4.57Zm8.97,4.49h-.85v-1.02h-2.46v-.59l1.52-3.89h.93l-1.44,3.64h1.44v-1.61h.85v1.61h.68v.85h-.68v1.02Zm-7.27,37.47h.94l1.28-4.44h.17v4.62h.85v-5.56h-1.54l-1.2,4.36-1.28-4.36h-1.54v5.56h.85v-4.62h.17c.43,1.48,.85,2.96,1.28,4.44Zm4.44-5.34c.05,.28,.1,.56,.15,.84h0l.88-.12h1.03l.26,.09,.17,.17v.51l-.26,.43-.43,.17h-1.28v.85h1.28l.51,.17,.26,.26,.09,.26-.09,.6-.09,.26-.26,.17-.6,.09-.51-.09-1.2-.17-.09,.85,1.54,.26,.77-.09,.77-.26,.26-.26,.17-.34,.17-.77-.09-.77-.51-.6,.43-.6,.09-.68-.26-.68-.17-.34-.34-.17-.68-.17h-.68l-1.29,.13Zm-6.13,39.03l1.27,4.42h.93l1.27-4.42h.17v4.59h.85v-5.61h-1.53l-1.19,4.42-1.27-4.42h-1.53v5.61h.85v-4.59h.17Zm7.28,3.38c-.06,.06-.11,.12-.17,.18s-.11,.12-.17,.18h-.05s2.29,0,2.29,0v.85h-3.65v-.59l1.27-1.36,.59-.68,.51-.76,.17-.42v-.59l-.17-.17-.42-.17-.93,.08-.85,.17-.17-.85,1.02-.17,.93-.08,.51,.08,.42,.17,.34,.34,.17,.51,.08,.42-.08,.51c-.14,.31-.28,.62-.42,.93-.41,.48-.81,.95-1.22,1.43Zm-6.44,34.45h-.17v4.59h-.85v-5.61h1.53l1.27,4.42,1.19-4.42h1.61v5.61h-.93v-4.59h-.08l-1.36,4.33h-.93l-1.27-4.33Zm7.22,0v4.59h.93v-5.61h-.85l-1.78,1.19,.42,.68,1.27-.85Z
    " />
  </g>
  <g id="LED">
    <path id="1" class="keyEsc led ledkeys"
      d="M152,101V75c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C150.2,105,152,103.2,152,101z" />
    <path id="2" class="keyF1 led ledkeys"
      d="M228,101V75c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C226.2,105,228,103.2,228,101z" />
    <path id="3" class="keyF2 led ledkeys"
      d="M266,101V75c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C264.2,105,266,103.2,266,101z" />
    <path id="4" class="keyF3 led ledkeys"
      d="M304,101V75c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C302.2,105,304,103.2,304,101z" />
    <path id="5" class="keyF4 led ledkeys"
      d="M342,101V75c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C340.2,105,342,103.2,342,101z" />
    <path id="6" class="keyF5 led ledkeys"
      d="M400,101V75c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C398.2,105,400,103.2,400,101z" />
    <path id="7" class="keyF6 led ledkeys"
      d="M438,101V75c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C436.2,105,438,103.2,438,101z" />
    <path id="8" class="keyF7 led ledkeys"
      d="M476,101V75c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C474.2,105,476,103.2,476,101z" />
    <path id="9" class="keyF8 led ledkeys"
      d="M514,101V75c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C512.2,105,514,103.2,514,101z" />
    <path id="10" class="keyF9 led ledkeys"
      d="M571,101V75c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C569.2,105,571,103.2,571,101z" />
    <path id="11" class="keyF10 led ledkeys"
      d="M609,101V75c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C607.2,105,609,103.2,609,101z" />
    <path id="12" class="keyF11 led ledkeys"
      d="M647,101V75c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C645.2,105,647,103.2,647,101z" />
    <path id="13" class="keyF12 led ledkeys"
      d="M685,101V75c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C683.2,105,685,103.2,685,101z" />
    <path id="14" class="keyPrintScreen led ledkeys"
      d="M730,101V75c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C728.2,105,730,103.2,730,101z" />
    <path id="15" class="keyScrollLock led ledkeys"
      d="M768,101V75c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C766.2,105,768,103.2,768,101z" />
    <path id="16" class="keyPauseBreak led ledkeys"
      d="M806,101V75c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C804.2,105,806,103.2,806,101z" />
    <path id="17" class="keyM5 led ledkeys"
      d="M106,151v-26c0-2.2-1.8-4-4-4H76 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C104.2,155,106,153.2,106,151z" />
    <path id="18" class="keyTilde led ledkeys"
      d="M152,151v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C150.2,155,152,153.2,152,151z" />
    <path id="19" class="key1 led ledkeys"
      d="M190,151v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C188.2,155,190,153.2,190,151z" />
    <path id="20" class="key2 led ledkeys"
      d="M228,151v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C226.2,155,228,153.2,228,151z" />
    <path id="21" class="key3 led ledkeys"
      d="M266,151v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C264.2,155,266,153.2,266,151z" />
    <path id="22" class="key4 led ledkeys"
      d="M304,151v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C302.2,155,304,153.2,304,151z" />
    <path id="23" class="key5 led ledkeys"
      d="M342,151v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C340.2,155,342,153.2,342,151z" />
    <path id="24" class="key6 led ledkeys"
      d="M380,151v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C378.2,155,380,153.2,380,151z" />
    <path id="25" class="key7 led ledkeys"
      d="M418,151v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C416.2,155,418,153.2,418,151z" />
    <path id="26" class="key8 led ledkeys"
      d="M457,151v-26c0-2.2-1.8-4-4-4h-27 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h27C455.2,155,457,153.2,457,151z" />
    <path id="27" class="key9 led ledkeys"
      d="M495,151v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C493.2,155,495,153.2,495,151z" />
    <path id="28" class="key0 led ledkeys"
      d="M533,151v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C531.2,155,533,153.2,533,151z" />
    <path id="29" class="keyDash led ledkeys"
      d="M571,151v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C569.2,155,571,153.2,571,151z" />
    <path id="30" class="keyEqual led ledkeys"
      d="M609,151v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C607.2,155,609,153.2,609,151z" />
    <path id="31" class="keyBackspace led ledkeys"
      d="M685,151v-26c0-2.2-1.8-4-4-4h-64 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h64C683.2,155,685,153.2,685,151z" />
    <path id="32" class="keyInsert led ledkeys"
      d="M730,151v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C728.2,155,730,153.2,730,151z" />
    <path id="33" class="keyHome led ledkeys"
      d="M768,151v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C766.2,155,768,153.2,768,151z" />
    <path id="34" class="keyPageUp led ledkeys"
      d="M806,151v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C804.2,155,806,153.2,806,151z" />
    <path id="35" class="keyNumPad led ledkeys"
      d="M851,151v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C849.2,155,851,153.2,851,151z" />
    <path id="36" class="keyNumPadForwardSlash led ledkeys"
      d="M889,151v-26 c0-2.2-1.8-4-4-4h-26c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C887.2,155,889,153.2,889,151z" />
    <path id="37" class="keyNumPadAsterisk led ledkeys"
      d="M927,151v-26c0-2.2-1.8-4-4-4 h-26c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C925.2,155,927,153.2,927,151z" />
    <path id="38" class="keyNumPadMinus led ledkeys"
      d="M965,151v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C963.2,155,965,153.2,965,151z" />
    <path id="39" class="keyM4 led ledkeys"
      d="M106,189v-26c0-2.2-1.8-4-4-4H76 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C104.2,193,106,191.2,106,189z" />
    <path id="40" class="keyTab led ledkeys"
      d="M171,189v-26c0-2.2-1.8-4-4-4h-45 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h45C169.2,193,171,191.2,171,189z" />
    <path id="41" class="keyQ led ledkeys"
      d="M209,189v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C207.2,193,209,191.2,209,189z" />
    <path id="42" class="keyW led ledkeys"
      d="M247,189v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C245.2,193,247,191.2,247,189z" />
    <path id="43" class="keyE led ledkeys"
      d="M285,189v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C283.2,193,285,191.2,285,189z" />
    <path id="44" class="keyR led ledkeys"
      d="M323,189v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C321.2,193,323,191.2,323,189z" />
    <path id="45" class="keyT led ledkeys"
      d="M362,189v-26c0-2.2-1.8-4-4-4h-27 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h27C360.2,193,362,191.2,362,189z" />
    <path id="46" class="keyY led ledkeys"
      d="M400,189v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C398.2,193,400,191.2,400,189z" />
    <path id="47" class="keyU led ledkeys"
      d="M438,189v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C436.2,193,438,191.2,438,189z" />
    <path id="48" class="keyI led ledkeys"
      d="M476,189v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C474.2,193,476,191.2,476,189z" />
    <path id="49" class="keyO led ledkeys"
      d="M514,189v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C512.2,193,514,191.2,514,189z" />
    <path id="50" class="keyP led ledkeys"
      d="M552,189v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C550.2,193,552,191.2,552,189z" />
    <path id="51" class="keyStartSquareBracket led ledkeys"
      d="M590,189v-26 c0-2.2-1.8-4-4-4h-26c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C588.2,193,590,191.2,590,189z" />
    <path id="52" class="keyEndSquareBracket led ledkeys"
      d="M628,189v-26c0-2.2-1.8-4-4-4 h-26c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C626.2,193,628,191.2,628,189z" />
    <path id="53" class="keyBackslash led ledkeys"
      d="M685,189v-26c0-2.2-1.8-4-4-4h-45 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h45C683.2,193,685,191.2,685,189z" />
    <path id="54" class="keyDelete led ledkeys"
      d="M730,189v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C728.2,193,730,191.2,730,189z" />
    <path id="55" class="keyEnd led ledkeys"
      d="M768,189v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C766.2,193,768,191.2,768,189z" />
    <path id="56" class="keyPageDown led ledkeys"
      d="M806,189v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C804.2,193,806,191.2,806,189z" />
    <path id="57" class="keyNumPad7 led ledkeys"
      d="M851,189v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C849.2,193,851,191.2,851,189z" />
    <path id="58" class="keyNumPad8 led ledkeys"
      d="M889,189v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C887.2,193,889,191.2,889,189z" />
    <path id="59" class="keyNumPad9 led ledkeys"
      d="M927,189v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C925.2,193,927,191.2,927,189z" />
    <path id="60" class="keyNumPadPlus led ledkeys"
      d="M965,227v-64c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v64c0,2.2,1.8,4,4,4h26C963.2,231,965,229.2,965,227z" />
    <path id="61" class="keyM3 led ledkeys"
      d="M106,227v-26c0-2.2-1.8-4-4-4H76 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C104.2,231,106,229.2,106,227z" />
    <path id="62" class="keyCaps led ledkeys"
      d="M181,227v-26c0-2.2-1.8-4-4-4h-55 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h55C179.2,231,181,229.2,181,227z" />
    <path id="63" class="keyA led ledkeys"
      d="M219,227v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C217.2,231,219,229.2,219,227z" />
    <path id="64" class="keyS led ledkeys"
      d="M257,227v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C255.2,231,257,229.2,257,227z" />
    <path id="65" class="keyD led ledkeys"
      d="M295,227v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C293.2,231,295,229.2,295,227z" />
    <path id="66" class="keyF led ledkeys"
      d="M333,227v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C331.2,231,333,229.2,333,227z" />
    <path id="67" class="keyG led ledkeys"
      d="M371,227v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C369.2,231,371,229.2,371,227z" />
    <path id="68" class="keyH led ledkeys"
      d="M410,227v-26c0-2.2-1.8-4-4-4h-27 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h27C408.2,231,410,229.2,410,227z" />
    <path id="69" class="keyJ led ledkeys"
      d="M448,227v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C446.2,231,448,229.2,448,227z" />
    <path id="70" class="keyK led ledkeys"
      d="M486,227v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C484.2,231,486,229.2,486,227z" />
    <path id="71" class="keyL led ledkeys"
      d="M524,227v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C522.2,231,524,229.2,524,227z" />
    <path id="72" class="keySemiColon led ledkeys"
      d="M562,227v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C560.2,231,562,229.2,562,227z" />
    <path id="73" class="keyApostrophe led ledkeys"
      d="M600,227v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C598.2,231,600,229.2,600,227z" />
    <path id="74" class="keyEnter led ledkeys"
      d="M685,227v-26c0-2.2-1.8-4-4-4h-73 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h73C683.2,231,685,229.2,685,227z" />
    <path id="75" class="keyNumPad4 led ledkeys"
      d="M851,227v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C849.2,231,851,229.2,851,227z" />
    <path id="76" class="keyNumPad5 led ledkeys"
      d="M889,227v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C887.2,231,889,229.2,889,227z" />
    <path id="77" class="keyNumPad6 led ledkeys"
      d="M927,227v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C925.2,231,927,229.2,927,227z" />
    <path id="78" class="keyLeftShift led ledkeys"
      d="M200,265v-26c0-2.2-1.8-4-4-4h-74 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h74C198.2,269,200,267.2,200,265z" />
    <path id="79" class="keyM2 led ledkeys"
      d="M106,265v-26c0-2.2-1.8-4-4-4H76 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C104.2,269,106,267.2,106,265z" />
    <path id="80" class="keyZ led ledkeys"
      d="M238,265v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C236.2,269,238,267.2,238,265z" />
    <path id="81" class="keyX led ledkeys"
      d="M276,265v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C274.2,269,276,267.2,276,265z" />
    <path id="82" class="keyC led ledkeys"
      d="M314,265v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C312.2,269,314,267.2,314,265z" />
    <path id="83" class="keyV led ledkeys"
      d="M352,265v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C350.2,269,352,267.2,352,265z" />
    <path id="84" class="keyB led ledkeys"
      d="M390,265v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C388.2,269,390,267.2,390,265z" />
    <path id="85" class="keyN led ledkeys"
      d="M428,265v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C426.2,269,428,267.2,428,265z" />
    <path id="86" class="keyM led ledkeys"
      d="M466,265v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C464.2,269,466,267.2,466,265z" />
    <path id="87" class="keyComma led ledkeys"
      d="M504,265v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C502.2,269,504,267.2,504,265z" />
    <path id="88" class="keyDot led ledkeys"
      d="M542,265v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C540.2,269,542,267.2,542,265z" />
    <path id="89" class="keyForwardSlash led ledkeys"
      d="M580,265v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C578.2,269,580,267.2,580,265z" />
    <path id="90" class="keyRightShift led ledkeys"
      d="M685.2,265v-26c0-2.2-1.8-4-4-4h-93 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h93C683.4,269,685.2,267.2,685.2,265z" />
    <path id="91" class="keyUpArrow led ledkeys"
      d="M768,265v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C766.2,269,768,267.2,768,265z" />
    <path id="92" class="keyNumPad1 led ledkeys"
      d="M851,265v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C849.2,269,851,267.2,851,265z" />
    <path id="93" class="keyNumPad2 led ledkeys"
      d="M889,265v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C887.2,269,889,267.2,889,265z" />
    <path id="94" class="keyNumPad3 led ledkeys"
      d="M927,265v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C925.2,269,927,267.2,927,265z" />
    <path id="95" class="keyNumPadEnter led ledkeys"
      d="M965,303v-64c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v64c0,2.2,1.8,4,4,4h26C963.2,307,965,305.2,965,303z" />
    <path id="96" class="keyM1 led ledkeys"
      d="M106,303v-26c0-2.2-1.8-4-4-4H76 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C104.2,307,106,305.2,106,303z" />
    <path id="97" class="keyLeftCtrl led ledkeys"
      d="M162,303v-26c0-2.2-1.8-4-4-4h-36 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h36C160.2,307,162,305.2,162,303z" />
    <path id="98" class="keyWindow led ledkeys"
      d="M210,303v-26c0-2.2-1.8-4-4-4h-36 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h36C208.2,307,210,305.2,210,303z" />
    <path id="99" class="keyLeftAlt led ledkeys"
      d="M258,303v-26c0-2.2-1.8-4-4-4h-36 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h36C256.2,307,258,305.2,258,303z" />
    <path id="100" class="keySpace led ledkeys"
      d="M494,303v-26c0-2.2-1.8-4-4-4H266 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h224C492.2,307,494,305.2,494,303z" />
    <path id="101" class="keyRightAlt led ledkeys"
      d="M542,303v-26c0-2.2-1.8-4-4-4h-36 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h36C540.2,307,542,305.2,542,303z" />
    <path id="102" class="keyFunction led ledkeys"
      d="M590,303v-26c0-2.2-1.8-4-4-4h-36 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h36C588.2,307,590,305.2,590,303z" />
    <path id="103" class="keyMenu led ledkeys"
      d="M637,303v-26c0-2.2-1.8-4-4-4h-35 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h35C635.2,307,637,305.2,637,303z" />
    <path id="104" class="keyRightCtrl led ledkeys"
      d="M685.2,303v-26c0-2.2-1.8-4-4-4h-36 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h36C683.4,307,685.2,305.2,685.2,303z" />
    <path id="105" class="keyLeftArrow led ledkeys"
      d="M730,303v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C728.2,307,730,305.2,730,303z" />
    <path id="106" class="keyDownArrow led ledkeys"
      d="M768,303v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C766.2,307,768,305.2,768,303z" />
    <path id="107" class="keyRightArrow led ledkeys"
      d="M806,303v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C804.2,307,806,305.2,806,303z" />
    <path id="108" class="keyNumPad0 led ledkeys"
      d="M889,303v-26c0-2.2-1.8-4-4-4h-64 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h64C887.2,307,889,305.2,889,303z" />
    <path id="109" class="keyNumPadDot led ledkeys"
      d="M927,303v-26c0-2.2-1.8-4-4-4h-26 c-2.2,0-4,1.8-4,4v26c0,2.2,1.8,4,4,4h26C925.2,307,927,305.2,927,303z" />

    <!-- Knob and Media buttons -->
    <path id="110" class="keyKnob led"
      d="M89,72c8.8,0,16,7.2,16,16s-7.2,16-16,16s-16-7.2-16-16S80.2,72,89,72 M89,70 c-9.9,0-18,8.1-18,18s8.1,18,18,18s18-8.1,18-18S98.9,70,89,70L89,70z" />
    <path id="111" class="keyPrev led"
      d="M834.5,84c5.8,0,10.5,4.7,10.5,10.5s-4.7,10.5-10.5,10.5S824,100.3,824,94.5S828.7,84,834.5,84  M834.5,82c-6.9,0-12.5,5.6-12.5,12.5s5.6,12.5,12.5,12.5s12.5-5.6,12.5-12.5S841.4,82,834.5,82L834.5,82z" />
    <path id="112" class="keyPlayPause led"
      d="M872.5,84c5.8,0,10.5,4.7,10.5,10.5s-4.7,10.5-10.5,10.5S862,100.3,862,94.5 S866.7,84,872.5,84 M872.5,82c-6.9,0-12.5,5.6-12.5,12.5s5.6,12.5,12.5,12.5s12.5-5.6,12.5-12.5S879.4,82,872.5,82L872.5,82z" />
    <path id="113" class="keyNext led"
      d="M910.5,84c5.8,0,10.5,4.7,10.5,10.5s-4.7,10.5-10.5,10.5S900,100.3,900,94.5S904.7,84,910.5,84 M910.5,82c-6.9,0-12.5,5.6-12.5,12.5s5.6,12.5,12.5,12.5s12.5-5.6,12.5-12.5S917.4,82,910.5,82L910.5,82z" />
    <path id="114" class="keyMute led"
      d="M948.5,84c5.8,0,10.5,4.7,10.5,10.5s-4.7,10.5-10.5,10.5S938,100.3,938,94.5S942.7,84,948.5,84 M948.5,82c-6.9,0-12.5,5.6-12.5,12.5s5.6,12.5,12.5,12.5s12.5-5.6,12.5-12.5S955.4,82,948.5,82L948.5,82z" />

    <!-- Underglow Counter Clockwise order -->
    <rect id="115" class="led underglow1" x="45" y="43" width="8" height="33" />
    <rect id="116" class="led underglow2" x="45" y="77" width="8" height="33" />
    <rect id="117" class="led underglow3" x="45" y="111" width="8" height="33" />
    <rect id="118" class="led underglow4" x="45" y="145" width="8" height="33" />
    <rect id="119" class="led underglow5" x="45" y="179" width="8" height="32" />
    <rect id="120" class="led underglow6" x="45" y="212" width="8" height="32" />
    <rect id="121" class="led underglow7" x="45" y="245" width="8" height="32" />
    <rect id="122" class="led underglow8" x="45" y="278" width="8" height="32" />
    <rect id="123" class="led underglow9" x="45" y="311" width="8" height="32" />
    <rect id="124" class="led underglow10" x="45" y="344" width="8" height="31" />
    <rect id="125" class="led underglow11" x="45" y="376" width="8" height="31" />
    <rect id="126" class="led underglow12" x="45" y="408" width="8" height="31" />
    <path id="127" class="led underglow13" d="M86,473v8H61c-8.8,0-16-7.2-16-16v-25h8v25c0,4.4,3.6,8,8,8H86z" />
    <rect id="128" class="led underglow14" x="87" y="473" width="35" height="8" />
    <rect id="129" class="led underglow15" x="123" y="473" width="35" height="8" />
    <rect id="130" class="led underglow16" x="159" y="473" width="35" height="8" />
    <rect id="131" class="led underglow17" x="195" y="473" width="35" height="8" />
    <rect id="132" class="led underglow18" x="231" y="473" width="35" height="8" />
    <rect id="133" class="led underglow19" x="267" y="473" width="35" height="8" />
    <rect id="134" class="led underglow20" x="303" y="473" width="35" height="8" />
    <rect id="135" class="led underglow21" x="339" y="473" width="35" height="8" />
    <rect id="136" class="led underglow22" x="375" y="473" width="35" height="8" />
    <rect id="137" class="led underglow23" x="411" y="473" width="35" height="8" />
    <rect id="138" class="led underglow24" x="447" y="473" width="35" height="8" />
    <rect id="139" class="led underglow25" x="483" y="473" width="35" height="8" />
    <rect id="140" class="led underglow26" x="519" y="473" width="35" height="8" />
    <rect id="141" class="led underglow27" x="555" y="473" width="35" height="8" />
    <rect id="142" class="led underglow28" x="591" y="473" width="35" height="8" />
    <rect id="143" class="led underglow29" x="627" y="473" width="35" height="8" />
    <rect id="144" class="led underglow30" x="663" y="473" width="35" height="8" />
    <rect id="145" class="led underglow31" x="699" y="473" width="35" height="8" />
    <rect id="146" class="led underglow32" x="735" y="473" width="35" height="8" />
    <rect id="147" class="led underglow33" x="771" y="473" width="35" height="8" />
    <rect id="148" class="led underglow34" x="807" y="473" width="35" height="8" />
    <rect id="149" class="led underglow35" x="843" y="473" width="35" height="8" />
    <rect id="150" class="led underglow36" x="879" y="473" width="35" height="8" />
    <rect id="151" class="led underglow37" x="915" y="473" width="35" height="8" />
    <path id="152" class="led underglow38" d="M977,473c4.4,0,8-3.6,8-8v-25h8v25c0,8.8-7.2,16-16,16h-26v-8H977z" />
    <rect id="153" class="led underglow39" x="985" y="408" width="8" height="31" />
    <rect id="154" class="led underglow40" x="985" y="376" width="8" height="31" />
    <rect id="155" class="led underglow41" x="985" y="344" width="8" height="31" />
    <rect id="156" class="led underglow42" x="985" y="311" width="8" height="32" />
    <rect id="157" class="led underglow43" x="985" y="278" width="8" height="32" />
    <rect id="158" class="led underglow44" x="985" y="245" width="8" height="32" />
    <rect id="159" class="led underglow45" x="985" y="212" width="8" height="32" />
    <rect id="160" class="led underglow46" x="985" y="179" width="8" height="32" />
    <rect id="161" class="led underglow47" x="985" y="145" width="8" height="33" />
    <rect id="162" class="led underglow48" x="985" y="111" width="8" height="33" />
    <rect id="163" class="led underglow49" x="985" y="77" width="8" height="33" />
    <rect id="164" class="led underglow50" x="985" y="43" width="8" height="33" />
  </g>
</svg>`
});

Vue.component('div-chroma-keyboard', {
  props: ['index', 'header', 'image', 'video'],
  methods: {
    keyboardClick: function () {
      console.log('function not set');
    },
    keyboardCanvasClick: function (event) {
      //console.log('keyboardCanvasClick');
    }
  },
  template: `<div style="padding-bottom: 50px; display: inline-table">
    <div class="box" style="padding: 0px; width: 650px; background: hsl(0, 0%, 10%); display: inline-table; vertical-align: top;">
      <div style="background: hsl(0, 0%, 20%); width: 650px;">
        <button class="buttonChroma" :onclick="keyboardClick" style="font-size: 1.2em; display: inline-table; padding: 4px; max-width: 65px" :id="'showEffect'+index">{{ index }}</button>
        <div style="width: 550px; display: inline-table">{{ header }}</div>
      </div>
      <section v-show="image != undefined && image != ''">
        <div style="width: 645px; padding-left: 25px; background: hsl(0, 0%, 10%); color: white; display: inline-table"><img :src="image"/></div>
      </section>
      <section v-show="video != undefined && video != ''">
        <div style="width: 645px; padding-left: 25px; background: hsl(0, 0%, 10%); color: white; display: inline-table">
        <video :id="'video'+index" style="width: 645px; height: 430px;" :src="video" muted autoplay loop></video>
        </div>
      </section>
      <section v-show="index != undefined && index != ''">
        <button class="buttonChromaLink" style="display: none" :id="'showEffect'+index+'ChromaLink'">1</button>
        <button class="buttonHeadset" style="display: none" :id="'showEffect'+index+'Headset'">1</button>
        <button class="buttonKeypad" style="display: none" :id="'showEffect'+index+'Keypad'">1</button>
        <button class="buttonMouse" style="display: none" :id="'showEffect'+index+'Mouse'">1</button>
        <button class="buttonMousepad" style="display: none" :id="'showEffect'+index+'Mousepad'">1</button>
      </section>
      <section v-show="index != undefined && index != ''">
        <div v-on:click="keyboardCanvasClick" style="display: inline-table;"><object :id="'canvasKeyboardShowEffect'+index" class="canvasKeyboard" style="pointer-events:none;" width="620" height="332">
        <object-svg-keyboard></object-svg-keyboard>
        </object></div>
      </section>
    </div>
  </div>
  `});

Vue.component('div-chroma-set', {
  props: ['index', 'header', 'image', 'video'],
  methods: {
    keyboardClick: function () {
      console.log('function not set');
    },
    keyboardCanvasClick: function (event) {
      //console.log('keyboardCanvasClick');
    },
    componentDownloadZipAnimation: function () {
      downloadZipAnimation(this.index);
    }
  },
  template: `
  <div style="padding-bottom: 50px; display: inline-table">
    <div class="box" style="padding: 0px; width: 650px; background: hsl(0, 0%, 10%); display: inline-table; vertical-align: top;">
      <div style="background: hsl(0, 0%, 20%); width: 650px;">
        <button class="buttonChroma" :onclick="keyboardClick" style="font-size: 1.2em; display: inline-table; padding: 4px; max-width: 65px" :id="'showEffect'+index">{{ index }}</button>
        <div style="width: 550px; display: inline-table">{{ header }}</div>
      </div>
      <section v-show="index != undefined && index != ''" style="padding: 0px; font-size: 0.65em; text-align: center;">
        <small>
        <b>Download:</b>
        <a style="border:1px solid #04D;
        text-decoration: none;
        color: #FFF;
        background-color: #048;
        padding: 1px;
        margin: 1px;
        width: 50px;
        text-align: center;" name="link" @click="componentDownloadZipAnimation()" href="javascript:true;">ZIP</a>
        </small>
      </section>
      <section v-show="image != undefined && image != ''">
        <div style="width: 645px; padding-left: 25px; background: hsl(0, 0%, 10%); color: white; display: inline-table"><img :src="image"/></div>
      </section>
      <section v-show="video != undefined && video != ''">
        <div style="width: 645px; padding-left: 25px; background: hsl(0, 0%, 10%); color: white; display: inline-table">
        <video :id="'video'+index" style="width: 645px; height: 430px;" :src="video" muted autoplay loop></video>
        </div>
      </section>
      <section v-show="index != undefined && index != ''">
        <button class="buttonChromaLink" style="display: none" :id="'showEffect'+index+'ChromaLink'">1</button>
        <button class="buttonHeadset" style="display: none" :id="'showEffect'+index+'Headset'">1</button>
        <button class="buttonKeypad" style="display: none" :id="'showEffect'+index+'Keypad'">1</button>
        <button class="buttonMouse" style="display: none" :id="'showEffect'+index+'Mouse'">1</button>
        <button class="buttonMousepad" style="display: none" :id="'showEffect'+index+'Mousepad'">1</button>
      </section>
      <section v-show="index != undefined && index != ''">
        <div style="display: flex; flex-direction: row;">
          <div v-on:click="keyboardCanvasClick" style="display: inline-table;">
          <object-svg-keyboard :id="'canvasKeyboardShowEffect'+index" class="canvasKeyboard" style="pointer-events:none;" width="400" height="214"></object-svg-keyboard>
          </div>
          <object :id="'canvasKeypadShowEffect'+index" class="canvasKeypad" type="image/svg+xml" data="/ChromaCommon/emulator/EmulatorKeypad.svg" width="110" height="214"></object>
          <object :id="'canvasMouseShowEffect'+index" class="canvasMouse" type="image/svg+xml" data="/ChromaCommon/emulator/EmulatorMouse.svg" width="110" height="214"></object>
        </div>
      </section>
      <section v-show="index != undefined && index != ''">
        <div style="display: flex; flex-direction: row;">
          <object :id="'canvasChromaLinkShowEffect'+index" class="canvasChromaLink" type="image/svg+xml" data="/ChromaCommon/emulator/EmulatorChromaLink.svg" width="200" height="200"></object>
          <object :id="'canvasHeadsetShowEffect'+index" class="canvasHeadset" type="image/svg+xml" data="/ChromaCommon/emulator/EmulatorHeadset.svg" width="214" height="214"></object>
          <object :id="'canvasMousepadShowEffect'+index" class="canvasMousepad" type="image/svg+xml" data="/ChromaCommon/emulator/EmulatorMousepad.svg" width="214" height="214"></object>
        </div>
      </section>
    </div>
  </div>
  `});
Vue.component('div-chroma-set-list', {
  template: `
      <div>
        <div-chroma-set v-for="item in items" :index="item.index" :header="item.header" ></div-chroma-set>
      </div>
    `,
  data() {
    return {
      items: $root.dataDivChromaSets
    };
  }
});
Vue.component('inline-chroma-set', {
  props: ['index', 'alt-index', 'header', 'video', 'priority', 'devices', 'description'],
  template: `
    <table class="tableInline">
    <tr>
      <td><u>{{ header }}</u></td><td colspan="3" style="min-width: 640px; width: 640px; max-width: 640px">{{ description }}</td>
    </tr>
    <tr :show="index != undefined && index != ''">
      <td colspan="4" style="font-size: 0.75em">Download:
        <a name="link" :onclick="'downloadChromaLinkAnimation('+index+')'" href="javascript:true;">ChromaLink</a>
        <a name="link" :onclick="'downloadHeadsetAnimation('+index+')'" href="javascript:true;">Headset</a>
        <a name="link" :onclick="'downloadKeyboardAnimation('+index+')'" href="javascript:true;">Keyboard</a>
        <a name="link" :onclick="'downloadMouseAnimation('+index+')'" href="javascript:true;">Mouse</a>
        <a name="link" :onclick="'downloadMousepadAnimation('+index+')'" href="javascript:true;">Mousepad</a>
        <a name="link" :onclick="'downloadKeypadAnimation('+index+')'" href="javascript:true;">Keypad</a>
      </td>
    </tr>
    <tr v-show="video != undefined && video != ''"><td align="center">{{ priority }}</td><td colspan="4"><video class="imgThumbnail" autoplay muted loop><source :src="video"/></video></td>
    <tr><td align="center"><button class="buttonChroma" :id="'showEffect'+index">{{ index }}</button></td><td colspan="4"><canvas class="canvasKeyboard" :id="'canvasKeyboardShowEffect'+index" width="640" height="214"></canvas></td></tr>
    <tr><td align="empty"><button class="buttonChromaLink" :id="'showEffect'+index+'ChromaLink'">1</button></td><td colspan="4"><canvas class="canvasChromaLink" :id="'canvasChromaLinkShowEffect'+index" width="640" height="50"></canvas></td></tr>
    <tr><td align="empty">
      <button class="buttonHeadset" :id="'showEffect'+index+'Headset'">1</button>
      <button class="buttonMousepad" :id="'showEffect'+index+'Mousepad'">1</button>
      <button class="buttonMouse" :id="'showEffect'+index+'Mouse'">1</button>
     </td><td colspan="4">
       <canvas class="canvasHeadset" :id="'canvasHeadsetShowEffect'+index" width="210" height="214"></canvas>
       <canvas class="canvasMousepad" :id="'canvasMousepadShowEffect'+index" width="294" height="214"></canvas>
       <canvas class="canvasMouse" :id="'canvasMouseShowEffect'+index" width="128" height="214"></canvas>
     </td></tr>
    </table>
    `});

Vue.component('tr-chroma-keyboard', {
  props: ['index'],
  template: `
    <tr v-show="index != undefined && index != ''"><td align="center" width="250px"><a :name="index"></a><button class="buttonChroma" :id="'showTableEffect'+index">{{ '+'+index }}</button></td><td colspan="4"><canvas :id="'canvasKeyboardShowTableEffect'+index" class="canvasKeyboard" width="640" height="214"></canvas></td></tr>
    `});

Vue.component('tr-chroma-set', {
  props: ['index'],
  template: `
    <tr v-show="index != undefined && index != ''">
      <td align="center" width="250px"><a :name="index"></a>
        <button class="buttonChroma" :id="'showEffect'+index">{{ '+'+index }}</button>
        <button class="buttonChromaLink" :id="'showEffect'+index+'ChromaLink'">1</button>
        <button class="buttonHeadset" :id="'showEffect'+index+'Headset'">1</button>
        <button class="buttonMousepad" :id="'showEffect'+index+'Mousepad'">1</button>
        <button class="buttonMouse" :id="'showEffect'+index+'Mouse'">1</button>
      </td>
      <td colspan="4">
        <small>Download:
        <a name="link" :onclick="'downloadChromaLinkAnimation('+index+')'" href="javascript:true;">ChromaLink</a>
        <a name="link" :onclick="'downloadHeadsetAnimation('+index+')'" href="javascript:true;">Headset</a>
        <a name="link" :onclick="'downloadKeyboardAnimation('+index+')'" href="javascript:true;">Keyboard</a>
        <a name="link" :onclick="'downloadMouseAnimation('+index+')'" href="javascript:true;">Mouse</a>
        <a name="link" :onclick="'downloadMousepadAnimation('+index+')'" href="javascript:true;">Mousepad</a>
        <a name="link" :onclick="'downloadKeypadAnimation('+index+')'" href="javascript:true;">Keypad</a>
        </small><br/>
        <small>Convert:
        <a name="link" :onclick="'convertChromaLinkAnimation('+index+')'" href="javascript:true;">ChromaLink</a>
        <a name="link" :onclick="'convertHeadsetAnimation('+index+')'" href="javascript:true;">Headset</a>
        <a name="link" :onclick="'convertMouseAnimation('+index+')'" href="javascript:true;">Mouse</a>
        <a name="link" :onclick="'convertMousepadAnimation('+index+')'" href="javascript:true;">Mousepad</a>
        <a name="link" :onclick="'convertKeypadAnimation('+index+')'" href="javascript:true;">Keypad</a><br/>
        </small><br/>
        <canvas class="canvasKeyboard" :id="'canvasKeyboardShowEffect'+index" width="640" height="214"></canvas><br/>
        <canvas class="canvasChromaLink" :id="'canvasChromaLinkShowEffect'+index" width="640" height="50"></canvas><br/>
        <canvas class="canvasHeadset" :id="'canvasHeadsetShowEffect'+index" width="210" height="214"></canvas>
        <canvas class="canvasMousepad" :id="'canvasMousepadShowEffect'+index" width="294" height="214"></canvas>
        <canvas class="canvasMouse" :id="'canvasMouseShowEffect'+index" width="128" height="214"></canvas>
      </td>
    </tr>
    `});

Vue.component('block-chroma-keyboard', {
  props: ['index', 'header', 'priority', 'devices', 'description', 'bonus', 'image', 'video'],
  template: `
    <table class="tableBlock" width="100%">
    <tr bgcolor="#444444" v-show="header != undefined">
    <td><b>Effect</b></td>
    <td><b>Priority</b></td>
    <td><b>Devices</b></td>
    <td><b>Description</b></td>
    <td><b>Bonus (P2+)</b></td>
    </tr>

    <tr v-show="header != undefined">
      <td width="250px">{{ header }}</td><td width="125px">{{ priority }}</td><td width="125px">{{ devices }}</td><td>{{ description }}</td><td class="tdEmpty">{{ bonus }}</td>
    </tr>
    <tr v-show="video != undefined && video != ''"><td class="tdEmpty" width="250px"></td><td colspan="4"><video class="imgThumbnail" autoplay muted loop><source :src="video"/></video></td></tr>
    <tr v-show="image != undefined && image != ''"><td class="tdEmpty" width="250px"></td><td colspan="4"><img :src="image"/></td></tr>
    <tr v-show="index != undefined && index != ''">
      <td class="tdEmpty"></td>
      <td colspan="4">
        Download:
        <a name="link" :onclick="'downloadKeyboardTableAnimation('+index+')'" href="javascript:true;">Keyboard</a>
      </td>
    </tr>
    <tr v-show="index != undefined && index != ''"><td align="center" width="250px"><button class="buttonChroma" :id="'showTableEffect'+index">{{ '+'+index }}</button></td><td colspan="4"><canvas :id="'canvasKeyboardShowTableEffect'+index" class="canvasKeyboard" width="640" height="214"></canvas></td></tr>
    </table>
    `});

function getRGBValuesFromString(color) {
  var newColor = "";
  for (var i = 0; i < color.length; ++i) {
    var c = color[i];
    switch (c) {
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
      case ',':
        newColor += c;
        break;
    }
  }
  return newColor;
}

vue = new Vue({
  el: '#root',

  data: {
    editText: '',
    colors: [
      //{ color: '#FF0000' },
    ],
    thresholds: [
      //{ threshold: 0, max: 255, step: 1},
    ],
    layers: [
      { value: "/ChromaCommon/animations/BarrelFlash1_Keyboard.chroma" }
    ],
    layerOptions: [
      //{ label: "BarrelFlash1", value: "/ChromaCommon/animations/BarrelFlash1_Keyboard.chroma" }
    ],
    predefineColors: [
      '#ff0000',
      '#ff4500',
      '#ff8c00',
      '#ffd700',
      '#ffff00',
      '#90ee90',
      '#00ffff',
      '#1e90ff',
      '#c71585',
      '#ff00ff'
    ],
    dataDivChromaSets: [
    ]
  },

  methods: {

    convertIntToHex(value) {
      var result = value.toString(16);
      if (result.length == 1) {
        return "0" + result;
      }
      return result;
    },

    hexToRGB(hex) {
      if (hex.indexOf("#") >= 0) {
        var color = parseInt("0x" + hex.substring(1));
        var blue = color & 0xFF;
        var green = (color & 0xFF00) >> 8;
        var red = (color & 0xFF0000) >> 16;
        return getRGBString(red, green, blue);
      } else {
        return "rgb(255, 255, 255)";
      }
    },

    getEditLayer(layerIndex) {
      var c = 0;
      for (var i = 0; i < vue.$children.length; ++i) {
        if (vue.$children[i].constructor.options.name == "ElSelect") {
          if (c == layerIndex) {
            var layer = vue.$children[i].value;
            if (layer != undefined) {
              return layer;
            }
            return "";
          }
          ++c;
        }
      }
      return "";
    },

    getEditColor(colorIndex) {
      var c = 0;
      for (var i = 0; i < vue.$children.length; ++i) {
        if (vue.$children[i].constructor.options.name == "ElColorPicker") {
          //console.log('color picker', vue.$children[i]._data.color.value);
          if (c == colorIndex) {
            var color = vue.$children[i]._data.color.value;
            if (color != undefined) {
              return this.hexToRGB(color);
            }
            return "rgb(255, 255, 255)";
          }
          ++c;
        }
      }
      return "rgb(255, 255, 255)";
    },

    getEditThreshold(thresholdIndex) {
      var threshold = vue._data.thresholds[thresholdIndex].threshold
      if (threshold == undefined) {
        return 255;
      }
      return threshold;
    },

    setEditColor(colorIndex, hex) {
      vue._data.colors[colorIndex].color = hex;
    },

    modifyEditLayer(lines, i, layerIndex, token) {
      var line = lines[i];

      try {
        var index = line.indexOf(token);
        if (index >= 0) {
          //console.log('before', 'layerIndex', layerIndex, line);

          var first = index + token.length;
          var start = undefined;
          for (var j = first; j < line.length; ++j) {
            if (line[j] == '"' || line[j] == "'") {
              if (start == undefined) {
                start = j;
              } else {
                var layer = this.getEditLayer(layerIndex);
                //console.log(layerIndex, 'layer', layer);
                ++layerIndex;
                line = line.substring(0, start + 1) + layer + line.substring(j);
                break;
              }
            }
          }

          //console.log('after', 'layerIndex', layerIndex, line);
          lines[i] = line;
        }
      } catch (err) {
        console.error('layerIndex', layerIndex, err);
      }
      return layerIndex;
    },

    modifyEditThreshold(lines, i, thresholdIndex, token, arg) {
      var line = lines[i];

      try {
        var index = line.indexOf(token);
        if (index >= 0) {
          //console.log('before', 'thresholdIndex', thresholdIndex, line);
          var first = index + token.length;

          var last = line.substring(first).indexOf(')');
          var args = line.substring(first).substring(0, last).split(",");
          //console.log('args', args);

          args[arg] = this.getEditThreshold(thresholdIndex);
          vue._data.thresholds[thresholdIndex].max = 255;
          vue._data.thresholds[thresholdIndex].step = 1;
          ++thresholdIndex;

          line = line.substring(0, first) + args.join(",") + line.substring(first + last);

          //console.log('after', 'thresholdIndex', thresholdIndex, line);
          lines[i] = line;
        }
      } catch (err) {
        console.error('thresholdIndex', thresholdIndex, err);
      }
      return thresholdIndex;
    },

    modifyEditThresholdF(lines, i, thresholdIndex, token, arg) {
      var line = lines[i];

      try {
        var index = line.indexOf(token);
        if (index >= 0) {
          //console.log('before', 'thresholdIndex', thresholdIndex, line);
          var first = index + token.length;

          var last = line.substring(first).indexOf(')');
          var args = line.substring(first).substring(0, last).split(",");
          //console.log('args', args);

          args[arg] = this.getEditThreshold(thresholdIndex);
          vue._data.thresholds[thresholdIndex].max = 1;
          vue._data.thresholds[thresholdIndex].step = 0.1;
          ++thresholdIndex;

          line = line.substring(0, first) + args.join(",") + line.substring(first + last);

          //console.log('after', 'thresholdIndex', thresholdIndex, line);
          lines[i] = line;
        }
      } catch (err) {
        console.error('thresholdIndex', thresholdIndex, err);
      }
      return thresholdIndex;
    },

    modifyEditColor(lines, i, colorIndex, token, arg) {
      var line = lines[i];

      try {
        var index = line.indexOf(token);
        if (index >= 0) {
          //console.log('before', 'colorIndex', colorIndex, line);
          var first = index + token.length;

          var last = line.substring(first).indexOf(')');
          var args = line.substring(first).substring(0, last).split(",");
          //console.log('args', args);

          var editColor = this.getEditColor(colorIndex);
          var newColor = getRGBValuesFromString(editColor);
          var parts = newColor.split(",");
          args[arg] = parts[0];
          args[arg + 1] = parts[1];
          args[arg + 2] = parts[2];
          ++colorIndex;

          line = line.substring(0, first) + args.join(",") + line.substring(first + last);

          //console.log('after', 'colorIndex', colorIndex, line);
          lines[i] = line;
        }
      } catch (err) {
        console.error('colorIndex', colorIndex, err);
      }
      return colorIndex;
    },

    onTextChange(text) {
      //console.log('onTextChange', text);
      var editText = vue._data.editText;
      editButton.onclick = eval(editButton.id + " = " + editText);
      ChromaAnimation.closeAnimation(editCanvas.id);
      var first = editText.indexOf('{');
      var last = editText.lastIndexOf('}') + 1;
      var code = editText.substring(first, last);
      eval(code);
    },

    onLayerChange(option) {
      //console.log(option);

      var refThis = this;
      setTimeout(function () {
        var layerIndex = 0;

        var editText = vue._data.editText;
        var lines = editText.toString().split(/\n/);
        for (var i = 0; i < lines.length; ++i) {
          layerIndex = refThis.modifyEditLayer(lines, i, layerIndex, 'var baseLayer');
          layerIndex = refThis.modifyEditLayer(lines, i, layerIndex, 'var layer');
        }
        editText = lines.join("\n");
        vue._data.editText = editText;
        editButton.onclick = eval(editButton.id + " = " + editText);
        ChromaAnimation.closeAnimation(editCanvas.id);
        var first = editText.indexOf('{');
        var last = editText.lastIndexOf('}') + 1;
        var code = editText.substring(first, last);
        eval(code);
      }, 100);
    },

    onColorChange(color) {

      var colorIndex = 0;

      //console.log('color-change', color, this, self);
      var editText = vue._data.editText;
      var lines = editText.toString().split(/\n/);
      for (var i = 0; i < lines.length; ++i) {
        colorIndex = this.modifyEditColor(lines, i, colorIndex, 'ChromaAnimation.getRGB(', 0);
        colorIndex = this.modifyEditColor(lines, i, colorIndex, 'ChromaAnimation.makeBlankFramesRGB(', 3);
        colorIndex = this.modifyEditColor(lines, i, colorIndex, 'ChromaAnimation.multiplyIntensityRGB(', 2);
        colorIndex = this.modifyEditColor(lines, i, colorIndex, 'ChromaAnimation.multiplyIntensityAllFramesRGB(', 1);
        colorIndex = this.modifyEditColor(lines, i, colorIndex, 'ChromaAnimation.fillThresholdColorsRGB(', 3);
        colorIndex = this.modifyEditColor(lines, i, colorIndex, 'ChromaAnimation.fillThresholdColorsAllFramesRGB(', 2);
        colorIndex = this.modifyEditColor(lines, i, colorIndex, 'ChromaAnimation.fillThresholdColorsMinMaxAllFramesRGB(', 2); //first
        colorIndex = this.modifyEditColor(lines, i, colorIndex, 'ChromaAnimation.fillThresholdColorsMinMaxAllFramesRGB(', 6); //second
        colorIndex = this.modifyEditColor(lines, i, colorIndex, 'ChromaAnimation.addThresholdColorsMinMaxAllFramesRGB(', 2); //first
        colorIndex = this.modifyEditColor(lines, i, colorIndex, 'ChromaAnimation.addThresholdColorsMinMaxAllFramesRGB(', 6); //second
        colorIndex = this.modifyEditColor(lines, i, colorIndex, 'ChromaAnimation.subtractThresholdColorsMinMaxAllFramesRGB(', 2); //first
        colorIndex = this.modifyEditColor(lines, i, colorIndex, 'ChromaAnimation.subtractThresholdColorsMinMaxAllFramesRGB(', 6); //second
        colorIndex = this.modifyEditColor(lines, i, colorIndex, 'ChromaAnimation.fillNonZeroColorAllFramesRGB(', 1);
        colorIndex = this.modifyEditColor(lines, i, colorIndex, 'ChromaAnimation.fillZeroColorAllFramesRGB(', 1);
        colorIndex = this.modifyEditColor(lines, i, colorIndex, 'ChromaAnimation.setKeysColorAllFramesRGB(', 2);
        colorIndex = this.modifyEditColor(lines, i, colorIndex, 'ChromaAnimation.offsetColorsAllFrames(', 1);
        colorIndex = this.modifyEditColor(lines, i, colorIndex, 'ChromaAnimation.reactiveKeyEffectAllFramesRGB(', 3);
      }
      editText = lines.join("\n");
      vue._data.editText = editText;
      editButton.onclick = eval(editButton.id + " = " + editText);
      ChromaAnimation.closeAnimation(editCanvas.id);
      var first = editText.indexOf('{');
      var last = editText.lastIndexOf('}') + 1;
      var code = editText.substring(first, last);
      eval(code);
    },

    onThresholdChange(threshold) {

      var thresholdIndex = 0;

      //console.log('color-change', color, this, self);
      var editText = vue._data.editText;
      var lines = editText.toString().split(/\n/);
      for (var i = 0; i < lines.length; ++i) {
        thresholdIndex = this.modifyEditThreshold(lines, i, thresholdIndex, 'ChromaAnimation.fillThresholdColorsAllFramesRGB(', 1);
        thresholdIndex = this.modifyEditThreshold(lines, i, thresholdIndex, 'ChromaAnimation.fillThresholdColorsMinMaxAllFramesRGB(', 1); //first
        thresholdIndex = this.modifyEditThreshold(lines, i, thresholdIndex, 'ChromaAnimation.fillThresholdColorsMinMaxAllFramesRGB(', 5); //second
        thresholdIndex = this.modifyEditThreshold(lines, i, thresholdIndex, 'ChromaAnimation.addThresholdColorsMinMaxAllFramesRGB(', 1); //first
        thresholdIndex = this.modifyEditThreshold(lines, i, thresholdIndex, 'ChromaAnimation.addThresholdColorsMinMaxAllFramesRGB(', 5); //second
        thresholdIndex = this.modifyEditThreshold(lines, i, thresholdIndex, 'ChromaAnimation.subtractThresholdColorsMinMaxAllFramesRGB(', 1); //first
        thresholdIndex = this.modifyEditThreshold(lines, i, thresholdIndex, 'ChromaAnimation.subtractThresholdColorsMinMaxAllFramesRGB(', 5); //second
        thresholdIndex = this.modifyEditThresholdF(lines, i, thresholdIndex, 'ChromaAnimation.multiplyIntensityAllFrames(', 1);
      }
      editText = lines.join("\n");
      vue._data.editText = editText;
      editButton.onclick = eval(editButton.id + " = " + editText);
      ChromaAnimation.closeAnimation(editCanvas.id);
      var first = editText.indexOf('{');
      var last = editText.lastIndexOf('}') + 1;
      var code = editText.substring(first, last);
      eval(code);
    }


  }
});

//common animations

var animations = [];
animations.push('Arc1_Keyboard.chroma');
animations.push('Arc2_Keyboard.chroma');
animations.push('Arc3_Keyboard.chroma');
animations.push('Arc4_Keyboard.chroma');
animations.push('Arrow1_Keyboard.chroma');
animations.push('BarrelFlash1_Keyboard.chroma');
animations.push('BarrelFlash2_Keyboard.chroma');
animations.push('BarrelFlash3_Keyboard.chroma');
animations.push('BarRightToLeft_Keyboard.chroma');
animations.push('BarTopDown_Keyboard.chroma');
animations.push('BattleBus_Keyboard.chroma');
animations.push('Bird1_Keyboard.chroma');
animations.push('BlackAndWhiteRainbow_Keyboard.chroma');
animations.push('Blank_Keyboard.chroma');
animations.push('Blank2_Keyboard.chroma');
animations.push('Block1_Keyboard.chroma');
animations.push('Block2_Keyboard.chroma');
animations.push('Block3_Keyboard.chroma');
animations.push('Block4_Keyboard.chroma');
animations.push('Bolt1_Keyboard.chroma');
animations.push('Bolt2_Keyboard.chroma');
animations.push('Bolt3_Keyboard.chroma');
animations.push('Bolt4_Keyboard.chroma');
animations.push('Bow1_Keyboard.chroma');
animations.push('Chainsaw1_Keyboard.chroma');
animations.push('Chest1_Keyboard.chroma');
animations.push('Cinematic1_Keyboard.chroma');
animations.push('Cinematic2_Keyboard.chroma');
animations.push('Cinematic3_Keyboard.chroma');
animations.push('CircleExpanding_Keyboard.chroma');
animations.push('CircleLarge_Keyboard.chroma');
animations.push('CircleLarge2_Keyboard.chroma');
animations.push('CircleLargeLeft_Keyboard.chroma');
animations.push('CircleLargeRight_Keyboard.chroma');
animations.push('CircleSmall_Keyboard.chroma');
animations.push('CircleSmallLeft_Keyboard.chroma');
animations.push('CircleSmallRight_Keyboard.chroma');
animations.push('Claws1_Keyboard.chroma');
animations.push('Clouds1_Keyboard.chroma');
animations.push('Clouds2_Keyboard.chroma');
animations.push('Clouds3_Keyboard.chroma');
animations.push('Damage1_Keyboard.chroma');
animations.push('Damage2_Keyboard.chroma');
animations.push('Damage3_Keyboard.chroma');
animations.push('Damage4_Keyboard.chroma');
animations.push('Damage5_Keyboard.chroma');
animations.push('Damage6_Keyboard.chroma');
animations.push('Damage7_Keyboard.chroma');
animations.push('Damage8_Keyboard.chroma');
animations.push('Dragon1_Keyboard.chroma');
animations.push('Dragon2_Keyboard.chroma');
animations.push('Dragon3_Keyboard.chroma');
animations.push('Energy1_Keyboard.chroma');
animations.push('Fireball1_Keyboard.chroma');
animations.push('Fork1_Keyboard.chroma');
animations.push('Fork2_Keyboard.chroma');
animations.push('Fork3_Keyboard.chroma');
animations.push('Fork4_Keyboard.chroma');
animations.push('Fork5_Keyboard.chroma');
animations.push('FreeFall1_Keyboard.chroma');
animations.push('FreeFall2_Keyboard.chroma');
animations.push('Glider1_Keyboard.chroma');
animations.push('Glider2_Keyboard.chroma');
animations.push('Hatchet_Keyboard.chroma');
animations.push('Heart1_Keyboard.chroma');
animations.push('Ladder1_Keyboard.chroma');
animations.push('Ladder2_Keyboard.chroma');
animations.push('LaserA_Keyboard.chroma');
animations.push('LaserB_Keyboard.chroma');
animations.push('LaserRotate_Keyboard.chroma');
animations.push('LaserScroll_Keyboard.chroma');
animations.push('Lightning1_Keyboard.chroma');
animations.push('Lightning2_Keyboard.chroma');
animations.push('Lightning3_Keyboard.chroma');
animations.push('Llama1_Keyboard.chroma');
animations.push('Llama2_Keyboard.chroma');
animations.push('Llama3_Keyboard.chroma');
animations.push('Llama4_Keyboard.chroma');
animations.push('Logo1_Keyboard.chroma');
animations.push('Logo2_Keyboard.chroma');
animations.push('MachineGun1_Keyboard.chroma');
animations.push('MachineGun2_Keyboard.chroma');
animations.push('Melee1_Keyboard.chroma');
animations.push('Missile1_Keyboard.chroma');
animations.push('Missile2_Keyboard.chroma');
animations.push('Missile3_Keyboard.chroma');
animations.push('MovementUpLeft_Keyboard.chroma');
animations.push('MovementUpRight_Keyboard.chroma');
animations.push('OpenDoor1_Keyboard.chroma');
animations.push('OpenDoor2_Keyboard.chroma');
animations.push('OutParticle1_Keyboard.chroma');
animations.push('Particle1_Keyboard.chroma');
animations.push('Particle2_Keyboard.chroma');
animations.push('Particle3_Keyboard.chroma');
animations.push('ParticleTrail1_Keyboard.chroma');
animations.push('ParticleTrail2_Keyboard.chroma');
animations.push('ParticleTrail3_Keyboard.chroma');
animations.push('ParticleTrail4_Keyboard.chroma');
animations.push('Projectiles_Keyboard.chroma');
animations.push('Rain1_Keyboard.chroma');
animations.push('Ray1_Keyboard.chroma');
animations.push('Ray2_Keyboard.chroma');
animations.push('ReactiveSpace_Keyboard.chroma');
animations.push('Reticle1_Keyboard.chroma');
animations.push('Reticle2_Keyboard.chroma');
animations.push('Reticle3_Keyboard.chroma');
animations.push('Reticle4_Keyboard.chroma');
animations.push('Ring1_Keyboard.chroma');
animations.push('Ring2_Keyboard.chroma');
animations.push('Ring3_Keyboard.chroma');
animations.push('RocketProjectile1_Keyboard.chroma');
animations.push('Search1_Keyboard.chroma');
animations.push('Search2_Keyboard.chroma');
animations.push('Search3_Keyboard.chroma');
animations.push('Search4_Keyboard.chroma');
animations.push('SearchLight1_Keyboard.chroma');
animations.push('Spiral_Keyboard.chroma');
animations.push('Spray1_Keyboard.chroma');
animations.push('Spray2_Keyboard.chroma');
animations.push('Spray3_Keyboard.chroma');
animations.push('Star_Keyboard.chroma');
animations.push('Stripes1_Keyboard.chroma');
animations.push('Sword1_Keyboard.chroma');
animations.push('ThrowUp_Keyboard.chroma');
animations.push('ThrowUpLeft_Keyboard.chroma');
animations.push('ThrowUpRight_Keyboard.chroma');
animations.push('Tongue1_Keyboard.chroma');
animations.push('Tornado1_Keyboard.chroma');
animations.push('Trail1_Keyboard.chroma');
animations.push('Trail2_Keyboard.chroma');
animations.push('Trail3_Keyboard.chroma');
animations.push('Train1_Keyboard.chroma');
animations.push('Train2_Keyboard.chroma');
animations.push('Travel1_Keyboard.chroma');
animations.push('UpParticle1_Keyboard.chroma');
animations.push('UpParticle2_Keyboard.chroma');
animations.push('UpParticle3_Keyboard.chroma');
animations.push('WindMill1_Keyboard.chroma');
animations.push('Wisp1_Keyboard.chroma');
animations.push('Wisp2_Keyboard.chroma');
animations.push('Wisp3_Keyboard.chroma');
animations.push('WispBuild_Keyboard.chroma');
animations.push('WispLarge_Keyboard.chroma');
animations.push('X_Keyboard.chroma');
animations.push('X1_Keyboard.chroma');
animations.push('X2_Keyboard.chroma');
animations.push('XOutline_Keyboard.chroma');

var layerOptions = [];
for (var i in animations) {
  var animation = animations[i];
  layerOptions.push({ label: animation, value: '/ChromaCommon/animations/' + animation });
  vue._data.layerOptions = layerOptions;
}

parseEditColor = function (line, token, arg) {
  var index = line.indexOf(token);
  if (index >= 0) {
    var first = index + token.length;
    for (var j = first; j < line.length; ++j) {
      //extract rgb
      if (line[j] == ')') {
        var rgb = line.substring(first, j);
        var parts = rgb.split(",");
        var red = vue.convertIntToHex(parseInt(parts[arg].trim()));
        var green = vue.convertIntToHex(parseInt(parts[arg + 1].trim()));
        var blue = vue.convertIntToHex(parseInt(parts[arg + 2].trim()));
        var editColor = "#" + red + green + blue;
        vue._data.colors.push({ color: editColor });
        break;
      }
    }
  }
}
parseEditThreshold = function (line, token, arg) {
  var index = line.indexOf(token);
  if (index >= 0) {
    var first = index + token.length;
    for (var j = first; j < line.length; ++j) {
      //extract rgb
      if (line[j] == ')') {
        var args = line.substring(first, j);
        var parts = args.split(",");
        var threshold = parseInt(parts[arg].trim());
        vue._data.thresholds.push({ threshold: threshold, max: 255, step: 1 });
        break;
      }
    }
  }
}
parseEditThresholdF = function (line, token, arg) {
  var index = line.indexOf(token);
  if (index >= 0) {
    var first = index + token.length;
    for (var j = first; j < line.length; ++j) {
      //extract rgb
      if (line[j] == ')') {
        var args = line.substring(first, j);
        var parts = args.split(",");
        var threshold = parseFloat(parts[arg].trim());
        vue._data.thresholds.push({ threshold: threshold, max: 1, step: 0.1 });
        break;
      }
    }
  }
}
parseEditLayer = function (line, token, arg) {
  var index = line.indexOf(token);
  if (index >= 0) {
    var first = index + token.length;
    var start = undefined;
    for (var j = first; j < line.length; ++j) {
      //extract rgb
      if (line[j] == '"' || line[j] == "'") {
        if (start == undefined) {
          start = j + 1;
        } else {
          var path = line.substring(start).substring(0, j - start);
          //console.log('path', path);
          vue._data.layers.push({ label: path.substring(path.lastIndexOf('/')), value: path });
        }
      }
    }
  }
}
displayEditComponents = function () {

  // show RGB colors

  // reset data
  vue._data.layers = [];
  vue._data.colors = [];
  vue._data.thresholds = [];

  var lines = vue._data.editText.toString().split(/\n/);
  for (var i = 0; i < lines.length; ++i) {
    var line = lines[i];
    //console.log(line);

    parseEditLayer(line, 'var baseLayer');
    parseEditLayer(line, 'var layer');

    parseEditColor(line, 'ChromaAnimation.getRGB(', 0);
    parseEditColor(line, 'ChromaAnimation.makeBlankFramesRGB(', 3);
    parseEditColor(line, 'ChromaAnimation.multiplyIntensityRGB(', 2);
    parseEditColor(line, 'ChromaAnimation.multiplyIntensityAllFramesRGB(', 1);
    parseEditColor(line, 'ChromaAnimation.fillThresholdColorsRGB(', 3);
    parseEditColor(line, 'ChromaAnimation.fillThresholdColorsAllFramesRGB(', 2);
    parseEditColor(line, 'ChromaAnimation.fillThresholdColorsMinMaxAllFramesRGB(', 2); //first
    parseEditColor(line, 'ChromaAnimation.fillThresholdColorsMinMaxAllFramesRGB(', 6); //second
    parseEditColor(line, 'ChromaAnimation.addThresholdColorsMinMaxAllFramesRGB(', 2); //first
    parseEditColor(line, 'ChromaAnimation.addThresholdColorsMinMaxAllFramesRGB(', 6); //second
    parseEditColor(line, 'ChromaAnimation.subtractThresholdColorsMinMaxAllFramesRGB(', 2); //first
    parseEditColor(line, 'ChromaAnimation.subtractThresholdColorsMinMaxAllFramesRGB(', 6); //second
    parseEditColor(line, 'ChromaAnimation.fillNonZeroColorAllFramesRGB(', 1);
    parseEditColor(line, 'ChromaAnimation.fillZeroColorAllFramesRGB(', 1);
    parseEditColor(line, 'ChromaAnimation.setKeysColorAllFramesRGB(', 2);
    parseEditColor(line, 'ChromaAnimation.offsetColorsAllFrames(', 1);
    parseEditColor(line, 'ChromaAnimation.reactiveKeyEffectAllFrames(', 3);

    parseEditThreshold(line, 'ChromaAnimation.fillThresholdColorsAllFramesRGB(', 1);
    parseEditThreshold(line, 'ChromaAnimation.fillThresholdColorsMinMaxAllFramesRGB(', 1); //second
    parseEditThreshold(line, 'ChromaAnimation.fillThresholdColorsMinMaxAllFramesRGB(', 5); //second
    parseEditThreshold(line, 'ChromaAnimation.addThresholdColorsMinMaxAllFramesRGB(', 1); //second
    parseEditThreshold(line, 'ChromaAnimation.addThresholdColorsMinMaxAllFramesRGB(', 5); //second
    parseEditThreshold(line, 'ChromaAnimation.subtractThresholdColorsMinMaxAllFramesRGB(', 1); //second
    parseEditThreshold(line, 'ChromaAnimation.subtractThresholdColorsMinMaxAllFramesRGB(', 5); //second
    parseEditThresholdF(line, 'ChromaAnimation.multiplyIntensityAllFrames(', 1);
  }
}
openLiveEditor = function (canvas, buttonName) {
  editButton = document.getElementById(buttonName);
  if (editButton == undefined) {
    console.error(buttonName, 'could not be found!');
    return;
  }
  editCanvas = canvas;
  var panel = document.getElementById('editPanel');
  if (panel == undefined ||
    panel.style == undefined) {
    console.error('editPanel', 'could not be found!');
    return;
  }
  if (editButton.onclick == undefined) {
    var index = buttonName.substring('showEffect'.length);
    var keyboardClick = undefined;
    for (var i in vue.dataDivChromaSets) {
      var divChromaSet = vue.dataDivChromaSets[i];
      if (divChromaSet.index == index) {
        keyboardClick = divChromaSet.keyboardClick;
        break;
      }
    }
    if (keyboardClick == undefined) {
      console.error(buttonName, 'does not have a click event');
      return;
    }
    editButton.onclick = keyboardClick;
  }
  var editText = editButton.onclick.toString();
  if (panel.style.display == "none" ||
    vue._data.editText != editText) {
    panel.style.display = "";
    var top = document.documentElement.scrollTop || document.body.scrollTop;
    var left = (document.documentElement.scrollLeft || document.body.scrollLeft) + editButton.getBoundingClientRect().x;
    left += 715;
    top += editButton.getBoundingClientRect().y - 100;
    var style = "top: " + Math.floor(top) + "px; left: " + Math.floor(left) + "px; width: 1500px; height: 910px";
    panel.style = style;
    vue._data.editText = editText;

    displayEditComponents();

  } else {
    panel.style.display = "none";
  }
}
setupLiveEditOnClick = function (canvas) {
  if (canvas.id != undefined) {
    //console.log('canvas.id', canvas.id);
    var buttonName = 's' + canvas.id.substring('canvasKeyboardS'.length);
    canvas.parentElement.onclick = function () {
      openLiveEditor(canvas, buttonName);
    };
  }
}
function downloadAnimation(index, deviceType) {
  if (deviceType == 'Zip') {
    var deviceTypes = [];
    deviceTypes.push('ChromaLink');
    deviceTypes.push('Headset');
    deviceTypes.push('Keyboard');
    deviceTypes.push('Keypad');
    deviceTypes.push('Mouse');
    deviceTypes.push('Mousepad');
    var zip = new JSZip();
    for (var typeIndex in deviceTypes) {
      deviceType = deviceTypes[typeIndex];
      var canvasName = 'canvas' + deviceType + 'ShowEffect' + index;
      //console.log('canvasName', canvasName);
      var animation = ChromaAnimation.getAnimation(canvasName)
      if (animation != undefined) {
        var data = animation.saveAnimation();
        zip.file('ShowEffect' + index + '_' + deviceType + '.chroma', data);
      }
    }
    zip.generateAsync({
      type: "blob"
    }).then(function (content) {
      var uriContent = URL.createObjectURL(content);
      var lnkDownload = document.getElementById('lnkDownload');
      lnkDownload.download = 'ShowEffect' + index + '.zip';
      lnkDownload.href = uriContent;
      lnkDownload.click();
    });
  } else {
    var canvasName = 'canvas' + deviceType + 'ShowEffect' + index;
    var animation = ChromaAnimation.getAnimation(canvasName)
    if (animation != undefined) {
      //console.log(canvasName, animation);
      var data = animation.saveAnimation();
      var uriContent = URL.createObjectURL(data);
      var lnkDownload = document.getElementById('lnkDownload');
      lnkDownload.download = 'ShowEffect' + index + '_' + deviceType + '.chroma';
      lnkDownload.href = uriContent;
      lnkDownload.click();
    }
  }
}
function downloadTableAnimation(index, deviceType) {
  var canvasName = 'canvas' + deviceType + 'ShowTableEffect' + index;
  var animation = ChromaAnimation.getAnimation(canvasName)
  if (animation != undefined) {
    //console.log(canvasName, animation);
    var data = animation.saveAnimation();
    var uriContent = URL.createObjectURL(data);
    var lnkDownload = document.getElementById('lnkDownload');
    lnkDownload.download = 'ShowTableEffect' + index + '_' + deviceType + '.chroma';
    lnkDownload.href = uriContent;
    lnkDownload.click();
  }
}
function downloadZipAnimation(index) {
  downloadAnimation(index, 'Zip');
}
function downloadKeyboardAnimation(index) {
  downloadAnimation(index, 'Keyboard');
}
function downloadChromaLinkAnimation(index) {
  downloadAnimation(index, 'ChromaLink');
}
function downloadHeadsetAnimation(index) {
  downloadAnimation(index, 'Headset');
}
function downloadMouseAnimation(index) {
  downloadAnimation(index, 'Mouse');
}
function downloadMousepadAnimation(index) {
  downloadAnimation(index, 'Mousepad');
}
function downloadKeypadAnimation(index) {
  downloadAnimation(index, 'Keypad');
}
function downloadKeyboardTableAnimation(index) {
  downloadTableAnimation(index, 'Keyboard');
}

function convertAnimation(index, deviceType, targetDeviceType) {
  if (targetDeviceType == 'Zip') {
    var deviceTypes = [];
    deviceTypes.push('ChromaLink');
    deviceTypes.push('Headset');
    deviceTypes.push('Keyboard');
    deviceTypes.push('Keypad');
    deviceTypes.push('Mouse');
    deviceTypes.push('Mousepad');
    var zip = new JSZip();
    for (var typeIndex in deviceTypes) {
      targetDeviceType = deviceTypes[typeIndex];
      var canvasName = 'canvas' + deviceType + 'ShowEffect' + index;
      var sourceAnimation = ChromaAnimation.getAnimation(canvasName)
      if (sourceAnimation == undefined) {
        continue;
      }
      var targetName = 'canvas' + targetDeviceType + 'ShowEffect' + index;
      //console.log(canvasName, sourceAnimation);
      var data = undefined;
      switch (targetDeviceType) {
        case 'ChromaLink':
          data = ChromaAnimation.convertAnimation(canvasName, targetName, EChromaSDKDeviceTypeEnum.DE_1D, EChromaSDKDevice1DEnum.DE_ChromaLink);
          break;
        case 'Headset':
          data = ChromaAnimation.convertAnimation(canvasName, targetName, EChromaSDKDeviceTypeEnum.DE_1D, EChromaSDKDevice1DEnum.DE_Headset);
          break;
        case 'Mousepad':
          data = ChromaAnimation.convertAnimation(canvasName, targetName, EChromaSDKDeviceTypeEnum.DE_1D, EChromaSDKDevice1DEnum.DE_Mousepad);
          break;
        case 'Keyboard':
          data = sourceAnimation; //no change
          break;
        case 'Keypad':
          data = ChromaAnimation.convertAnimation(canvasName, targetName, EChromaSDKDeviceTypeEnum.DE_2D, EChromaSDKDevice2DEnum.DE_Keypad);
          break;
        case 'Mouse':
          data = ChromaAnimation.convertAnimation(canvasName, targetName, EChromaSDKDeviceTypeEnum.DE_2D, EChromaSDKDevice2DEnum.DE_Mouse);
          break;
      }
      if (data == undefined) {
        continue;
      }
      var saveFile = data.saveAnimation();
      zip.file('ShowEffect' + index + '_' + targetDeviceType + '.chroma', saveFile);
    }
    zip.generateAsync({
      type: "blob"
    }).then(function (content) {
      var uriContent = URL.createObjectURL(content);
      var lnkDownload = document.getElementById('lnkDownload');
      lnkDownload.download = 'ShowEffect' + index + 'Converted.zip';
      lnkDownload.href = uriContent;
      lnkDownload.click();
    });
  } else {
    var canvasName = 'canvas' + deviceType + 'ShowEffect' + index;
    var sourceAnimation = ChromaAnimation.getAnimation(canvasName)
    if (sourceAnimation == undefined) {
      return;
    }
    var targetName = 'canvas' + targetDeviceType + 'ShowEffect' + index;
    //console.log(canvasName, sourceAnimation);
    var data = undefined;
    switch (targetDeviceType) {
      case 'ChromaLink':
        data = ChromaAnimation.convertAnimation(canvasName, targetName, EChromaSDKDeviceTypeEnum.DE_1D, EChromaSDKDevice1DEnum.DE_ChromaLink);
        break;
      case 'Headset':
        data = ChromaAnimation.convertAnimation(canvasName, targetName, EChromaSDKDeviceTypeEnum.DE_1D, EChromaSDKDevice1DEnum.DE_Headset);
        break;
      case 'Mousepad':
        data = ChromaAnimation.convertAnimation(canvasName, targetName, EChromaSDKDeviceTypeEnum.DE_1D, EChromaSDKDevice1DEnum.DE_Mousepad);
        break;
      case 'Keyboard':
        data = ChromaAnimation.convertAnimation(canvasName, targetName, EChromaSDKDeviceTypeEnum.DE_2D, EChromaSDKDevice2DEnum.DE_Keyboard);
        break;
      case 'Keypad':
        data = ChromaAnimation.convertAnimation(canvasName, targetName, EChromaSDKDeviceTypeEnum.DE_2D, EChromaSDKDevice2DEnum.DE_Keypad);
        break;
      case 'Mouse':
        data = ChromaAnimation.convertAnimation(canvasName, targetName, EChromaSDKDeviceTypeEnum.DE_2D, EChromaSDKDevice2DEnum.DE_Mouse);
        break;
    }
    if (data == undefined) {
      return;
    }
    var uriContent = URL.createObjectURL(data.saveAnimation());
    var lnkDownload = document.getElementById('lnkDownload');
    lnkDownload.download = 'ShowEffect' + index + '_' + targetDeviceType + '.chroma';
    lnkDownload.href = uriContent;
    lnkDownload.click();
  }
}
function convertZipAnimation(index) {
  convertAnimation(index, 'Keyboard', 'Zip');
}
function convertChromaLinkAnimation(index) {
  convertAnimation(index, 'Keyboard', 'ChromaLink');
}
function convertHeadsetAnimation(index) {
  convertAnimation(index, 'Keyboard', 'Headset');
}
function convertMouseAnimation(index) {
  convertAnimation(index, 'Keyboard', 'Mouse');
}
function convertMousepadAnimation(index) {
  convertAnimation(index, 'Keyboard', 'Mousepad');
}
function convertKeypadAnimation(index) {
  convertAnimation(index, 'Keyboard', 'Keypad');
}
