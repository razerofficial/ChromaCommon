// File name: create_dist.ts
// File version: 1.0.0

// JavaScript source code

const fs = require('node:fs/promises');
const path = require('path');

// Version of target files
const version = "1.0.2";

// Target files to build
const targets = [
    {
        inFilePaths: [
            "./client_rest.js",
            "./anim_lib.js",
            "./umd.js",
        ],
        outFileName: "ChromaSDKImpl.js"
    },
    {
        inFilePaths: [
            "./client_ws.js",
            "./anim_lib.js",
            "./umd.js",
        ],
        outFileName: "ChromaSDKWS.js"
    },
    {
        inFilePaths: [
            "./client_rest.js",
            "./anim_lib.js",
            "./esm.js",
        ],
        outFileName: "ChromaSDKImpl.mjs"
    },
    {
        inFilePaths: [
            "./client_ws.js",
            "./anim_lib.js",
            "./esm.js",
        ],
        outFileName: "ChromaSDKWS.mjs"
    },
];

(async function () {
    for (const target of targets) {
        // Remove old file
        const outFP = path.resolve(__dirname, `../${target.outFileName}`);
        try {
            await fs.unlink(outFP);
        } catch (e) { }

        console.log(`Writing to ${outFP}`);

        // Open output file
        const outFile = await fs.open(outFP, 'a');
        const outFS = await outFile.createWriteStream();

        // Header
        const header = `\
// File name: ${target.outFileName}
// File version: ${version}

// Generated from ${path.basename(__filename)}

`;

        // Write header to top of output file
        outFS.write(header);

        for (const inPath of target.inFilePaths) {
            const inFP = path.resolve(__dirname, inPath);

            console.log(`Reading from ${inFP}`);

            // Open input file
            const inFile = await fs.open(inFP, 'r');

            // Write read bytes
            let read = await inFile.read();
            while (read.bytesRead > 0) {
                await outFS.write(read.buffer.slice(0, read.bytesRead));
                read = await inFile.read();
            }

            inFile.close();
        }

        outFS.end();
        outFile.close();
    }
})();