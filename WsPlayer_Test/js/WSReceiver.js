//LICENSE! This Code can be used and executed as a part of Flashphoner Web Call Server platform and having an appropriate Web Call Server license. You shall not use this code separately from Web Call Server platform. Contacts: http://flashphoner.com, support@flashphoner.com.
self.onmessage = function(e) {
    switch (e.data.message) {
        case "init":
            this.Av = new U(e.data.data);
            this.Av.FS();
            this.connection = new C0(e.data.data.urlWsServer, this.Av.Fz.bind(this.Av));
            this.connection.connect(e.data.data.token);
            break;
        case "stop":
            this.Av.stop();
            break;
        case "play":
            this.Av.Fw();
            break;
        case "pause":
            this.Av.Fq();
            break;
        case "resume":
            this.Av.Fv();
            break;
        case "feed":
            var data = this.Av.Ev(e.data.data);
            if (data == undefined) {
                return;
            }
            var Cx = [];
            var i;
            if (data.audio.length > 0) {
                for (i = 0; i < data.audio.length; i++) {
                    Cx.push(data.audio[i].payload.buffer);
                }
            }
            if (data.video.length > 0) {
                for (i = 0; i < data.video.length; i++) {
                    if (data.video[i].type == "yuv") {
                        Cx.push(data.video[i].payload.y.buffer);
                        Cx.push(data.video[i].payload.cr.buffer);
                        Cx.push(data.video[i].payload.cb.buffer);
                    } else {
                        Cx.push(data.video[i].payload.buffer);
                    }
                }
            }
            data.message = "AVData";
            self.postMessage(data, Cx);
            break;
        default:
            ;
    }
};
var Ew = 8000;
var K = {
    Bo: -1,
    log: function() {
        if (this.Bo >= 2) {
            console.log.apply(console, arguments);
        }
    },
    warn: function() {
        if (this.Bo >= 1) {
            console.warn.apply(console, arguments);
        }
    },
    error: function() {
        if (this.Bo >= 0) {
            console.error.apply(console, arguments);
        }
    },
    debug: function() {
        if (this.Bo >= 3) {
            console.log.apply(console, arguments);
        }
    },
    trace: function() {
        if (this.Bo >= 4) {
            console.log.apply(console, arguments);
        }
    }
};

function U(conf) {
    this.videoWidth = conf.videoWidth;
    this.videoHeight = conf.videoHeight;
    this.audioContextSampleRate = conf.audioContextSampleRate;
    this.audioChunkLength = conf.audioChunkLength;
    this.audioBufferWaitFor = conf.audioBufferWaitFor || 1000;
    this.videoBufferWaitFor = conf.videoBufferWaitFor || 1000;
    this.dropDelayMultiplier = conf.dropDelayMultiplier || 3;
    this.videoFaststart = conf.videoFaststart || false;
    this.outputFormat = conf.outputFormat || "rgba";
    this.C9();
    this.Dh();
    this.Da();
}
U.prototype.FS = function() {
    this.Ca = new VideoDecoder(this.Ex.bind(this), this.outputFormat);
    this.Ca.C$(this.videoWidth, this.videoHeight);
    this.A$ = new Resampler(8000, this.audioContextSampleRate, 1, this.audioContextSampleRate, true);
    this.v = AA.C8;
};
U.prototype.Fw = function() {
    this.v = AA.C6;
    this.flushIndicator = true;
};
U.prototype.stop = function() {
    this.v = AA.C8;
    this.C9();
    this.Dh();
    this.Da();
};
U.prototype.Fq = function() {
    this.v = AA.C4;
    this.C9();
};
U.prototype.Fv = function() {
    this.v = AA.C6;
};
U.prototype.C9 = function() {
    this.AV = [];
    this.Q = [];
    this.AE = [];
    this.A_ = [];
    this.Cs = false;
};
U.prototype.Dh = function() {
    this.EA = "";
    this.EC = "";
    this.Cp = new CO(0, 0, 8000);
    this.Cb = new CO(0, 0, 90000);
    this.sync = false;
};
U.prototype.Da = function() {
    this.Au = {
        Ey: 0,
        Et: 0,
        Er: 0,
        Ei: 0,
        Ce: 0,
        Ej: 0
    };
};
U.prototype.Fz = function(event) {
    if (this.v == AA.C8 || this.v == AA.C4) {
        return;
    }
    var P = new DataView(event.data);
    var stripBytes = 1;
    var Cf = P.getUint8(0);
    var CR = Cf >> 2 & 3;
    var BU = Cf >> 1 & 1;
    var _ = Cf & 1;
    if (CR == 1) {
        this.FG(P, _, BU);
    } else if (CR == 2) {
        this.Fm(P, _, BU);
    } else if (CR == 3) {
        this.FO(this.stripBytes(new Uint8Array(event.data), stripBytes));
    } else {
        K.warn("Unknown binary data received, type " + CR);
    }
    if (this.v == AA.C6) {
        if (this.videoFaststart) {
            this.v = AA.Ch;
            self.postMessage({
                message: "avail"
            });
            this.videoFaststart = false;
        } else if (this.sync) {
            if (this.CJ() >= this.audioBufferWaitFor && this.Ak() >= this.videoBufferWaitFor && this.AE.length > 0) {
                this.v = AA.Ch;
                self.postMessage({
                    message: "avail"
                });
            }
        } else if (this.Ak() >= this.videoBufferWaitFor) {
            this.v = AA.Ch;
            self.postMessage({
                message: "avail"
            });
        }
    } else {
        if (this.sync) {
            if (this.Ak() > this.videoBufferWaitFor * this.dropDelayMultiplier) {
                this.FA();
            }
        } else {
            if (this.CJ() > this.audioBufferWaitFor * this.dropDelayMultiplier) {
                K.debug("Trying to drop data, audio buffer " + this.CJ());
                this.FA();
            } else if (this.Ak() > this.videoBufferWaitFor * this.dropDelayMultiplier) {
                K.debug("Trying to drop data, video buffer " + this.Ak());
                this.E$();
            }
        }
    }
};
U.prototype.FG = function(P, _, BU) {
    this.Au.Et += P.byteLength;
    var stripBytes = 1;
    if (BU) {
        this.EC = P.getUint32(stripBytes);
        stripBytes += 4;
    }
    var O = 0;
    if (_) {
        O = P.getUint32(stripBytes);
        stripBytes += 4;
    }
    K.trace("Incoming video packet ts " + O);
    var Cn = this.Q[this.Q.length - 1];
    var frame;
    var payload = this.stripBytes(new Uint8Array(P.buffer), stripBytes);
    var complete = (payload[2] >> 3 & 1) == 1;
    if (Cn == undefined || Cn.AL() != O) {
        var Bh = (payload[2] & 7) == 1;
        var FB = (payload[2] >> 4 & 1) == 1;
        if (!FB) {
            K.trace("Drop frame, not a beginning, ts " + O);
            return;
        }
        frame = new Bu(payload, O, Bh, complete);
        if (!this.Cs && frame.Co()) {
            this.Cs = true;
        } else if (!this.Cs) {
            return;
        }
        K.trace("Created frame " + O + " iskframe " + Bh + " complete " + complete);
        this.Q.push(frame);
    } else {
        frame = Cn;
        frame.E_(payload, complete);
        K.trace("Add payload to frame " + O + " complete " + complete);
    }
    if (complete) {
        K.trace("Feed decoder with video frame " + frame.AL());
        this.Au.Er++;
        this.D2();
    }
};
U.prototype.Fm = function(P, _, BU) {
    this.Au.Ey += P.byteLength;
    var stripBytes = 1;
    var AJ = {};
    var O;
    if (BU) {
        this.EA = P.getUint32(stripBytes);
        stripBytes += 4;
    }
    if (_) {
        O = P.getUint32(stripBytes);
        stripBytes += 4;
    }
    AJ._ = O;
    AJ.data = this.E8(this.stripBytes(new Uint8Array(P.buffer), stripBytes));
    this.AV.push(AJ);
};
U.prototype.FO = function(data) {
    var P = new DataView(data.buffer);
    var CS;
    var Ao = 0;
    if (this.EA == P.getInt32(0)) {
        K.debug("Received audio rtcp update");
        CS = P.getUint32(8) * 1000 + this.D7(P.getUint32(12));
        Ao = this.Cp.D9(CS, P.getUint32(4));
        if (Ao > 50 || Ao < -50) {
            K.warn("Audio sync changed " + Ao);
        }
    } else if (this.EC == P.getInt32(0)) {
        K.debug("Received video rtcp update");
        CS = P.getUint32(8) * 1000 + this.D7(P.getUint32(12));
        Ao = this.Cb.D9(CS, P.getUint32(4));
        if (Ao > 50 || Ao < -50) {
            K.warn("Video sync changed " + Ao);
        }
    } else {
        K.warn("Received rtcp with unknown ssrc " + P.getInt32(0));
    }
    if (this.Cp.getTime(1) != 0 && this.Cb.getTime(1) != 0) {
        this.sync = true;
    }
};
U.prototype.D2 = function() {
    if (this.Ak() < 0) {
        while (this.Ak() < 0 && this.AE.length != 0) {
            K.debug("Drop decoded video frame");
            this.AE.shift();
            this.Au.Ce++;
        }
    }
    var frame = this.Q[0];
    if (frame != undefined && frame.Bg() && this.A_.length + this.AE.length <= 5) {
        frame = this.Q.shift();
        this.A_.push(frame.AL());
        var AB = Date.now();
        while (frame.payload.length != 0) {
            this.Ca.DA(frame.payload.shift());
            this.Au.Ej++;
        }
        AB = Date.now() - AB;
        if (AB > 25) {
            K.warn("Frame decoding took " + AB);
        }
    }
};
U.prototype.Ex = function(E7) {
    var AJ = {};
    AJ._ = this.A_.shift();
    if (AJ._ == undefined) {
        K.warn("No timestamp available for decoded picture, discarding");
        return;
    }
    K.trace("Decoded frame with ts " + AJ._);
    AJ.data = E7.data;
    AJ.width = E7.width;
    AJ.height = E7.height;
    AJ.type = E7.type;
    this.AE.push(AJ);
    this.Au.Ei++;
};
U.prototype.Ak = function() {
    var Ax;
    var BO;
    if (this.AE.length != 0) {
        Ax = this.AE[0]._;
        BO = this.AE[this.AE.length - 1]._;
    }
    if (this.A_.length != 0 && Ax == undefined) {
        Ax = this.A_[0];
    }
    if (this.Q.length != 0) {
        if (Ax == undefined) {
            Ax = this.Q[this.Q.length - 1].AL();
        }
        BO = this.Q[this.Q.length - 1].AL();
    } else if (this.A_.length != 0) {
        BO = this.A_[0];
    }
    if (BO != undefined && Ax != undefined && BO != Ax) {
        return this.E6(BO - Ax, 90000);
    }
    return 0;
};
U.prototype.CJ = function() {
    return this.AV.length * 20;
};
U.prototype.E8 = function(payload) {
    if (this.EG == undefined) {
        this.EG = new Aq;
    }
    var D$ = this.EG.E9(payload);
    var BK = new Float32Array(D$.byteLength / 2);
    var FC = new DataView(D$.buffer);
    for (var i = 0; i < BK.length; i++) {
        BK[i] = FC.getInt16(i * 2, true) / 32768;
    }
    var Dy = this.A$.A$(BK, [BK.buffer]);
    var FJ = this.A$.outputBuffer.subarray(0, Dy);
    var FF = new ArrayBuffer(Dy * 4);
    var k = new Float32Array(FF);
    k.set(FJ);
    return k;
};
U.prototype.stripBytes = function(data, length) {
    var k = new Uint8Array(data.byteLength - length);
    for (var i = 0; i < k.byteLength; i++, length++) {
        k[i] = data[length];
    }
    return k;
};
U.prototype.D7 = function(FM) {
    return FM * 1000 / 4294967296;
};
U.prototype.E6 = function(O, FL) {
    return O / FL * 1000;
};
U.prototype.BI = function(FN, O) {
    if (FN) {
        return this.Cp.getTime(O);
    } else {
        return this.Cb.getTime(O);
    }
};
U.prototype.Ev = function(Bz) {
    if (this.v == AA.C4) {
        return;
    }
    var data = {};
    var z = 5;
    data.audio = this.FK(z - Bz.audioBuffSize);
    data.video = this.FH(z - Bz.videoBuffSize);
    if (this.flushIndicator) {
        this.flushIndicator = false;
        data.flushIndicator = true;
    } else {
        if (data.audio.length == 0 && z - Bz.audioBuffSize > 0 && this.AV.length == 0) {
            data.noAudioDataAvailableIndicator = true;
        }
        if (data.video.length == 0 && z - Bz.videoBuffSize > 0 && this.Q.length == 0) {
            data.noVideoDataAvailableIndicator = true;
        }
    }
    K.trace("giving away frames " + data.video.length + " in buffer " + this.AE.length + " incoming buffer " + this.Q.length + " player buffer " + Bz.videoBuffSize);
    return data;
};
U.prototype.FK = function(z) {
    var data = [];
    while (z > 0) {
        if ((this.AV.length * 20 - 20) / 1000 * this.audioContextSampleRate > this.audioChunkLength) {
            var CN = new B1(this.audioChunkLength, this.audioContextSampleRate);
            var DQ = undefined;
            while (!CN.Bg() && this.AV.length > 0) {
                DQ = CN.E5(this.AV.shift());
            }
            if (DQ) {
                this.AV.unshift(DQ);
            }
            var FD = {
                payload: CN.E4(),
                sync: this.BI(true, CN.AL())
            };
            data.push(FD);
            z--;
        } else {
            break;
        }
    }
    return data;
};
U.prototype.FH = function(z) {
    var data = [];
    while (z > 0) {
        if (z - this.AE.length > 0 && this.Q.length > 0) {
            this.D2();
        }
        if (this.AE.length > 0) {
            var AJ = this.AE.shift();
            var DL = {};
            DL.payload = AJ.data;
            DL.sync = this.BI(false, AJ._);
            DL.width = AJ.width;
            DL.height = AJ.height;
            DL.type = AJ.type;
            data.push(DL);
            z--;
        } else {
            break;
        }
    }
    return data;
};
U.prototype.FA = function() {
    var Di = this.Ak();
    var DI = this.CJ();
    K.debug("Dropping data, video ms " + Di + " audio ms " + DI);
    if (Di <= 0) {
        K.debug("No video, return");
        return;
    }
    if (DI <= 20) {
        K.debug("No audio, return");
        return;
    }
    if (this.Q.length > 1) {
        var i = this.Q.length - 1;
        var Es = this.BI(true, this.AV[0]._);
        var FUs = this.BI(false, this.Q[i].AL());
        while (i >= 0) {
            if (this.Q[i].Bg() && this.Q[i].Co()) {
                K.debug("Found K-Frame, ts " + this.Q[i].AL());
                var DE = this.BI(false, this.Q[i].AL());
                if (FUs - DE >= this.videoBufferWaitFor) {
                    var AN = DE - Es;
                    var DC = -(this.Q.length - i);
                    K.debug("slicePos " + DC + " i " + i);
                    K.debug("Audio offset " + AN);
                    if (AN > 0) {
                        var TMf = DI - AN;
                        if (TMf >= this.audioBufferWaitFor) {
                            this.flushIndicator = true;
                            K.log("Dropping " + AN + "ms from buffers");
                            this.Au.Ce += i;
                            this.Q = this.Q.slice(DC);
                            if (this.AE.length > 0) {
                                this.Au.Ce += this.AE.length;
                                this.AE = [];
                            }
                            if (AN < 1) {
                                break;
                            }
                            while (this.AV.length > 0) {
                                this.AV.shift();
                                AN -= 20;
                                if (AN <= 0) {
                                    break;
                                }
                            }
                            break;
                        }
                    } else {
                        var KJr = this.audioChunkLength / this.audioContextSampleRate * 1000 * 5;
                        K.debug("playerAudioBufferEstimate " + KJr);
                        if (AN + KJr < 0) {
                            this.Au.Ce += i;
                            this.Q = this.Q.slice(DC);
                            if (this.AE.length > 0) {
                                this.Au.Ce += this.AE.length;
                                this.AE = [];
                                this.A_ = [];
                            }
                            K.log("Dropping " + i + " video frames from buffer");
                            break;
                        }
                    }
                }
            }
            i--;
        }
    } else {
        K.warn("Unable to drop delay from buffers!");
    }
};
U.prototype.E$ = function() {
    if (this.Q.length > 1) {
        var Ep = this.BI(false, this.Q[0].AL());
        var i = this.Q.length - 1;
        while (i >= 0) {
            if (this.Q[i].Bg() && this.Q[i].Co()) {
                K.debug("Found K-Frame, ts " + this.Q[i].AL());
                var DE = this.BI(false, this.Q[i].AL());
                var droppingMs = Math.round(DE - Ep);
                K.debug("Going to drop stream ms " + droppingMs);
                if (this.Ak() - droppingMs < this.videoBufferWaitFor) {
                    K.debug("Skip drop point, to much video to drop");
                    i--;
                    continue;
                }
                K.log("Dropping " + droppingMs + "ms from buffers");
                this.flushIndicator = true;
                this.Au.Ce += i;
                var DC = -(this.Q.length - i);
                this.Q = this.Q.slice(DC);
                break;
            }
            i--;
        }
    } else {
        K.warn("Unable to drop delay from video buffer!");
    }
};
var AA = function() {};
AA.C8 = "STOPPED";
AA.Ch = "PLAYING";
AA.C4 = "PAUSED";
AA.C6 = "STARTUP";
var VideoDecoder = function(callback, outputFormat) {
    this.DP = new F({
        En: callback,
        outputFormat: outputFormat
    });
};
VideoDecoder.prototype.C$ = function(width, height) {
    this.DP.C$(width, height);
};
VideoDecoder.prototype.DA = function(data) {
    this.DP.DA(data.buffer);
};
VideoDecoder.prototype.stop = function() {
    this.DP.stop();
};

function C0(url, DW) {
    this.url = url;
    this.Ae = undefined;
    this.DW = DW;
    this.send = function(A3) {
        this.Ae.send(JSON.stringify(A3));
    };
}
C0.prototype.connect = function(token) {
    if (this.Ae == undefined) {
        this.Ae = new WebSocket(this.url);
        this.Ae.binaryType = "arraybuffer";
        var DV = this;
        this.Ae.onopen = function(event) {
            var A3 = {};
            A3.message = "connectMediaTransport";
            A3.data = [{
                authToken: token
            }];
            DV.send(A3);
        };
        this.Ae.onmessage = function(event) {
            if (event.data instanceof ArrayBuffer) {
                DV.DW(event);
            } else {
                var A3 = JSON.parse(event.data);
                switch (A3.message) {
                    case "ping":
                        var D1 = {};
                        D1.message = "pong";
                        DV.send(D1);
                        break;
                    default:
                        ;
                }
            }
        };
        this.Ae.onerror = function(error) {
            K.error("Got ws error!");
            self.postMessage({
                message: "failed"
            });
        };
        this.Ae.onclose = function(event) {
            K.debug("Websocket media transport closed");
        };
    }
};
C0.prototype.close = function() {
    this.Ae.close();
};

function Bu(payload, O, Bh, complete) {
    this.payload = [];
    this.payload.push(payload);
    this.O = O;
    this.Bh = Bh;
    this.complete = complete;
}
Bu.prototype.E_ = function(payload, complete) {
    this.payload.push(payload);
    this.complete = complete;
};
Bu.prototype.Bg = function() {
    return this.complete;
};
Bu.prototype.AL = function() {
    return this.O;
};
Bu.prototype.Co = function() {
    return this.Bh;
};

function B1(z, Cg) {
    this.payload = [];
    this.O = 0;
    this.size = 0;
    this.z = z;
    this.Cg = Cg;
}
B1.prototype.E5 = function(A7) {
    if (this.size + A7.data.length <= this.z) {
        if (this.O == 0) {
            this.O = A7._;
        }
        this.payload.push(A7.data);
        this.size += A7.data.length;
    } else {
        var B8 = this.z - this.size;
        this.payload.push(A7.data.subarray(0, B8));
        this.size += B8;
        var A6 = {};
        A6._ = B8 / this.Cg * Ew + A7._;
        A6.data = A7.data.subarray(B8);
        return A6;
    }
};
B1.prototype.E4 = function() {
    if (this.Bg()) {
        var buffer = new Float32Array(this.size);
        var Dd = 0;
        var data;
        while (this.payload.length > 0) {
            data = this.payload.shift();
            buffer.set(data, Dd);
            Dd += data.length;
        }
        return buffer;
    }
};
B1.prototype.AL = function() {
    return this.O;
};
B1.prototype.Bg = function() {
    return this.z == this.size;
};

function CO(AB, O, DR) {
    this.AB = AB;
    this.O = O;
    this.DR = DR;
}
CO.prototype.D9 = function(AB, O) {
    var Ds = this.getTime(O);
    this.AB = AB;
    this.O = O;
    if (this.AB == 0 || Ds == 0) {
        return 0;
    }
    return Ds - AB;
};
CO.prototype.getTime = function(O) {
    if (this.AB == 0 && this.O == 0) {
        return 0;
    }
    return (O - this.O) * 1000 / this.DR + this.AB;
};
var Aq = function() {
    this.Eu = 128;
    this.DU = 132;
    this.E1 = 4;
    this.E0 = 15;
    this.E2 = 112;
};
Aq.prototype.E9 = function(data) {
    var payload = data;
    var k = new Uint8Array(data.length * 2);
    var index;
    for (index = 0; index < payload.length; ++index) {
        var Bn = this.Ez(payload[index]);
        var Du = index << 1;
        k[Du] = Bn & 255;
        k[++Du] = (Bn & 65280) >>> 8;
    }
    return k;
};
Aq.prototype.Ez = function(data) {
    var AW;
    data = ~data;
    AW = ((data & this.E0) << 3) + this.DU;
    AW <<= (data & this.E2) >> this.E1;
    return (data & this.Eu) != 0 ? this.DU - AW : AW - this.DU;
};
Aq.prototype.Ga = function() {
    return this.Dt("524946466406000057415645666d74201000000001000100401f0000803e0000020010006461746140060000");
};
Aq.prototype.GX = function(BC) {
    var P = new DataView(this.Dt(BC).buffer);
    var index = 0;
    K.log("RIFF " + P.getInt32(index));
    index += 4;
    K.log("Chunk size:" + P.getInt32(index, true));
    index += 4;
    K.log("Format:" + P.getInt32(index));
    index += 4;
    K.log("Subchunk id:" + P.getInt32(index));
    index += 4;
    K.log("Subchunk size:" + P.getInt32(index, true));
    index += 4;
    K.log("AudioFormat:" + P.getInt16(index, true));
    index += 2;
    K.log("NumChannels:" + P.getUint16(index, true));
    index += 2;
    K.log("Sample rate:" + P.getInt32(index, true));
    index += 4;
    K.log("Byte rate:" + P.getInt32(index, true));
};
Aq.prototype.Dt = function(BC) {
    var k = [];
    for (var i = 0; i < BC.length; i += 2) {
        k.push(parseInt("0x" + BC.substr(i, 2), 16));
    }
    return new Uint8Array(k);
};
Aq.prototype.E3 = function(At) {
    var D4 = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
    return D4[At >> 4 & 15] + D4[At & 15];
};
Aq.prototype.GZ = function(data) {
    var BC = "";
    var DK = "";
    for (var i = 0; i < data.byteLength; i++) {
        var Bn = this.E3(data[i]);
        BC += Bn;
        DK += Bn;
        if (i % 32 == 0) {
            DK += "\n";
        }
    }
    K.log(BC);
    K.log(DK);
};

function Resampler(BM, BH, m, outputBufferSize, noReturn) {
    this.BM = BM;
    this.BH = 1;//BH;
    this.m = m | 0;
    this.outputBufferSize = outputBufferSize;
    this.noReturn = !!noReturn;
    this.initialize();
}
Resampler.prototype.initialize = function() {
    if (this.BM > 0 && this.BH > 0 && this.m > 0) {
        if (this.BM == this.BH) {
            this.A$ = this.FP;
            this.ratioWeight = 1;
        } else {
            this.ratioWeight = this.BM / this.BH;
            if (this.BM < this.BH) {
                this.Fa();
                this.lastWeight = 1;
            } else {
                this.Fy();
                this.GQ = false;
                this.lastWeight = 0;
            }
            this.Fx();
        }
    } else {
        throw new Error("Invalid settings specified for the resampler.");
    }
};
Resampler.prototype.Fa = function() {
    var h = "var bufferLength = buffer.length;\tvar outLength = this.outputBufferSize;\tif ((bufferLength % " + this.m + ") == 0) {\t\tif (bufferLength > 0) {\t\t\tvar weight = this.lastWeight;\t\t\tvar firstWeight = 0;\t\t\tvar secondWeight = 0;\t\t\tvar sourceOffset = 0;\t\t\tvar outputOffset = 0;\t\t\tvar outputBuffer = this.outputBuffer;\t\t\tfor (; weight < 1; weight += " + this.ratioWeight + ") {\t\t\t\tsecondWeight = weight % 1;\t\t\t\tfirstWeight = 1 - secondWeight;";
    for (var J = 0; J < this.m; ++J) {
        h += "outputBuffer[outputOffset++] = (this.lastOutput[" + J + "] * firstWeight) + (buffer[" + J + "] * secondWeight);";
    }
    h += "}\t\t\tweight -= 1;\t\t\tfor (bufferLength -= " + this.m + ", sourceOffset = Math.floor(weight) * " + this.m + "; outputOffset < outLength && sourceOffset < bufferLength;) {\t\t\t\tsecondWeight = weight % 1;\t\t\t\tfirstWeight = 1 - secondWeight;";
    for (var J = 0; J < this.m; ++J) {
        h += "outputBuffer[outputOffset++] = (buffer[sourceOffset" + (J > 0 ? " + " + J : "") + "] * firstWeight) + (buffer[sourceOffset + " + (this.m + J) + "] * secondWeight);";
    }
    h += "weight += " + this.ratioWeight + ";\t\t\t\tsourceOffset = Math.floor(weight) * " + this.m + ";\t\t\t}";
    for (var J = 0; J < this.m; ++J) {
        h += "this.lastOutput[" + J + "] = buffer[sourceOffset++];";
    }
    h += "this.lastWeight = weight % 1;\t\t\treturn this.bufferSlice(outputOffset);\t\t}\t\telse {\t\t\treturn (this.noReturn) ? 0 : [];\t\t}\t}\telse {\t\tthrow(new Error(\"Buffer was of incorrect sample length.\"));\t}";
    this.A$ = Function("buffer", h);
};
Resampler.prototype.Fy = function() {
    var h = "var bufferLength = buffer.length;\tvar outLength = this.outputBufferSize;\tif ((bufferLength % " + this.m + ") == 0) {\t\tif (bufferLength > 0) {\t\t\tvar weight = 0;";
    for (var J = 0; J < this.m; ++J) {
        h += "var output" + J + " = 0;";
    }
    h += "var actualPosition = 0;\t\t\tvar amountToNext = 0;\t\t\tvar alreadyProcessedTail = !this.tailExists;\t\t\tthis.tailExists = false;\t\t\tvar outputBuffer = this.outputBuffer;\t\t\tvar outputOffset = 0;\t\t\tvar currentPosition = 0;\t\t\tdo {\t\t\t\tif (alreadyProcessedTail) {\t\t\t\t\tweight = " + this.ratioWeight + ";";
    for (J = 0; J < this.m; ++J) {
        h += "output" + J + " = 0;";
    }
    h += "}\t\t\t\telse {\t\t\t\t\tweight = this.lastWeight;";
    for (J = 0; J < this.m; ++J) {
        h += "output" + J + " = this.lastOutput[" + J + "];";
    }
    h += "alreadyProcessedTail = true;\t\t\t\t}\t\t\t\twhile (weight > 0 && actualPosition < bufferLength) {\t\t\t\t\tamountToNext = 1 + actualPosition - currentPosition;\t\t\t\t\tif (weight >= amountToNext) {";
    for (J = 0; J < this.m; ++J) {
        h += "output" + J + " += buffer[actualPosition++] * amountToNext;";
    }
    h += "currentPosition = actualPosition;\t\t\t\t\t\tweight -= amountToNext;\t\t\t\t\t}\t\t\t\t\telse {";
    for (J = 0; J < this.m; ++J) {
        h += "output" + J + " += buffer[actualPosition" + (J > 0 ? " + " + J : "") + "] * weight;";
    }
    h += "currentPosition += weight;\t\t\t\t\t\tweight = 0;\t\t\t\t\t\tbreak;\t\t\t\t\t}\t\t\t\t}\t\t\t\tif (weight <= 0) {";
    for (J = 0; J < this.m; ++J) {
        h += "outputBuffer[outputOffset++] = output" + J + " / " + this.ratioWeight + ";";
    }
    h += "}\t\t\t\telse {\t\t\t\t\tthis.lastWeight = weight;";
    for (J = 0; J < this.m; ++J) {
        h += "this.lastOutput[" + J + "] = output" + J + ";";
    }
    h += "this.tailExists = true;\t\t\t\t\tbreak;\t\t\t\t}\t\t\t} while (actualPosition < bufferLength && outputOffset < outLength);\t\t\treturn this.bufferSlice(outputOffset);\t\t}\t\telse {\t\t\treturn (this.noReturn) ? 0 : [];\t\t}\t}\telse {\t\tthrow(new Error(\"Buffer was of incorrect sample length.\"));\t}";
    this.A$ = Function("buffer", h);
};
Resampler.prototype.FP = function(buffer) {
    if (this.noReturn) {
        this.outputBuffer = buffer;
        return buffer.length;
    } else {
        return buffer;
    }
};
Resampler.prototype.bufferSlice = function(sliceAmount) {
    if (this.noReturn) {
        return sliceAmount;
    } else {
        try {
            return this.outputBuffer.subarray(0, sliceAmount);
        } catch (error) {
            try {
                this.outputBuffer.length = sliceAmount;
                return this.outputBuffer;
            } catch (error) {
                return this.outputBuffer.slice(0, sliceAmount);
            }
        }
    }
};
Resampler.prototype.Fx = function() {
    try {
        this.outputBuffer = new Float32Array(this.outputBufferSize);
        this.lastOutput = new Float32Array(this.m);
    } catch (error) {
        this.outputBuffer = [];
        this.lastOutput = [];
    }
};
var F = function(CG) {
    CG = CG || {};
    this.outputFormat = CG.outputFormat || "rgba";
    this.DH = CG.En || null;
    this.C = new Int32Array(64);
    this.DS = new Int32Array(64);
    this.D5(this.DS, 0);
};
F.prototype.Dv = true;
F.prototype.EB = 524288;
F.prototype.C$ = function(width, height) {
    this.buffer = new BitReader(new ArrayBuffer(this.EB));
    this.CB = new BitReader(new ArrayBuffer(this.EB));
    this.CB.AF = 0;
    this.CB.A5 = 0;
    this.CB.C5 = 0;
    this.width = parseInt(width);
    this.height = parseInt(height);
};
F.prototype.DA = function(data) {
    var Br = new Uint8Array(data);
    Br = Br.subarray(4);
    if (!this.D_) {
        this.Ft();
    }
    var current = this.buffer;
    var next = this.CB;
    if (next.AF + Br.length > next.length) {
        next.C5 = next.AF;
        next.AF = 0;
        next.index = 0;
    }
    next.l.set(Br, next.AF);
    next.AF += Br.length;
    var Cj = 0;
    while (true) {
        Cj = next.CE();
        if (Cj == BitReader.Cl || next.index >> 3 > next.AF) {
            next.index = Math.max(next.AF - 3, 0) << 3;
            return;
        } else if (Cj == Fn) {
            break;
        } else if (Cj == F6) {
            var width = next.u(12);
            var height = next.u(12);
            if (this.width != width || this.height != height) {
                this.width = width;
                this.height = height;
                this.D_ = false;
                this.Ft();
            }
        }
    }
    if (this.Dv) {
        next.CH(10);
        if (next.u(3) == Dx) {
            this.Dv = false;
            next.A5 = next.index - 13 >> 3;
        }
        return;
    }
    if (!this.Fp) {
        this.D0();
    }
    var Bj = next.index >> 3;
    if (Bj > next.A5) {
        current.l.set(next.l.subarray(next.A5, Bj));
        current.AF = Bj - next.A5;
    } else {
        current.l.set(next.l.subarray(next.A5, next.C5));
        var D3 = next.C5 - next.A5;
        current.l.set(next.l.subarray(0, Bj), D3);
        current.AF = Bj + D3;
    }
    current.index = 0;
    next.A5 = Bj;
    this.Fp = false;
    this.D0();
};
F.prototype.stop = function() {
    if (this.buffer) {
        this.buffer.index = this.Fo;
    }
};
F.prototype.AZ = function(Ck) {
    var v = 0;
    do {
        v = Ck[v + this.buffer.u(1)];
    } while (v >= 0 && Ck[v] != 0);
    return Ck[v + 2];
};
F.prototype.GM = function(o) {
    var current = 0;
    while (true) {
        current = this.buffer.CE();
        if (current == o || current == BitReader.Cl) {
            return current;
        }
    }
};
F.prototype.D5 = function(EE, value) {
    for (var i = 0, length = EE.length; i < length; i++) {
        EE[i] = value;
    }
};
F.prototype.GG = 30;
F.prototype.GC = 0;
F.prototype.Fo = 0;
F.prototype.GD = 0;
F.prototype.GE = false;
F.prototype.GF = 0;
F.prototype.GH = 0;
F.prototype.GL = 0;
F.prototype.now = function() {
    return Date.now();
};
F.prototype.Ft = function() {
    this.Fl = FR;
    this.FY = FX;
    this.A2 = this.width + 15 >> 4;
    this.Cr = this.height + 15 >> 4;
    this.FZ = this.A2 * this.Cr;
    this.AY = this.A2 << 4;
    this.FW = this.Cr << 4;
    this.BB = this.AY * this.FW;
    this.Dq = this.A2 << 3;
    this.GI = this.Cr << 3;
    this.GJ = this.BB >> 2;
    if (this.D_) {
        return;
    }
    this.D_ = true;
    var MaybeClampedUint8Array;
    if (typeof Uint8ClampedArray !== "undefined") {
        MaybeClampedUint8Array = Uint8ClampedArray;
    } else {
        MaybeClampedUint8Array = Uint8Array;
    }
    if (typeof Uint8ClampedArray == "undefined") {
        this.DX = this.FU;
        this.Dg = this.FT;
    }
    this.BE = new MaybeClampedUint8Array(this.BB);
    this.C_ = new Uint32Array(this.BE.buffer);
    this.BG = new MaybeClampedUint8Array(this.BB >> 2);
    this.C2 = new Uint32Array(this.BG.buffer);
    this.BD = new MaybeClampedUint8Array(this.BB >> 2);
    this.Cw = new Uint32Array(this.BD.buffer);
    this.BY = new MaybeClampedUint8Array(this.BB);
    this.Dn = new Uint32Array(this.BY.buffer);
    this.BW = new MaybeClampedUint8Array(this.BB >> 2);
    this.Dl = new Uint32Array(this.BW.buffer);
    this.Ba = new MaybeClampedUint8Array(this.BB >> 2);
    this.Db = new Uint32Array(this.Ba.buffer);
    this.Bs = new MaybeClampedUint8Array(this.width * this.height * 4);
    this.D5(this.Bs, 255);
};
F.prototype.BE = null;
F.prototype.BG = null;
F.prototype.BD = null;
F.prototype.Bs = null;
F.prototype.Ag = 0;
F.prototype.BY = null;
F.prototype.BW = null;
F.prototype.Ba = null;
F.prototype.Cu = false;
F.prototype.Cv = 0;
F.prototype.BZ = 0;
F.prototype.AO = 0;
F.prototype.D0 = function(GK) {
    this.buffer.CH(10);
    this.Ag = this.buffer.u(3);
    this.buffer.CH(16);
    if (this.Ag <= 0 || this.Ag >= FV) {
        return;
    }
    if (this.Ag == B5) {
        this.Cu = this.buffer.u(1);
        this.Cv = this.buffer.u(3);
        if (this.Cv == 0) {
            return;
        }
        this.BZ = this.Cv - 1;
        this.AO = 1 << this.BZ;
    }
    var o = 0;
    do {
        o = this.buffer.CE();
    } while (o == Fb || o == Fg);
    while (o >= Fc && o <= Fj) {
        this.Fi(o & 255);
        o = this.buffer.CE();
    }
    this.buffer.Fk(32);
    if (this.DH) {
        var k = {};
        if (this.outputFormat == "yuv") {
            k.data = {};
            var yBuffer, crBuffer, cbBuffer;
            yBuffer = new ArrayBuffer(this.BE.length);
            crBuffer = new ArrayBuffer(this.BG.length);
            cbBuffer = new ArrayBuffer(this.BD.length);
            k.data.y = new Uint8Array(yBuffer);
            k.data.y.set(this.BE);
            k.data.cr = new Uint8Array(crBuffer);
            k.data.cr.set(this.BG);
            k.data.cb = new Uint8Array(cbBuffer);
            k.data.cb.set(this.BD);
            k.width = this.width;
            k.height = this.height;
            k.type = "yuv";
        } else {
            this.Ef();
            var BK = new ArrayBuffer(this.Bs.length);
            k.data = new Uint8Array(BK);
            k.data.set(this.Bs);
            k.width = this.width;
            k.height = this.height;
            k.type = "rgba";
        }
        this.DH(k);
    }
    if (this.Ag == Dx || this.Ag == B5) {
        var Fh = this.BY,
            Ff = this.Dn,
            Fe = this.BW,
            Fd = this.Dl,
            Eh = this.Ba,
            El = this.Db;
        this.BY = this.BE;
        this.Dn = this.C_;
        this.BW = this.BG;
        this.Dl = this.C2;
        this.Ba = this.BD;
        this.Db = this.Cw;
        this.BE = Fh;
        this.C_ = Ff;
        this.BG = Fe;
        this.C2 = Fd;
        this.BD = Eh;
        this.Cw = El;
    }
};
F.prototype.Ef = function() {
    var CI = this.BE;
    var Ea = this.BD;
    var EI = this.BG;
    var AK = this.Bs;
    var Cz = 0;
    var Cy = this.AY;
    var Df = this.AY + (this.AY - this.width);
    var B6 = 0;
    var EL = this.Dq - (this.width >> 1);
    var A0 = 0;
    var A1 = this.width * 4;
    var Dj = this.width * 4;
    var EP = this.width >> 1;
    var rows = this.height >> 1;
    var y, cb, cr, AR, Bq, At;
    for (var DY = 0; DY < rows; DY++) {
        for (var Dc = 0; Dc < EP; Dc++) {
            cb = Ea[B6];
            cr = EI[B6];
            B6++;
            AR = cr + (cr * 103 >> 8) - 179;
            Bq = (cb * 88 >> 8) - 44 + (cr * 183 >> 8) - 91;
            At = cb + (cb * 198 >> 8) - 227;
            var s = CI[Cz++];
            var $ = CI[Cz++];
            AK[A0] = s + AR;
            AK[A0 + 1] = s - Bq;
            AK[A0 + 2] = s + At;
            AK[A0 + 4] = $ + AR;
            AK[A0 + 5] = $ - Bq;
            AK[A0 + 6] = $ + At;
            A0 += 8;
            var AX = CI[Cy++];
            var AT = CI[Cy++];
            AK[A1] = AX + AR;
            AK[A1 + 1] = AX - Bq;
            AK[A1 + 2] = AX + At;
            AK[A1 + 4] = AT + AR;
            AK[A1 + 5] = AT - Bq;
            AK[A1 + 6] = AT + At;
            A1 += 8;
        }
        Cz += Df;
        Cy += Df;
        A0 += Dj;
        A1 += Dj;
        B6 += EL;
    }
};
F.prototype.Fs = function() {
    this.Ef();
};
F.prototype.C1 = 0;
F.prototype.Cq = false;
F.prototype.Fi = function(slice) {
    this.Cq = true;
    this.Ac = (slice - 1) * this.A2 - 1;
    this.Aw = this.AS = 0;
    this.Ay = this.AQ = 0;
    this.Bw = 128;
    this.By = 128;
    this.Bx = 128;
    this.C1 = this.buffer.u(5);
    while (this.buffer.u(1)) {
        this.buffer.CH(8);
    }
    do {
        this.Eb();
    } while (!this.buffer.Ed());
};
F.prototype.Ac = 0;
F.prototype.Aj = 0;
F.prototype.Az = 0;
F.prototype.Bm = 0;
F.prototype.BL = false;
F.prototype.D8 = false;
F.prototype.Aw = 0;
F.prototype.Ay = 0;
F.prototype.AS = 0;
F.prototype.AQ = 0;
F.prototype.Eb = function() {
    var BA = 0,
        AW = this.AZ(DG);
    while (AW == 34) {
        AW = this.AZ(DG);
    }
    while (AW == 35) {
        BA += 33;
        AW = this.AZ(DG);
    }
    BA += AW;
    if (this.Cq) {
        this.Cq = false;
        this.Ac += BA;
    } else {
        if (this.Ac + BA >= this.FZ) {
            return;
        }
        if (BA > 1) {
            this.Bw = 128;
            this.By = 128;
            this.Bx = 128;
            if (this.Ag == B5) {
                this.Aw = this.AS = 0;
                this.Ay = this.AQ = 0;
            }
        }
        while (BA > 1) {
            this.Ac++;
            this.Aj = this.Ac / this.A2 | 0;
            this.Az = this.Ac % this.A2;
            this.Dz(this.Aw, this.Ay, this.BY, this.BW, this.Ba);
            BA--;
        }
        this.Ac++;
    }
    this.Aj = this.Ac / this.A2 | 0;
    this.Az = this.Ac % this.A2;
    this.Bm = this.AZ(EY[this.Ag]);
    this.BL = this.Bm & 1;
    this.D8 = this.Bm & 8;
    if ((this.Bm & 16) != 0) {
        this.C1 = this.buffer.u(5);
    }
    if (this.BL) {
        this.Aw = this.AS = 0;
        this.Ay = this.AQ = 0;
    } else {
        this.Bw = 128;
        this.By = 128;
        this.Bx = 128;
        this.EW();
        this.Dz(this.Aw, this.Ay, this.BY, this.BW, this.Ba);
    }
    var ET = (this.Bm & 2) != 0 ? this.AZ(ES) : this.BL ? 63 : 0;
    for (var AG = 0, ED = 32; AG < 6; AG++) {
        if ((ET & ED) != 0) {
            this.EV(AG);
        }
        ED >>= 1;
    }
};
F.prototype.EW = function() {
    var o, AU, AR = 0;
    if (this.D8) {
        o = this.AZ(MOTION);
        if (o != 0 && this.AO != 1) {
            AR = this.buffer.u(this.BZ);
            AU = (Math.abs(o) - 1 << this.BZ) + AR + 1;
            if (o < 0) {
                AU = -AU;
            }
        } else {
            AU = o;
        }
        this.AS += AU;
        if (this.AS > (this.AO << 4) - 1) {
            this.AS -= this.AO << 5;
        } else if (this.AS < -this.AO << 4) {
            this.AS += this.AO << 5;
        }
        this.Aw = this.AS;
        if (this.Cu) {
            this.Aw <<= 1;
        }
        o = this.AZ(MOTION);
        if (o != 0 && this.AO != 1) {
            AR = this.buffer.u(this.BZ);
            AU = (Math.abs(o) - 1 << this.BZ) + AR + 1;
            if (o < 0) {
                AU = -AU;
            }
        } else {
            AU = o;
        }
        this.AQ += AU;
        if (this.AQ > (this.AO << 4) - 1) {
            this.AQ -= this.AO << 5;
        } else if (this.AQ < -this.AO << 4) {
            this.AQ += this.AO << 5;
        }
        this.Ay = this.AQ;
        if (this.Cu) {
            this.Ay <<= 1;
        }
    } else if (this.Ag == B5) {
        this.Aw = this.AS = 0;
        this.Ay = this.AQ = 0;
    }
};
F.prototype.Dz = function(CA, B$, S, T, W) {
    var width, M, B_, CD, B7, Be, src, N, AP;
    var CW = this.C_;
    var CY = this.Cw;
    var CX = this.C2;
    width = this.AY;
    M = width - 16;
    B_ = CA >> 1;
    CD = B$ >> 1;
    B7 = (CA & 1) == 1;
    Be = (B$ & 1) == 1;
    src = ((this.Aj << 4) + CD) * width + (this.Az << 4) + B_;
    N = this.Aj * width + this.Az << 2;
    AP = N + (width << 2);
    var s, $, y;
    if (B7) {
        if (Be) {
            while (N < AP) {
                s = S[src] + S[src + width];
                src++;
                for (var x = 0; x < 4; x++) {
                    $ = S[src] + S[src + width];
                    src++;
                    y = s + $ + 2 >> 2 & 255;
                    s = S[src] + S[src + width];
                    src++;
                    y |= s + $ + 2 << 6 & 65280;
                    $ = S[src] + S[src + width];
                    src++;
                    y |= s + $ + 2 << 14 & 16711680;
                    s = S[src] + S[src + width];
                    src++;
                    y |= s + $ + 2 << 22 & 4278190080;
                    CW[N++] = y;
                }
                N += M >> 2;
                src += M - 1;
            }
        } else {
            while (N < AP) {
                s = S[src++];
                for (var x = 0; x < 4; x++) {
                    $ = S[src++];
                    y = s + $ + 1 >> 1 & 255;
                    s = S[src++];
                    y |= s + $ + 1 << 7 & 65280;
                    $ = S[src++];
                    y |= s + $ + 1 << 15 & 16711680;
                    s = S[src++];
                    y |= s + $ + 1 << 23 & 4278190080;
                    CW[N++] = y;
                }
                N += M >> 2;
                src += M - 1;
            }
        }
    } else {
        if (Be) {
            while (N < AP) {
                for (var x = 0; x < 4; x++) {
                    y = S[src] + S[src + width] + 1 >> 1 & 255;
                    src++;
                    y |= S[src] + S[src + width] + 1 << 7 & 65280;
                    src++;
                    y |= S[src] + S[src + width] + 1 << 15 & 16711680;
                    src++;
                    y |= S[src] + S[src + width] + 1 << 23 & 4278190080;
                    src++;
                    CW[N++] = y;
                }
                N += M >> 2;
                src += M;
            }
        } else {
            while (N < AP) {
                for (var x = 0; x < 4; x++) {
                    y = S[src];
                    src++;
                    y |= S[src] << 8;
                    src++;
                    y |= S[src] << 16;
                    src++;
                    y |= S[src] << 24;
                    src++;
                    CW[N++] = y;
                }
                N += M >> 2;
                src += M;
            }
        }
    }
    width = this.Dq;
    M = width - 8;
    B_ = CA / 2 >> 1;
    CD = B$ / 2 >> 1;
    B7 = (CA / 2 & 1) == 1;
    Be = (B$ / 2 & 1) == 1;
    src = ((this.Aj << 3) + CD) * width + (this.Az << 3) + B_;
    N = this.Aj * width + this.Az << 1;
    AP = N + (width << 1);
    var AD, AH, cr;
    var AC, AM, cb;
    if (B7) {
        if (Be) {
            while (N < AP) {
                AD = T[src] + T[src + width];
                AC = W[src] + W[src + width];
                src++;
                for (var x = 0; x < 2; x++) {
                    AH = T[src] + T[src + width];
                    AM = W[src] + W[src + width];
                    src++;
                    cr = AD + AH + 2 >> 2 & 255;
                    cb = AC + AM + 2 >> 2 & 255;
                    AD = T[src] + T[src + width];
                    AC = W[src] + W[src + width];
                    src++;
                    cr |= AD + AH + 2 << 6 & 65280;
                    cb |= AC + AM + 2 << 6 & 65280;
                    AH = T[src] + T[src + width];
                    AM = W[src] + W[src + width];
                    src++;
                    cr |= AD + AH + 2 << 14 & 16711680;
                    cb |= AC + AM + 2 << 14 & 16711680;
                    AD = T[src] + T[src + width];
                    AC = W[src] + W[src + width];
                    src++;
                    cr |= AD + AH + 2 << 22 & 4278190080;
                    cb |= AC + AM + 2 << 22 & 4278190080;
                    CX[N] = cr;
                    CY[N] = cb;
                    N++;
                }
                N += M >> 2;
                src += M - 1;
            }
        } else {
            while (N < AP) {
                AD = T[src];
                AC = W[src];
                src++;
                for (var x = 0; x < 2; x++) {
                    AH = T[src];
                    AM = W[src++];
                    cr = AD + AH + 1 >> 1 & 255;
                    cb = AC + AM + 1 >> 1 & 255;
                    AD = T[src];
                    AC = W[src++];
                    cr |= AD + AH + 1 << 7 & 65280;
                    cb |= AC + AM + 1 << 7 & 65280;
                    AH = T[src];
                    AM = W[src++];
                    cr |= AD + AH + 1 << 15 & 16711680;
                    cb |= AC + AM + 1 << 15 & 16711680;
                    AD = T[src];
                    AC = W[src++];
                    cr |= AD + AH + 1 << 23 & 4278190080;
                    cb |= AC + AM + 1 << 23 & 4278190080;
                    CX[N] = cr;
                    CY[N] = cb;
                    N++;
                }
                N += M >> 2;
                src += M - 1;
            }
        }
    } else {
        if (Be) {
            while (N < AP) {
                for (var x = 0; x < 2; x++) {
                    cr = T[src] + T[src + width] + 1 >> 1 & 255;
                    cb = W[src] + W[src + width] + 1 >> 1 & 255;
                    src++;
                    cr |= T[src] + T[src + width] + 1 << 7 & 65280;
                    cb |= W[src] + W[src + width] + 1 << 7 & 65280;
                    src++;
                    cr |= T[src] + T[src + width] + 1 << 15 & 16711680;
                    cb |= W[src] + W[src + width] + 1 << 15 & 16711680;
                    src++;
                    cr |= T[src] + T[src + width] + 1 << 23 & 4278190080;
                    cb |= W[src] + W[src + width] + 1 << 23 & 4278190080;
                    src++;
                    CX[N] = cr;
                    CY[N] = cb;
                    N++;
                }
                N += M >> 2;
                src += M;
            }
        } else {
            while (N < AP) {
                for (var x = 0; x < 2; x++) {
                    cr = T[src];
                    cb = W[src];
                    src++;
                    cr |= T[src] << 8;
                    cb |= W[src] << 8;
                    src++;
                    cr |= T[src] << 16;
                    cb |= W[src] << 16;
                    src++;
                    cr |= T[src] << 24;
                    cb |= W[src] << 24;
                    src++;
                    CX[N] = cr;
                    CY[N] = cb;
                    N++;
                }
                N += M >> 2;
                src += M;
            }
        }
    }
};
F.prototype.Bw;
F.prototype.By;
F.prototype.Bx;
F.prototype.C = null;
F.prototype.EV = function(AG) {
    var L = 0,
        DF;
    if (this.BL) {
        var B4, BJ;
        if (AG < 4) {
            B4 = this.Bw;
            BJ = this.AZ(Ee);
        } else {
            B4 = AG == 4 ? this.By : this.Bx;
            BJ = this.AZ(EQ);
        }
        if (BJ > 0) {
            var DM = this.buffer.u(BJ);
            if ((DM & 1 << BJ - 1) != 0) {
                this.C[0] = B4 + DM;
            } else {
                this.C[0] = B4 + (-1 << BJ | DM + 1);
            }
        } else {
            this.C[0] = B4;
        }
        if (AG < 4) {
            this.Bw = this.C[0];
        } else if (AG == 4) {
            this.By = this.C[0];
        } else {
            this.Bx = this.C[0];
        }
        this.C[0] <<= 8;
        DF = this.Fl;
        L = 1;
    } else {
        DF = this.FY;
    }
    var f = 0;
    while (true) {
        var DJ = 0,
            CV = this.AZ(EU);
        if (CV == 1 && L > 0 && this.buffer.u(1) == 0) {
            break;
        }
        if (CV == 65535) {
            DJ = this.buffer.u(6);
            f = this.buffer.u(8);
            if (f == 0) {
                f = this.buffer.u(8);
            } else if (f == 128) {
                f = this.buffer.u(8) - 256;
            } else if (f > 128) {
                f = f - 256;
            }
        } else {
            DJ = CV >> 8;
            f = CV & 255;
            if (this.buffer.u(1)) {
                f = -f;
            }
        }
        L += DJ;
        var DD = EZ[L];
        L++;
        f <<= 1;
        if (!this.BL) {
            f += f < 0 ? -1 : 1;
        }
        f = f * this.C1 * DF[DD] >> 4;
        if ((f & 1) == 0) {
            f -= f > 0 ? 1 : -1;
        }
        if (f > 2047) {
            f = 2047;
        } else if (f < -2048) {
            f = -2048;
        }
        this.C[DD] = f * Ec[DD];
    }
    var I, G, M;
    if (AG < 4) {
        I = this.BE;
        M = this.AY - 8;
        G = this.Aj * this.AY + this.Az << 4;
        if ((AG & 1) != 0) {
            G += 8;
        }
        if ((AG & 2) != 0) {
            G += this.AY << 3;
        }
    } else {
        I = AG == 4 ? this.BD : this.BG;
        M = (this.AY >> 1) - 8;
        G = (this.Aj * this.AY << 2) + (this.Az << 3);
    }
    if (this.BL) {
        if (L == 1) {
            this.ER(this.C[0] + 128 >> 8, I, G, M);
            this.C[0] = 0;
        } else {
            this.Dw();
            this.DX(this.C, I, G, M);
            this.C.set(this.DS);
        }
    } else {
        if (L == 1) {
            this.EN(this.C[0] + 128 >> 8, I, G, M);
            this.C[0] = 0;
        } else {
            this.Dw();
            this.Dg(this.C, I, G, M);
            this.C.set(this.DS);
        }
    }
    L = 0;
};
F.prototype.DX = function(C, I, G, M) {
    for (var L = 0; L < 64; L += 8, G += M + 8) {
        I[G + 0] = C[L + 0];
        I[G + 1] = C[L + 1];
        I[G + 2] = C[L + 2];
        I[G + 3] = C[L + 3];
        I[G + 4] = C[L + 4];
        I[G + 5] = C[L + 5];
        I[G + 6] = C[L + 6];
        I[G + 7] = C[L + 7];
    }
};
F.prototype.Dg = function(C, I, G, M) {
    for (var L = 0; L < 64; L += 8, G += M + 8) {
        I[G + 0] += C[L + 0];
        I[G + 1] += C[L + 1];
        I[G + 2] += C[L + 2];
        I[G + 3] += C[L + 3];
        I[G + 4] += C[L + 4];
        I[G + 5] += C[L + 5];
        I[G + 6] += C[L + 6];
        I[G + 7] += C[L + 7];
    }
};
F.prototype.ER = function(value, I, G, M) {
    for (var L = 0; L < 64; L += 8, G += M + 8) {
        I[G + 0] = value;
        I[G + 1] = value;
        I[G + 2] = value;
        I[G + 3] = value;
        I[G + 4] = value;
        I[G + 5] = value;
        I[G + 6] = value;
        I[G + 7] = value;
    }
};
F.prototype.EN = function(value, I, G, M) {
    for (var L = 0; L < 64; L += 8, G += M + 8) {
        I[G + 0] += value;
        I[G + 1] += value;
        I[G + 2] += value;
        I[G + 3] += value;
        I[G + 4] += value;
        I[G + 5] += value;
        I[G + 6] += value;
        I[G + 7] += value;
    }
};
F.prototype.FU = function(C, I, G, M) {
    var L = 0;
    for (var i = 0; i < 8; i++) {
        for (var Bp = 0; Bp < 8; Bp++) {
            var A4 = C[L++];
            I[G++] = A4 > 255 ? 255 : A4 < 0 ? 0 : A4;
        }
        G += M;
    }
};
F.prototype.FT = function(C, I, G, M) {
    var L = 0;
    for (var i = 0; i < 8; i++) {
        for (var Bp = 0; Bp < 8; Bp++) {
            var A4 = C[L++] + I[G];
            I[G++] = A4 > 255 ? 255 : A4 < 0 ? 0 : A4;
        }
        G += M;
    }
};
F.prototype.Dw = function() {
    var Bi, Am, BN, Bf, Ap, Bd, Bc, BS, As, BT, BR, BP, Ai, AX, AT, BV, Bb, BX, i, C = this.C;
    for (i = 0; i < 8; ++i) {
        Bi = C[32 + i];
        Am = C[16 + i] + C[48 + i];
        BN = C[40 + i] - C[24 + i];
        Bd = C[8 + i] + C[56 + i];
        Bc = C[24 + i] + C[40 + i];
        Bf = C[8 + i] - C[56 + i];
        Ap = Bd + Bc;
        BS = C[0 + i];
        Ai = (Bf * 473 - BN * 196 + 128 >> 8) - Ap;
        As = Ai - ((Bd - Bc) * 362 + 128 >> 8);
        BT = BS - Bi;
        BR = ((C[16 + i] - C[48 + i]) * 362 + 128 >> 8) - Am;
        BP = BS + Bi;
        AX = BT + BR;
        AT = BP + Am;
        BV = BT - BR;
        Bb = BP - Am;
        BX = -As - (BN * 473 + Bf * 196 + 128 >> 8);
        C[0 + i] = Ap + AT;
        C[8 + i] = Ai + AX;
        C[16 + i] = BV - As;
        C[24 + i] = Bb - BX;
        C[32 + i] = Bb + BX;
        C[40 + i] = As + BV;
        C[48 + i] = AX - Ai;
        C[56 + i] = AT - Ap;
    }
    for (i = 0; i < 64; i += 8) {
        Bi = C[4 + i];
        Am = C[2 + i] + C[6 + i];
        BN = C[5 + i] - C[3 + i];
        Bd = C[1 + i] + C[7 + i];
        Bc = C[3 + i] + C[5 + i];
        Bf = C[1 + i] - C[7 + i];
        Ap = Bd + Bc;
        BS = C[0 + i];
        Ai = (Bf * 473 - BN * 196 + 128 >> 8) - Ap;
        As = Ai - ((Bd - Bc) * 362 + 128 >> 8);
        BT = BS - Bi;
        BR = ((C[2 + i] - C[6 + i]) * 362 + 128 >> 8) - Am;
        BP = BS + Bi;
        AX = BT + BR;
        AT = BP + Am;
        BV = BT - BR;
        Bb = BP - Am;
        BX = -As - (BN * 473 + Bf * 196 + 128 >> 8);
        C[0 + i] = Ap + AT + 128 >> 8;
        C[1 + i] = Ai + AX + 128 >> 8;
        C[2 + i] = BV - As + 128 >> 8;
        C[3 + i] = Bb - BX + 128 >> 8;
        C[4 + i] = Bb + BX + 128 >> 8;
        C[5 + i] = As + BV + 128 >> 8;
        C[6 + i] = AX - Ai + 128 >> 8;
        C[7 + i] = AT - Ap + 128 >> 8;
    }
};
var F$ = "jsmp",
    F2 = 1,
    F3 = [0, 23.976, 24, 25, 29.97, 30, 50, 59.94, 60, 0, 0, 0, 0, 0, 0, 0],
    EZ = new Uint8Array([0, 1, 8, 16, 9, 2, 3, 10, 17, 24, 32, 25, 18, 11, 4, 5, 12, 19, 26, 33, 40, 48, 41, 34, 27, 20, 13, 6, 7, 14, 21, 28, 35, 42, 49, 56, 57, 50, 43, 36, 29, 22, 15, 23, 30, 37, 44, 51, 58, 59, 52, 45, 38, 31, 39, 46, 53, 60, 61, 54, 47, 55, 62, 63]),
    FR = new Uint8Array([8, 16, 19, 22, 26, 27, 29, 34, 16, 16, 22, 24, 27, 29, 34, 37, 19, 22, 26, 27, 29, 34, 34, 38, 22, 22, 26, 27, 29, 34, 37, 40, 22, 26, 27, 29, 32, 35, 40, 48, 26, 27, 29, 32, 35, 40, 48, 58, 26, 27, 29, 34, 38, 46, 56, 69, 27, 29, 35, 38, 46, 56, 69, 83]),
    FX = new Uint8Array([16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16]),
    Ec = new Uint8Array([32, 44, 42, 38, 32, 25, 17, 9, 44, 62, 58, 52, 44, 35, 24, 12, 42, 58, 55, 49, 42, 33, 23, 12, 38, 52, 49, 44, 38, 30, 20, 10, 32, 44, 42, 38, 32, 25, 17, 9, 25, 35, 33, 30, 25, 20, 14, 7, 17, 24, 23, 20, 17, 14, 9, 5, 9, 12, 12, 10, 9, 7, 5, 2]),
    DG = new Int16Array([3, 6, 0, 9, 12, 0, 0, 0, 1, 15, 18, 0, 21, 24, 0, 27, 30, 0, 33, 36, 0, 0, 0, 3, 0, 0, 2, 39, 42, 0, 45, 48, 0, 0, 0, 5, 0, 0, 4, 51, 54, 0, 57, 60, 0, 0, 0, 7, 0, 0, 6, 63, 66, 0, 69, 72, 0, 75, 78, 0, 81, 84, 0, -1, 87, 0, -1, 90, 0, 93, 96, 0, 99, 102, 0, 105, 108, 0, 111, 114, 0, 0, 0, 9, 0, 0, 8, 117, 120, 0, 123, 126, 0, 129, 132, 0, 135, 138, 0, 0, 0, 15, 0, 0, 14, 0, 0, 13, 0, 0, 12, 0, 0, 11, 0, 0, 10, 141, -1, 0, -1, 144, 0, 147, 150, 0, 153, 156, 0, 159, 162, 0, 165, 168, 0, 171, 174, 0, 177, 180, 0, 183, -1, 0, -1, 186, 0, 189, 192, 0, 195, 198, 0, 201, 204, 0, 207, 210, 0, 213, 216, 0, 219, 222, 0, 0, 0, 21, 0, 0, 20, 0, 0, 19, 0, 0, 18, 0, 0, 17, 0, 0, 16, 0, 0, 35, 0, 0, 34, 0, 0, 33, 0, 0, 32, 0, 0, 31, 0, 0, 30, 0, 0, 29, 0, 0, 28, 0, 0, 27, 0, 0, 26, 0, 0, 25, 0, 0, 24, 0, 0, 23, 0, 0, 22]),
    EX = new Int8Array([3, 6, 0, -1, 9, 0, 0, 0, 1, 0, 0, 17]),
    EK = new Int8Array([3, 6, 0, 9, 12, 0, 0, 0, 10, 15, 18, 0, 0, 0, 2, 21, 24, 0, 0, 0, 8, 27, 30, 0, 33, 36, 0, -1, 39, 0, 0, 0, 18, 0, 0, 26, 0, 0, 1, 0, 0, 17]),
    EO = new Int8Array([3, 6, 0, 9, 15, 0, 12, 18, 0, 24, 21, 0, 0, 0, 12, 27, 30, 0, 0, 0, 14, 39, 42, 0, 36, 33, 0, 0, 0, 4, 0, 0, 6, 54, 48, 0, 45, 51, 0, 0, 0, 8, 0, 0, 10, -1, 57, 0, 0, 0, 1, 60, 63, 0, 0, 0, 30, 0, 0, 17, 0, 0, 22, 0, 0, 26]),
    ES = new Int16Array([6, 3, 0, 9, 18, 0, 12, 15, 0, 24, 33, 0, 36, 39, 0, 27, 21, 0, 30, 42, 0, 60, 57, 0, 54, 48, 0, 69, 51, 0, 81, 75, 0, 63, 84, 0, 45, 66, 0, 72, 78, 0, 0, 0, 60, 105, 120, 0, 132, 144, 0, 114, 108, 0, 126, 141, 0, 87, 93, 0, 117, 96, 0, 0, 0, 32, 135, 138, 0, 99, 123, 0, 129, 102, 0, 0, 0, 4, 90, 111, 0, 0, 0, 8, 0, 0, 16, 0, 0, 44, 150, 168, 0, 0, 0, 28, 0, 0, 52, 0, 0, 62, 183, 177, 0, 156, 180, 0, 0, 0, 1, 165, 162, 0, 0, 0, 61, 0, 0, 56, 171, 174, 0, 0, 0, 2, 0, 0, 40, 153, 186, 0, 0, 0, 48, 192, 189, 0, 147, 159, 0, 0, 0, 20, 0, 0, 12, 240, 249, 0, 0, 0, 63, 231, 225, 0, 195, 219, 0, 252, 198, 0, 0, 0, 24, 0, 0, 36, 0, 0, 3, 207, 261, 0, 243, 237, 0, 204, 213, 0, 210, 234, 0, 201, 228, 0, 216, 222, 0, 258, 255, 0, 264, 246, 0, -1, 282, 0, 285, 291, 0, 0, 0, 33, 0, 0, 9, 318, 330, 0, 306, 348, 0, 0, 0, 5, 0, 0, 10, 279, 267, 0, 0, 0, 6, 0, 0, 18, 0, 0, 17, 0, 0, 34, 339, 357, 0, 309, 312, 0, 270, 276, 0, 327, 321, 0, 351, 354, 0, 303, 297, 0, 294, 288, 0, 300, 273, 0, 342, 345, 0, 315, 324, 0, 336, 333, 0, 363, 375, 0, 0, 0, 41, 0, 0, 14, 0, 0, 21, 372, 366, 0, 360, 369, 0, 0, 0, 11, 0, 0, 19, 0, 0, 7, 0, 0, 35, 0, 0, 13, 0, 0, 50, 0, 0, 49, 0, 0, 58, 0, 0, 37, 0, 0, 25, 0, 0, 45, 0, 0, 57, 0, 0, 26, 0, 0, 29, 0, 0, 38, 0, 0, 53, 0, 0, 23, 0, 0, 43, 0, 0, 46, 0, 0, 42, 0, 0, 22, 0, 0, 54, 0, 0, 51, 0, 0, 15, 0, 0, 30, 0, 0, 39, 0, 0, 47, 0, 0, 55, 0, 0, 27, 0, 0, 59, 0, 0, 31]),
    MOTION = new Int16Array([3, 6, 0, 12, 9, 0, 0, 0, 0, 18, 15, 0, 24, 21, 0, 0, 0, -1, 0, 0, 1, 27, 30, 0, 36, 33, 0, 0, 0, 2, 0, 0, -2, 42, 45, 0, 48, 39, 0, 60, 54, 0, 0, 0, 3, 0, 0, -3, 51, 57, 0, -1, 69, 0, 81, 75, 0, 78, 63, 0, 72, 66, 0, 96, 84, 0, 87, 93, 0, -1, 99, 0, 108, 105, 0, 0, 0, -4, 90, 102, 0, 0, 0, 4, 0, 0, -7, 0, 0, 5, 111, 123, 0, 0, 0, -5, 0, 0, 7, 114, 120, 0, 126, 117, 0, 0, 0, -6, 0, 0, 6, 153, 162, 0, 150, 147, 0, 135, 138, 0, 156, 141, 0, 129, 159, 0, 132, 144, 0, 0, 0, 10, 0, 0, 9, 0, 0, 8, 0, 0, -8, 171, 198, 0, 0, 0, -9, 180, 192, 0, 168, 183, 0, 165, 186, 0, 174, 189, 0, 0, 0, -10, 177, 195, 0, 0, 0, 12, 0, 0, 16, 0, 0, 13, 0, 0, 14, 0, 0, 11, 0, 0, 15, 0, 0, -16, 0, 0, -12, 0, 0, -14, 0, 0, -15, 0, 0, -11, 0, 0, -13]),
    Ee = new Int8Array([6, 3, 0, 18, 15, 0, 9, 12, 0, 0, 0, 1, 0, 0, 2, 27, 24, 0, 21, 30, 0, 0, 0, 0, 36, 33, 0, 0, 0, 4, 0, 0, 3, 39, 42, 0, 0, 0, 5, 0, 0, 6, 48, 45, 0, 51, -1, 0, 0, 0, 7, 0, 0, 8]),
    EQ = new Int8Array([6, 3, 0, 12, 9, 0, 18, 15, 0, 24, 21, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 30, 27, 0, 0, 0, 3, 36, 33, 0, 0, 0, 4, 42, 39, 0, 0, 0, 5, 48, 45, 0, 0, 0, 6, 51, -1, 0, 0, 0, 7, 0, 0, 8]),
    EU = new Int32Array([3, 6, 0, 12, 9, 0, 0, 0, 1, 21, 24, 0, 18, 15, 0, 39, 27, 0, 33, 30, 0, 42, 36, 0, 0, 0, 257, 60, 66, 0, 54, 63, 0, 48, 57, 0, 0, 0, 513, 51, 45, 0, 0, 0, 2, 0, 0, 3, 81, 75, 0, 87, 93, 0, 72, 78, 0, 96, 90, 0, 0, 0, 1025, 69, 84, 0, 0, 0, 769, 0, 0, 258, 0, 0, 1793, 0, 0, 65535, 0, 0, 1537, 111, 108, 0, 0, 0, 1281, 105, 102, 0, 117, 114, 0, 99, 126, 0, 120, 123, 0, 156, 150, 0, 162, 159, 0, 144, 147, 0, 129, 135, 0, 138, 132, 0, 0, 0, 2049, 0, 0, 4, 0, 0, 514, 0, 0, 2305, 153, 141, 0, 165, 171, 0, 180, 168, 0, 177, 174, 0, 183, 186, 0, 0, 0, 2561, 0, 0, 3329, 0, 0, 6, 0, 0, 259, 0, 0, 5, 0, 0, 770, 0, 0, 2817, 0, 0, 3073, 228, 225, 0, 201, 210, 0, 219, 213, 0, 234, 222, 0, 216, 231, 0, 207, 192, 0, 204, 189, 0, 198, 195, 0, 243, 261, 0, 273, 240, 0, 246, 237, 0, 249, 258, 0, 279, 276, 0, 252, 255, 0, 270, 282, 0, 264, 267, 0, 0, 0, 515, 0, 0, 260, 0, 0, 7, 0, 0, 1026, 0, 0, 1282, 0, 0, 4097, 0, 0, 3841, 0, 0, 3585, 315, 321, 0, 333, 342, 0, 312, 291, 0, 375, 357, 0, 288, 294, 0, -1, 369, 0, 285, 303, 0, 318, 363, 0, 297, 306, 0, 339, 309, 0, 336, 348, 0, 330, 300, 0, 372, 345, 0, 351, 366, 0, 327, 354, 0, 360, 324, 0, 381, 408, 0, 417, 420, 0, 390, 378, 0, 435, 438, 0, 384, 387, 0, 0, 0, 2050, 396, 402, 0, 465, 462, 0, 0, 0, 8, 411, 399, 0, 429, 432, 0, 453, 414, 0, 426, 423, 0, 0, 0, 10, 0, 0, 9, 0, 0, 11, 0, 0, 5377, 0, 0, 1538, 0, 0, 771, 0, 0, 5121, 0, 0, 1794, 0, 0, 4353, 0, 0, 4609, 0, 0, 4865, 444, 456, 0, 0, 0, 1027, 459, 450, 0, 0, 0, 261, 393, 405, 0, 0, 0, 516, 447, 441, 0, 516, 519, 0, 486, 474, 0, 510, 483, 0, 504, 498, 0, 471, 537, 0, 507, 501, 0, 522, 513, 0, 534, 531, 0, 468, 477, 0, 492, 495, 0, 549, 546, 0, 525, 528, 0, 0, 0, 263, 0, 0, 2562, 0, 0, 2306, 0, 0, 5633, 0, 0, 5889, 0, 0, 6401, 0, 0, 6145, 0, 0, 1283, 0, 0, 772, 0, 0, 13, 0, 0, 12, 0, 0, 14, 0, 0, 15, 0, 0, 517, 0, 0, 6657, 0, 0, 262, 540, 543, 0, 480, 489, 0, 588, 597, 0, 0, 0, 27, 609, 555, 0, 606, 603, 0, 0, 0, 19, 0, 0, 22, 591, 621, 0, 0, 0, 18, 573, 576, 0, 564, 570, 0, 0, 0, 20, 552, 582, 0, 0, 0, 21, 558, 579, 0, 0, 0, 23, 612, 594, 0, 0, 0, 25, 0, 0, 24, 600, 615, 0, 0, 0, 31, 0, 0, 30, 0, 0, 28, 0, 0, 29, 0, 0, 26, 0, 0, 17, 0, 0, 16, 567, 618, 0, 561, 585, 0, 654, 633, 0, 0, 0, 37, 645, 648, 0, 0, 0, 36, 630, 636, 0, 0, 0, 34, 639, 627, 0, 663, 666, 0, 657, 624, 0, 651, 642, 0, 669, 660, 0, 0, 0, 35, 0, 0, 267, 0, 0, 40, 0, 0, 268, 0, 0, 266, 0, 0, 32, 0, 0, 264, 0, 0, 265, 0, 0, 38, 0, 0, 269, 0, 0, 270, 0, 0, 33, 0, 0, 39, 0, 0, 7937, 0, 0, 6913, 0, 0, 7681, 0, 0, 4098, 0, 0, 7425, 0, 0, 7169, 0, 0, 271, 0, 0, 274, 0, 0, 273, 0, 0, 272, 0, 0, 1539, 0, 0, 2818, 0, 0, 3586, 0, 0, 3330, 0, 0, 3074, 0, 0, 3842]),
    Dx = 1,
    B5 = 2,
    FV = 3,
    F8 = 4,
    F6 = 179,
    Fc = 1,
    Fj = 175,
    Fn = 0,
    Fb = 181,
    Fg = 178;
var EY = [null, EX, EK, EO];
var BitReader = function(arrayBuffer) {
    this.l = new Uint8Array(arrayBuffer);
    this.length = this.l.length;
    this.AF = this.l.length;
    this.index = 0;
};
BitReader.Cl = -1;
BitReader.prototype.CE = function() {
    for (var i = this.index + 7 >> 3; i < this.AF; i++) {
        if (this.l[i] == 0 && this.l[i + 1] == 0 && this.l[i + 2] == 1) {
            this.index = i + 4 << 3;
            return this.l[i + 3];
        }
    }
    this.index = this.AF << 3;
    return BitReader.Cl;
};
BitReader.prototype.Ed = function() {
    var i = this.index + 7 >> 3;
    return i >= this.AF || this.l[i] == 0 && this.l[i + 1] == 0 && this.l[i + 2] == 1;
};
BitReader.prototype.EJ = function(count) {
    var Ar = this.index >> 3,
        DB = 8 - this.index % 8;
    if (DB >= count) {
        return this.l[Ar] >> DB - count & 255 >> 8 - count;
    }
    var A6 = (this.index + count) % 8,
        end = this.index + count - 1 >> 3,
        value = this.l[Ar] & 255 >> 8 - DB;
    for (Ar++; Ar < end; Ar++) {
        value <<= 8;
        value |= this.l[Ar];
    }
    if (A6 > 0) {
        value <<= A6;
        value |= this.l[Ar] >> 8 - A6;
    } else {
        value <<= 8;
        value |= this.l[Ar];
    }
    return value;
};
BitReader.prototype.u = function(count) {
    var value = this.EJ(count);
    this.index += count;
    return value;
};
BitReader.prototype.CH = function(count) {
    return this.index += count;
};
BitReader.prototype.Fk = function(count) {
    return this.index -= count;
};