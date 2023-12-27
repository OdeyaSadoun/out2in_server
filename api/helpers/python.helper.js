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
  
  exports.callPythonFunction = (functionName, args) => {
    return new Promise((resolve, reject) => {
      const formattedArgs = args.join(', '); // Convert array of arguments to a comma-separated string
      const command = `python -c "import sys; sys.path.append('path_to_python_file'); from python_module import ${functionName}; print(${functionName}(${formattedArgs}));"`;
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