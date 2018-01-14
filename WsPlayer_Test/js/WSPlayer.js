//LICENSE! This Code can be used and executed as a part of Flashphoner Web Call Server platform and having an appropriate Web Call Server license. You shall not use this code separately from Web Call Server platform. Contacts: http://flashphoner.com, support@flashphoner.com.
/*
 *u: videoTime
 *v: audioTime
 *A6: callbackTime
 *J: frameBuffer
 */

var requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
        window.setTimeout(callback, 16.666666666666668);
    };
})();

function WSPlayer(canvas, api) {
    this.canvas = canvas;
    this.w = false;
    this.frameBuffer = [];
    this.api = api;
}
WSPlayer.prototype.init = function(F) {
    this.F = F;
    this.g = true;
    this.edr = false;
    this.audioReceived = false;
    this.videoReceived = false;
    try {
        /*window.AudioContext = window.AudioContext || window.webkitAudioContext;
        var audioContext = new AudioContext;
        audioContext.close();
        audioContext = new AudioContext;
        if (this.V) {
            this.V.M.close();
        }
        this.V = new AudioPlayer(audioContext, this.m.bind(this));*/
    } catch (e) {
        wsLogger.error("Failed to init audio player " + e);
        return;
    }
    try {
        this.R = new VideoRenderer(this.canvas, true, "rgba");
        this.R.init();
    } catch (e) {
        wsLogger.error("Failed to init video renderer " + e);
        return;
    }
    try {
        if (this.W) {
            this.W.terminate();
        }
        this.W = new Worker(F.receiverPath);
        this.W.addEventListener("message", (function(e) {
            switch (e.data.message) {
                case "avail":
                    this.g = false;
                    this.m();
                    this.unmute();
                    break;
                case "failed":
                    this.stop();
                    this.w = false;
                    this.Aw("Websocket connection failed!");
                    break;
                case "AVData":
                    if (e.data.flushIndicator) {
                        //wsLogger.log("Flush audio " + this.V.Au() + " video " + this.frameBuffer.length);
                        //this.V.BD();
                        this.frameBuffer = [];
                    }
                    this.g = false;
                    var i;
                    if (e.data.audio.length > 0 && !this.F.startWithVideoOnly) {
                        this.audioReceived = true;
                        for (i = 0; i < e.data.audio.length; i++) {
                            this.V.BB(e.data.audio[i]);
                        }
                    }
                    if (e.data.video.length > 0) {
                        this.videoReceived = true;
                        for (i = 0; i < e.data.video.length; i++) {
                            this.frameBuffer.push(e.data.video[i]);
                        }
                        if (!this.edr) {
                            requestAnimFrame(this.AB.bind(this));
                            this.edr = true;
                        }
                    } else if (this.F.startWithVideoOnly) {
                        this.m();
                    } else {
                        if (!this.edr) {
                            requestAnimFrame(this.AB.bind(this));
                            this.edr = true;
                        }
                    }
					//&& this.V.Ax() > 0
                    if (e.data.noAudioDataAvailableIndicator && false && !this.F.startWithVideoOnly) {
                        if (this.V.Ar) {
                            if (this.V.Au() == 0) {
                                this.o = Date.now();
                                this.AF = true;
                            }
                        }
                    } else if (e.data.noVideoDataAvailableIndicator && this.R.Av()) {
                        var BF = 500;
                        if (Date.now() - this.R.Av() > BF) {
                            this.o = Date.now();
                            this.AF = true;
                        }
                    } else if (this.o > 0) {
                        if (Date.now() - this.o > 2000) {
                            this.AF = false;
                            this.o = 0;
                        }
                    }
					
                    break;
                default:
                    wsLogger.error("Unknown request");
            }
        }).bind(this), false);
        var conf = {};
        //conf.audioChunkLength = this.V.internalBufferSize;
        conf.audioContextSampleRate = 1;//this.V.M.sampleRate;
        conf.videoWidth = F.videoWidth;
        conf.videoHeight = F.videoHeight;
        conf.urlWsServer = F.urlWsServer;
        conf.token = F.token;
        conf.audioBufferWaitFor = F.audioBufferWaitFor;
        conf.videoBufferWaitFor = F.videoBufferWaitFor;
        conf.dropDelayMultiplier = F.dropDelayMultiplier;
        conf.videoFaststart = F.startWithVideoOnly;
        conf.outputFormat = "rgba";
        this.W.postMessage({
            message: "init",
            data: conf
        });
    } catch (e) {
        wsLogger.error("Failed to init stream receiver " + e);
        return;
    }
    this.AH = 0;
    this.p = 0;
    this._ = 0;
    this.AF = false;
    this.o = 0;
    this.w = true;
};
WSPlayer.prototype.play = function(stream) {
    if (!this.w) {
        this.init(this.F);
    }
    this.g = true;
    this.W.postMessage({
        message: "play"
    });
	/*
    if (!this.F.startWithVideoOnly) {
        this.V.start();
    }
	*/
    this.stream = stream;
};
WSPlayer.prototype.pause = function() {
    this.g = true;
    this.mute();
    this.W.postMessage({
        message: "pause"
    });
};
WSPlayer.prototype.mute = function() {
    if (this.V) {
        this.V.mute(true);
    }
    if (this.R) {
        this.R.mute(true);
    }
};
WSPlayer.prototype.unmute = function() {
    if (this.V) {
        this.V.mute(false);
    }
    if (this.R) {
        this.R.mute(false);
    }
};
WSPlayer.prototype.resume = function() {
    this.W.postMessage({
        message: "resume"
    });
};
WSPlayer.prototype.playFirstSound = function() {
 /*   if (this.w == false) {
        this.init(this.F);
    }
    var b = this.V.M.createBuffer(1, 441, 44100);
    var j = b.getChannelData(0);
    for (var i = 0; i < j.length; i++) {
        j[i] = Math.random() * 2 - 1;
    }
    var src = this.V.M.createBufferSource();
    src.buffer = b;
    src.connect(this.V.l);
    src.start(0);
    if (this.F.startWithVideoOnly) {
        this.F.startWithVideoOnly = false;
        this.V.start();
    }*/
};
WSPlayer.prototype.stop = function() {
    this.g = true;
    if (this.W) {
        this.W.postMessage({
            message: "stop"
        });
    }
    if (this.V) {
        this.V.stop();
    }
    if (this.R) {
        this.R.stop();
    }
    this.frameBuffer = [];
    this.AH = 0;
    this.p = 0;
    this._ = 0;
};
WSPlayer.prototype.m = function() {
    if (!this.g) {
        this.g = true;
        this.W.postMessage({
            message: "feed",
            data: {
                audioBuffSize: 0,//this.V.Au(),
                videoBuffSize: this.frameBuffer.length
            }
        });
    }
};
WSPlayer.prototype.AB = function(callbackTime) {
    if (!this.w) {
        return;
    }
    this.edr = false;
    if (this.frameBuffer.length > 0) {
        var audioTime = -1;//this.V.Ax();
        if (audioTime == -1) {
            audioTime = this.frameBuffer[0].sync;
        }
        wsLogger.trace("requestVideoFrameCallback, audio player time " + audioTime + " callback timestamp " + callbackTime);
        
        var videoTimeu = 0;
        while (this.frameBuffer.length != 0) {
            videoTime = this.frameBuffer[0].sync;
            if (audioTime - videoTime > 100) {
                wsLogger.debug("Drop old decoded video frame from buffer, ts " + videoTime + " video time " + videoTime + " audio time " + audioTime + " video_late_ms " + (audioTime - videoTime) + " time now " + Date.now());
                this.frameBuffer.shift();
                wsLogger.debug("Frames in buffer " + this.frameBuffer.length);

            } else {
                break;
            }
        }
    // if (!this.w) {
    //     return;
    // }
    // this.edr = false;
    // if (this.frameBuffer.length > 0) {
    //     var audioTime = -1;//this.V.Ax();
    //     if (audioTime == -1) {
    //         audioTime = this.frameBuffer[0].sync;
    //     }
    //     wsLogger.trace("requestVideoFrameCallback, audio player time " + audioTime + " callback timestamp " + callbackTime);
    //     
	// 	audioTime = (Date.now() + 2208988800 * 1000);
    //     var videoTime = 0;
    //     while (this.frameBuffer.length != 0) {
    //         videoTime = this.frameBuffer[0].sync;
    //         timeLatency = audioTime - videoTime;
    //         if (audioTime - videoTime > 10000) {
    //             wsLogger.debug("Drop old decoded video frame from buffer, ts " + videoTime + " video time " + videoTime + " audio time " + audioTime + " video_late_ms " + (audioTime - videoTime) + " time now " + Date.now());
    //             this.frameBuffer.shift();
    //             wsLogger.debug("Frames in buffer " + this.frameBuffer.length);
    //         } else {
    //             break;
    //         }
    //     }
        if (this.frameBuffer.length == 0) {
            this.m();
        } else {
			
            if (this.frameBuffer[0].sync <= audioTime) {
                this.R.AW(this.frameBuffer.shift());
                this._++;
            }
			
            if (this.frameBuffer.length > 0 && this.frameBuffer[0].sync - audioTime < 40) {
                requestAnimFrame(this.AB.bind(this));
                this.edr = true;
            }
			
            if (this.frameBuffer.length < 5) {
                this.m();
            }
        }
    } else {
        this.m();
    }
    if (this.F.CO) {
        if (this.p == 0) {
            this.p = Date.now();
        } else if (Date.now() - this.p > 990) {
            this.AH = this._;
            this._ = 0;
            this.p = Date.now();
        }
        this.BN("FPS:" + this.AH);
    }
    if (this.AF) {
        this.Hy("Video fps less than 2");
    }
};
WSPlayer.prototype.Hy = function(message) {
    if (this.jiu) {
        if (Date.now() - this.jiu < 1000) {
            return;
        }
    }
    this.stream.status = StreamStatus.PlaybackProblem;
    this.stream.info = message;
    this.api.invokeListener(WCSEvent.StreamStatusEvent, [this.stream]);
    this.jiu = Date.now();
};
WSPlayer.prototype.Aw = function(text) {
    var O = this.R.c;
    if (O) {
        var textSize = O.measureText(text);
        O.fillStyle = "white";
        var Ak = 30;
        O.fillRect(0, this.canvas.height / 2 - Ak / 2, this.canvas.width, Ak);
        O.fillStyle = "black";
        O.font = "30pt";
        O.textAlign = "center";
        O.fillText(text, this.canvas.width / 2, this.canvas.height / 2);
    } else {}
};
WSPlayer.prototype.BN = function(text) {
    var O = this.R.c;
    if (O) {
        O.fillStyle = "red";
        O.font = "40pt";
        O.fillText(text, 20, this.canvas.height - 20);
    } else {}
};
WSPlayer.prototype.initLogger = function(verbosity) {
    this.verbosity = verbosity || 0;
    var I = this;
    if (window.wsLogger == undefined) {
        window.wsLogger = {
            log: function() {
                if (I.verbosity >= 2) {
                    window.console.log.apply(window.console, arguments);
                }
            },
            warn: function() {
                if (I.verbosity >= 1) {
                    window.console.warn.apply(window.console, arguments);
                }
            },
            error: function() {
                if (I.verbosity >= 0) {
                    window.console.error.apply(window.console, arguments);
                }
            },
            debug: function() {
                if (I.verbosity >= 3) {
                    window.console.log.apply(window.console, arguments);
                }
            },
            trace: function() {
                if (I.verbosity >= 4) {
                    window.console.log.apply(window.console, arguments);
                }
            }
        };
    }
    if (window.wsLogger.debug == undefined) {
        window.wsLogger.debug = function() {
            if (I.verbosity >= 3) {
                window.console.log.apply(window.console, arguments);
            }
        };
    }
    if (window.wsLogger.trace == undefined) {
        window.wsLogger.trace = function() {
            if (I.verbosity >= 4) {
                window.console.log.apply(window.console, arguments);
            }
        };
    }
};
WSPlayer.prototype.getStreamStatistics = function(type) {
    if (type == "audio") {
        return this.audioReceived;
    } else if (type == "video") {
        return this.videoReceived;
    }
};
var VideoRenderer = function(canvas, AQ, inputFormat) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.AC = null;
    this.c = null;
    this.AQ = AQ;
    this.inputFormat = inputFormat;
    this.B = null;
    this.Z = null;
    this.buffer = null;
    this.Ab = null;
    this.Ad = null;
    this.Ae = null;
    this.RGBTexture = null;
    this.Ygf = null;
    this.Af = null;
    this.BM = null;
    this.Al = null;
    this.AT = false;
    this.A4 = ["precision mediump float;", "uniform sampler2D YTexture;", "uniform sampler2D CBTexture;", "uniform sampler2D CRTexture;", "varying vec2 texCoord;", "void main() {", "float y = texture2D(YTexture, texCoord).r;", "float cr = texture2D(CBTexture, texCoord).r - 0.5;", "float cb = texture2D(CRTexture, texCoord).r - 0.5;", "gl_FragColor = vec4(", "y + 1.4 * cr,", "y + -0.343 * cb - 0.711 * cr,", "y + 1.765 * cb,", "1.0", ");", "}"].join("\n");
    this.A3 = ["attribute vec2 vertex;", "varying vec2 texCoord;", "void main() {", "texCoord = vertex;", "gl_Position = vec4((vertex * 2.0 - 1.0) * vec2(1, -1), 0.0, 1.0);", "}"].join("\n");
    this.Htf = ["attribute vec4 vertex;", "varying vec2 tc;", "void main(){", "gl_Position = vertex;", "tc = vertex.xy*0.5+0.5;", "}"].join("\n");
    this.jYT = ["precision highp float;", "uniform sampler2D RGBTexture;", "varying vec2 tc;", "void main(){", "gl_FragColor = texture2D(RGBTexture, tc);", "}"].join("\n");
};
VideoRenderer.prototype.init = function() {
    if (!this.AQ) {
        try {
            var B = this.B = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
        } catch (e) {
            wsLogger.error("Failed to get webgl context, error " + e);
        }
    }
    if (B) {
        if (this.inputFormat == "rgba") {
            this.Kt(B);
        } else {
            this.jr(B);
        }
    } else {
        this.c = this.canvas.getContext("2d");
        this.AC = this.Aa;
    }
    this.Am();
};
VideoRenderer.prototype.jr = function(B) {
    this.buffer = B.createBuffer();
    B.bindBuffer(B.ARRAY_BUFFER, this.buffer);
    B.bufferData(B.ARRAY_BUFFER, new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]), B.STATIC_DRAW);
    this.Z = B.createProgram();
    B.attachShader(this.Z, this.compileShader(B.VERTEX_SHADER, this.A3));
    B.attachShader(this.Z, this.compileShader(B.FRAGMENT_SHADER, this.A4));
    B.linkProgram(this.Z);
    if (!B.getProgramParameter(this.Z, B.LINK_STATUS)) {
        wsLogger.error("Failed to init WebGL! Message " + B.getProgramInfoLog(this.Z));
        this.c = this.canvas.getContext("2d");
        this.AC = this.Aa;
        return;
    }
    B.useProgram(this.Z);
    this.Ab = this.createTexture(0, "YTexture");
    this.Ad = this.createTexture(1, "CBTexture");
    this.Ae = this.createTexture(2, "CRTexture");
    var vertexAttr = B.getAttribLocation(this.Z, "vertex");
    B.enableVertexAttribArray(vertexAttr);
    B.vertexAttribPointer(vertexAttr, 2, B.FLOAT, false, 0, 0);
    this.AC = this.BC;
};
VideoRenderer.prototype.Kt = function(B) {
    this.buffer = B.createBuffer();
    B.bindBuffer(B.ARRAY_BUFFER, this.buffer);
    B.bufferData(B.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, 1, 1, 1, 1, -1, 1, -1, -1]), B.STATIC_DRAW);
    this.Z = B.createProgram();
    B.attachShader(this.Z, this.compileShader(B.VERTEX_SHADER, this.Htf));
    B.attachShader(this.Z, this.compileShader(B.FRAGMENT_SHADER, this.jYT));
    B.bindAttribLocation(this.Z, 0, "vertex");
    B.linkProgram(this.Z);
    if (!B.getProgramParameter(this.Z, B.LINK_STATUS)) {
        wsLogger.error("Failed to init WebGL! Message " + B.getProgramInfoLog(this.Z));
        this.c = this.canvas.getContext("2d");
        this.AC = this.Aa;
        return;
    }
    B.useProgram(this.Z);
    B.enableVertexAttribArray(0);
    B.vertexAttribPointer(0, 2, B.FLOAT, false, 0, 0);
    this.RGBTexture = this.createTexture(0, "RGBTexture");
    this.AC = this.Kv;
};
VideoRenderer.prototype.Am = function() {
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.Af = parseInt(this.width) + 15 >> 4;
    this.BM = this.Af << 4;
    this.Al = this.Af << 3;
    var MaybeClampedUint8Array;
    if (typeof Uint8ClampedArray !== "undefined") {
        MaybeClampedUint8Array = Uint8ClampedArray;
    } else {
        MaybeClampedUint8Array = Uint8Array;
    }
    if (this.c) {
        this.Ygf = new MaybeClampedUint8Array(this.canvas.width * this.canvas.height * 4);
        for (var i = 0, length = this.Ygf.length; i < length; i++) {
            this.Ygf[i] = 255;
        }
    } else if (this.B) {
        this.B.viewport(0, 0, this.width, this.height);
    }
};
VideoRenderer.prototype.stop = function() {
    if (this.c) {
        var data = this.c.createImageData(this.width, this.height);
        this.c.putImageData(data, 0, 0);
    } else if (this.B) {
        this.B.clear(this.B.COLOR_BUFFER_BIT | this.B.DEPTH_BUFFER_BIT);
    }
};
VideoRenderer.prototype.createTexture = function(index, name) {
    var B = this.B;
    var texture = B.createTexture();
    B.bindTexture(B.TEXTURE_2D, texture);
    B.texParameteri(B.TEXTURE_2D, B.TEXTURE_MAG_FILTER, B.LINEAR);
    B.texParameteri(B.TEXTURE_2D, B.TEXTURE_MIN_FILTER, B.LINEAR);
    B.texParameteri(B.TEXTURE_2D, B.TEXTURE_WRAP_S, B.CLAMP_TO_EDGE);
    B.texParameteri(B.TEXTURE_2D, B.TEXTURE_WRAP_T, B.CLAMP_TO_EDGE);
    B.uniform1i(B.getUniformLocation(this.Z, name), index);
    return texture;
};
VideoRenderer.prototype.compileShader = function(type, source) {
    var B = this.B;
    var shader = B.createShader(type);
    B.shaderSource(shader, source);
    B.compileShader(shader);
    if (!B.getShaderParameter(shader, B.COMPILE_STATUS)) {
        throw new Error(B.getShaderInfoLog(shader));
    }
    return shader;
};
VideoRenderer.prototype.isUsingWebGL = function() {
    return (this.B !== null || this.B !== undefined) && (this.c == null || this.c == undefined);
};
VideoRenderer.prototype.BC = function(data) {
    var B = this.B;
    var A$ = data.payload.y,
        A7 = data.payload.cr,
        A9 = data.payload.cb;
    B.activeTexture(B.TEXTURE0);
    B.bindTexture(B.TEXTURE_2D, this.Ab);
    B.texImage2D(B.TEXTURE_2D, 0, B.LUMINANCE, this.BM, this.height, 0, B.LUMINANCE, B.UNSIGNED_BYTE, A$);
    B.activeTexture(B.TEXTURE1);
    B.bindTexture(B.TEXTURE_2D, this.Ad);
    B.texImage2D(B.TEXTURE_2D, 0, B.LUMINANCE, this.Al, this.height / 2, 0, B.LUMINANCE, B.UNSIGNED_BYTE, A7);
    B.activeTexture(B.TEXTURE2);
    B.bindTexture(B.TEXTURE_2D, this.Ae);
    B.texImage2D(B.TEXTURE_2D, 0, B.LUMINANCE, this.Al, this.height / 2, 0, B.LUMINANCE, B.UNSIGNED_BYTE, A9);
    B.drawArrays(B.TRIANGLE_STRIP, 0, 4);
};
VideoRenderer.prototype.Kv = function(data) {
    var B = this.B;
    B.activeTexture(B.TEXTURE0);
    B.bindTexture(B.TEXTURE_2D, this.RGBTexture);
    B.pixelStorei(B.UNPACK_FLIP_Y_WEBGL, true);
    B.texImage2D(B.TEXTURE_2D, 0, B.RGBA, data.width, data.height, 0, B.RGBA, B.UNSIGNED_BYTE, data.payload);
    B.drawArrays(B.TRIANGLES, 0, 6);
};


VideoRenderer.prototype.Aa = function(frame) {
    var data = this.c.createImageData(frame.width, frame.height);
    if (frame.type == "yuv") {
        this.HG(frame);
        data.data.set(this.Ygf);
    } else {
        data.data.set(frame.payload);
    }
	//document.getElementById("abc").innerHTML = data.data[0];
    this.c.putImageData(data, 0, 0);
	
	
	var cvs = document.getElementById("v");
    console.log(cvs.width);
    console.log(cvs.height);
	var ctx = cvs.getContext("2d");
	
	var d = ctx.createImageData(config.videoWidth, config.videoHeight);
	d.data.set(data.data);
	ctx.putImageData(d, 0, 0);

    //window["video"] = data.data;
};
VideoRenderer.prototype.AW = function(frame) {
    if (!this.AT) {
        if (this.canvas.width != frame.width || this.canvas.height != frame.height) {
            wsLogger.log("Changing canvas resolution from " + this.canvas.width + "x" + this.canvas.height + " to " + frame.width + "x" + frame.height);
            this.canvas.width = frame.width;
            this.canvas.height = frame.height;
            this.Am();
        }
        this.AC(frame);
    }
    this.BE = Date.now();
};
VideoRenderer.prototype.HG = function(frame) {
    var Lkj = frame.payload.y;
    var Ea = frame.payload.cb;
    var EI = frame.payload.cr;
    var AK = this.Ygf;
    var Cz = 0;
    var Cy = this.BM;
    var Df = this.BM + (this.BM - frame.width);
    var B6 = 0;
    var EL = this.Al - (frame.width >> 1);
    var A0 = 0;
    var A1 = frame.width * 4;
    var Dj = frame.width * 4;
    var EP = frame.width >> 1;
    var rows = frame.height >> 1;
    var y, cb, cr, AR, Bq, b;
    for (var DY = 0; DY < rows; DY++) {
        for (var Dc = 0; Dc < EP; Dc++) {
            cb = Ea[B6];
            cr = EI[B6];
            B6++;
            AR = cr + (cr * 103 >> 8) - 179;
            Bq = (cb * 88 >> 8) - 44 + (cr * 183 >> 8) - 91;
            b = cb + (cb * 198 >> 8) - 227;
            var s = Lkj[Cz++];
            var $ = Lkj[Cz++];
            AK[A0] = s + AR;
            AK[A0 + 1] = s - Bq;
            AK[A0 + 2] = s + b;
            AK[A0 + 4] = $ + AR;
            AK[A0 + 5] = $ - Bq;
            AK[A0 + 6] = $ + b;
            A0 += 8;
            var AX = Lkj[Cy++];
            var AT = Lkj[Cy++];
            AK[A1] = AX + AR;
            AK[A1 + 1] = AX - Bq;
            AK[A1 + 2] = AX + b;
            AK[A1 + 4] = AT + AR;
            AK[A1 + 5] = AT - Bq;
            AK[A1 + 6] = AT + b;
            A1 += 8;
        }
        Cz += Df;
        Cy += Df;
        A0 += Dj;
        A1 += Dj;
        B6 += EL;
    }
};
VideoRenderer.prototype.Av = function() {
    return this.BE;
};
VideoRenderer.prototype.mute = function(mute) {
    if (mute) {
        this.AT = true;
    } else {
        this.AT = false;
    }
};

function AudioPlayer(audioContext, requestDataCallback) {
    var I = this;
    this.Am();
    this.AK = false;
    this.M = audioContext;
    this.l = audioContext.createGain();
    this.l.connect(audioContext.destination);
    this.mute(true);
    wsLogger.log("Sample rate " + this.M.sampleRate);
    this.requestDataCallback = requestDataCallback;
    var t = [];
    var i;
    for (i = 256; i <= 16384; i = i * 2) {
        t.push(i);
    }
    var Ao = this.M.sampleRate / 10;
    var z = t[0];
    var As = Math.abs(Ao - z);
    for (i = 0; i < t.length; i++) {
        var At = Math.abs(Ao - t[i]);
        if (At < As) {
            As = At;
            z = t[i];
        }
    }
    wsLogger.log("Audio node buffer size " + z);
    this.internalBufferSize = z;
    try {
        this.M.createScriptProcessor = this.M.createScriptProcessor || this.M.createJavaScriptNode;
        this.AO = this.M.createScriptProcessor(this.internalBufferSize, 1, 1);
    } catch (e) {
        wsLogger.error("JS Audio Node is not supported in this browser" + e);
    }
    this.AO.onaudioprocess = function(event) {
        var A1;
        var j = event.outputBuffer.getChannelData(0);
        var i;
        if (I.b.length > 0) {
            var A0 = I.b.shift();
            A1 = A0.payload;
            for (i = 0; i < j.length; i++) {
                j[i] = A1[i];
            }
            I.AE = A0.sync;
            I.d = Date.now();
            I.Ar = false;
        } else {
            for (i = 0; i < j.length; i++) {
                j[i] = 0;
            }
            I.Ar = true;
            if (I.l.gain.value != 0 && I.d) {
                wsLogger.debug("No audio in audio buffer!");
            }
        }
        I.requestDataCallback();
    };
}
AudioPlayer.prototype.start = function() {
    if (!this.AK) {
        this.AO.connect(this.l);
        this.AK = true;
    }
    this.mute(false);
};
AudioPlayer.prototype.stop = function() {
    this.AO.disconnect();
    this.AK = false;
    this.AE = undefined;
    this.d = undefined;
    this.b = [];
    this.mute(true);
};
AudioPlayer.prototype.Am = function() {
    this.b = [];
};
AudioPlayer.prototype.BD = function() {
    this.Am();
};
AudioPlayer.prototype.BB = function(BL) {
    this.b.push(BL);
};
AudioPlayer.prototype.Au = function() {
    return this.b.length;
};
AudioPlayer.prototype.Ax = function() {
    if (this.AE && this.d) {
        if (Date.now() - this.d > this.internalBufferSize / this.M.sampleRate * 1000 * 1.5) {
            wsLogger.debug("No audio! " + (Date.now() - this.d) + " size " + this.internalBufferSize / this.M.sampleRate * 1000);
            return this.internalBufferSize / this.M.sampleRate * 1000 + this.AE;
        }
        return Date.now() - this.d + this.AE;
    }
    return -1;
};
AudioPlayer.prototype.Ca = function() {
    return this.d;
};
AudioPlayer.prototype.mute = function(mute) {
    if (mute) {
        wsLogger.log("Audio player mute");
        this.l.gain.value = 0;
    } else {
        wsLogger.log("Audio player resume");
        this.l.gain.value = 1;
    }
};
AudioPlayer.prototype.setVolume = function(value) {
    this.l.gain.value = value;
};
AudioPlayer.prototype.getVolume = function() {
    return this.l.gain.value;
};