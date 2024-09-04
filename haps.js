class HapsPlotSettings {
    constructor(thickness, padding, gain) {
        this.thickness = thickness;
        this.padding = padding;
        this.gain = gain;
    }
}

var hapsPlotSettings = new HapsPlotSettings(3, 4, 200);

class HapsTransient {
    constructor(hapsFile, json) {
        this.hapsFile = hapsFile;
        this.json = json;
    }
    plot(canvas) {

        const ctx = canvas.getContext("2d");

        ctx.strokeStyle = 'yellow';

        ctx.moveTo(0, 0);

        let length = this.hapsFile.getHapsLength();
        //console.log('length', length);

        //console.log('hapsTransient', hapsTransient);
        const notes = this.json.m_notes;
        //console.log('notes', notes);
        notes.forEach(note => {
            //console.log('note', note);
            const noteLength = note.m_length;
            //console.log('noteLength', noteLength);
            const hapticEffect = note.m_hapticEffect;
            const amplitudeModulation = hapticEffect.m_amplitudeModulation;
            if (!amplitudeModulation) {
                const startingPoint = note.m_startingPoint;
                const noteGain = note.m_gain;
                const noteLength2 = note.m_length;
                const startTime = startingPoint / length * (canvas.width - hapsPlotSettings.thickness);
                const endTime = (startingPoint + noteLength2) / length * (canvas.width - hapsPlotSettings.thickness);
                const x = startTime;
                const y = noteGain;
                // lines
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.moveTo(x, canvas.height);
                ctx.lineTo(x, canvas.height - y * hapsPlotSettings.gain);
                ctx.stroke();
                ctx.closePath();
                // draw a circle
                ctx.beginPath();
                ctx.lineWidth = 5;
                ctx.arc(x, canvas.height - y * hapsPlotSettings.gain, hapsPlotSettings.thickness / 2, 0, 2 * Math.PI);
                //ctx.fill();
                ctx.stroke();
                ctx.closePath();
            }

        });
    }
}

class HapsMelody {
    constructor(hapsFile, json) {
        this.hapsFile = hapsFile;
        this.json = json;
    }

    plot(canvas) {

        const ctx = canvas.getContext("2d");

        ctx.moveTo(0, 0);
        ctx.lineWidth = 1;

        let length = this.hapsFile.getHapsLength();
        //console.log('length', length);

        // draw each note
        let index = 0;
        let lastPoint = {};

        //console.log('melody', melody);
        const notes = this.json.m_notes;
        //console.log('notes', notes);
        let lastValue = null;;
        notes.forEach(note => {
            //console.log('note', note);
            const noteStartingPoint = note.m_startingPoint;
            //console.log('noteStartingPoint', noteStartingPoint);
            const noteLength = note.m_length;
            //console.log('noteLength', noteLength);
            const hapticEffect = note.m_hapticEffect;
            const amplitudeModulation = hapticEffect.m_amplitudeModulation;
            if (amplitudeModulation) {
                //console.log('amplitudeModulation', amplitudeModulation);
                const keyframes = amplitudeModulation.m_keyframes;
                //console.log('keyframes', keyframes);
                keyframes.forEach(keyframe => {
                    //console.log('keyframe', keyframe);
                    let time = keyframe.m_time;
                    time += noteStartingPoint;
                    const value = keyframe.m_value;
                    const x1 = 0;
                    const y1 = canvas.height;
                    const x2 = time / length * canvas.width;
                    const y2 = canvas.height - value * hapsPlotSettings.gain;
                    if (index == 0) {
                        this.hapsFile.drawLine(ctx, 'cyan',
                            x1, y1,
                            x2, y2,
                        );
                    } else {
                        this.hapsFile.drawLine(ctx, '#309dde',
                            lastPoint.x, lastPoint.y,
                            x2, y2,
                        );
                    }
                    lastValue =
                    {
                        x: x2,
                        y: y2,
                    };
                    ++index;
                });
            }

        });
    }
}

class HapsFile {
    constructor(path, callback) {
        this.path = path;
        this.json = null;
        this.ready = false;
        this.transient = null;
        this.melodies = [];
        this.readFile(callback);
    }
    getHapsLength() {
        let length = 0;
        if (this.json) {
            let vibration = this.json.m_vibration;
            if (vibration) {
                let melodies = vibration.m_melodies;
                if (melodies && melodies.length) {
                    for (let m = 0; m < melodies.length; ++m) {
                        let melody = melodies[m];
                        if (melody) {
                            let notes = melody.m_notes;
                            if (notes && notes.length) {
                                for (let n = 0; n < notes.length; ++n) {
                                    let note = notes[n];
                                    if (note) {
                                        let startingPoint = note.m_startingPoint;
                                        let noteLength = note.m_length;
                                        let endTime = startingPoint + noteLength;
                                        length = Math.max(length, endTime);
                                        //console.log('endTime', endTime);
                                    }
                                }
                            }
                        }
                    }
                }
                return length;
            } else {
                return 0;
            }
        }
    }
    getHapsTransient() {
        return this.transient;
    }
    getHapsMelodies() {
        return this.melodies;
    }
    getHapsMelodyIndex(hapsMelody) {
        return this.melodies.indexOf(hapsMelody);
    }
    getHapsAmplitude(hapsTime) {
        var amplitude = 0;
        let transient = this.getHapsTransient();
        if (transient) {
            const notes = transient.json.m_notes;
            notes.forEach(note => {
                const noteStartingPoint = note.m_startingPoint;
                const noteLength = note.m_length;
                const hapticEffect = note.m_hapticEffect;
                const amplitudeModulation = hapticEffect.m_amplitudeModulation;
                if (!amplitudeModulation) {
                    if (hapsTime >= noteStartingPoint && hapsTime < noteStartingPoint + noteLength) {
                        amplitude = Math.max(amplitude, note.m_gain);
                    }
                }
            });
        }

        this.getHapsMelodies().forEach(melody => {
            const notes = melody.json.m_notes;
            notes.forEach(note => {
                const noteStartingPoint = note.m_startingPoint;
                const hapticEffect = note.m_hapticEffect;
                const amplitudeModulation = hapticEffect.m_amplitudeModulation;
                if (amplitudeModulation) {
                    //console.log('amplitudeModulation', amplitudeModulation);
                    const keyframes = amplitudeModulation.m_keyframes;
                    //console.log('keyframes', keyframes);
                    //console.log('keyframes.length', keyframes.length);

                    // find nearest keyframe using hapsTime and keyframe.m_time
                    // interpolate between keyframes

                    // loop through each keyframe
                    // check if hapsTime is between previous keyframe and current keyframe
                    // get the value of both keyframes
                    // interpolate between the two keyframes
                    // set the amplitude to the new value if larger than the old amplitude


                    //console.log('search', hapsTime);
                    for (let k = 1; k < keyframes.length; ++k) {
                        const prevKeyframe = keyframes[k - 1];
                        const keyframe = keyframes[k];
                        //console.log('k-1', k-1, prevKeyframe.m_time);
                        //console.log('k', k, keyframe.m_time);
                        if (k == 1 && hapsTime < (noteStartingPoint + prevKeyframe.m_time)) {
                            // search time is less than the previous keyframe
                            // amplitude is zero
                            //console.log('skip');
                            break;
                        }
                        if ((noteStartingPoint + prevKeyframe.m_time) <= hapsTime && hapsTime < (noteStartingPoint + keyframe.m_time)) {
                            //console.log('search', hapsTime, 'should be matched?');
                            //console.log('k-1', k - 1, prevKeyframe.m_time, prevKeyframe.m_value);
                            //console.log('k', k, keyframe.m_time, keyframe.m_value);
                            // interpolate
                            const prevTime = (noteStartingPoint + prevKeyframe.m_time);
                            const prevValue = prevKeyframe.m_value;
                            const time = (noteStartingPoint + keyframe.m_time);
                            const value = keyframe.m_value;
                            const t = (hapsTime - prevTime) / (time - prevTime);
                            const newValue = prevValue + (value - prevValue) * t;
                            amplitude = Math.max(amplitude, newValue);
                            break;
                        }
                    }
                }
            });
        });

        return amplitude;
    }
    drawLine(ctx, color, x1, y1, x2, y2) {
        ctx.strokeStyle = color;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    plotTransient(canvas) {
        if (this.transient) {
            this.transient.plot(canvas);
        }
    }
    plotMelody(canvas, hapsMelody) {
        hapsMelody.plot(canvas);
    }
    plotOutput(canvas) {

        const ctx = canvas.getContext("2d");

        let length = this.getHapsLength();
        //console.log('length', length);

        /*
        const transient = this.getHapsTransient();
        if (transient) {
            transient.plot(canvas);
        }

        this.getHapsMelodies().forEach(melody => {
            melody.plot(canvas);
        });
        */

        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;

        ctx.moveTo(0, 0);

        for (let x = 0; x < canvas.width; ++x) {
            let canvasTime = x / canvas.width * length;
            var amplitude = this.getHapsAmplitude(canvasTime);

            // lines
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.moveTo(x, canvas.height);
            ctx.lineTo(x, canvas.height - amplitude * hapsPlotSettings.gain);
            ctx.stroke();
            ctx.closePath();
        }
    }
    readJson(text) {
        //console.log('text', text);

        this.json = JSON.parse(text);
        //console.log('json', json);

        const vibration = this.json.m_vibration;
        //console.log('vibration', vibration);

        const melodies = vibration.m_melodies;
        //console.log('melodies', melodies);

        this.melodies = [];
        melodies.forEach(melody => {

            let isTransient = false;

            const notes = melody.m_notes;
            //console.log('notes', notes);
            notes.forEach(note => {
                const hapticEffect = note.m_hapticEffect;
                const amplitudeModulation = hapticEffect.m_amplitudeModulation;
                if (!amplitudeModulation) {
                    isTransient = true;
                }
            });

            if (isTransient) {
                const hapsTransient = new HapsTransient(this, melody);
                this.transient = hapsTransient;
            } else {
                const hapsMelody = new HapsMelody(this, melody);
                this.melodies.push(hapsMelody);
            }

        });

        this.ready = true;
    }
    async readFile(callback) {
        if (!this.path) {
            return;
        }
        await fetch(this.path)
            // get result
            .then(response => {
                response.text()
                    .then(text => {
                        this.readJson(text);
                        callback(this);
                    });
            });
    }

}
