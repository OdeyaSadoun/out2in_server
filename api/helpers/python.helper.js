const { exec } = require('child_process');
const { spawn } = require("child_process");


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
  
  exports.callPythonFunction = (pythonFile, functionName, args) => {

    let argument = "True"; 
    const pythonProcess = spawn('python3', 
    ['-c', 
    `import compliment; compliment.giveMe(${argument});`
  ]); 
    pythonProcess.stdout.on('data', (data) => { 
      console.log(`stdout: ${data}`); 
    }); 
    pythonProcess.stderr.on('data', (data) => { 
      console.log(`stderr: ${data}`); 
    }); 
    pythonProcess.on('exit', (code) => { 
      console.log(`Python process ended with code: ${code}`); 
    });
    
  };
  
  
  