const logFile = Date.now().toString();

export function writeData(content) {
    fs.writeFile(
        logFile,
        content,
        {
            encoding: 'utf8',
            flag: 'w',
            mode: 0o666,
        },
        (err) => {
            if (err) console.log(err);
            else {
                console.log('File written successfully\n');
            }
        },
    );
}
