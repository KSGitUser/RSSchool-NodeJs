const checkNodeVersion = () => {
    const suitableVersion = [18, 12, 1]
    const userVersion = /\d{1,2}/.exec(process.version).map(str => +str);
    userVersion?.forEach((num,index) => {
        if (index <= suitableVersion.length-1) {
            if (num < suitableVersion[index]) {
                console.warn(`\x1b[41mWrong node version\x1b[0m - required >=v${suitableVersion.join('.')}` );
                process.exit(1);
            }
        }
    })
}

checkNodeVersion();
