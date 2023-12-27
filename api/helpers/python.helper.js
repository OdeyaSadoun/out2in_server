const { exec } = require('child_process');

exports.runPythonCode = (code) => {
    return new Promise((resolve, reject) => {
      exec(`python -c "${code}"`, (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        if (stderr) {
          reject(stderr);
          return;
        }
        resolve(stdout);
      });
    });
  };
  
  exports.runPythonScript = (scriptPath) => {
    return new Promise((resolve, reject) => {
      exec(`python ${scriptPath}`, (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        if (stderr) {
          reject(stderr);
          return;
        }
        resolve(stdout);
      });
    });
  };
  
  exports.callPythonFunction = (url, file, functionName, args) => {
    console.log("ho");
    return new Promise((resolve, reject) => {
      const formattedArgs = args.map(arg => JSON.stringify(arg)).join(', ');
      const command = `python -c "import sys; sys.path.append('${url}'); from ${file} import ${functionName} ; print(${functionName}(${formattedArgs}));"`;
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        if (stderr) {
          reject(stderr);
          return;
        }
        resolve(stdout.trim());
      });
    });
  };
  