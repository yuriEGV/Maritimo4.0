const path = require('path');
const fs = require('fs');
const os = require('os');

const storageDir = (process.env.VERCEL || process.env.NOW_REGION)
	? path.join('/tmp', 'storage')
	: path.join(os.tmpdir(), 'storage');
if (!fs.existsSync(storageDir)) {
	fs.mkdirSync(storageDir, { recursive: true });
}

async function saveStreamToFile(stream, filename) {
    const filePath = path.join(storageDir, filename);
    const writeStream = fs.createWriteStream(filePath);
    const url = `/files/${filename}`;
    await new Promise((resolve, reject) => {
        stream.pipe(writeStream);
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
    });
    return { filePath, url };
}

module.exports = { saveStreamToFile };


