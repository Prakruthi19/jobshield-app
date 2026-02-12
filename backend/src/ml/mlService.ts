import { spawn } from 'child_process';

interface MLPrediction {
  fraud_probability: number;
  is_fraudulent: boolean;
  confidence: number;
}

interface MLInput {
  title: string;
  location: string;
  department: string;
  company_profile: string;
  description: string;
  requirements: string;
  benefits: string;
  industry: string;
  function: string;
}

export async function predictJobFraud(job: any): Promise<MLPrediction> {
  return new Promise((resolve, reject) => {
    const python = spawn('python', ['src/ml/predict.py']); // adjust path if needed

    const input: MLInput = {
      title: job.title || '',
      location: job.location || '',
      department: job.department || '',
      company_profile: job.companyProfile || '',
      description: job.description || '',
      requirements: job.requirements || '',
      benefits: job.benefits || '',
      industry: job.industry || '',
      function: job.function || '',
    };

    let stdout = '';
    let stderr = '';

    python.stdout.on('data', data => (stdout += data.toString()));
    python.stderr.on('data', data => (stderr += data.toString()));

    python.on('close', code => {
      if (stderr) console.error('ML stderr:', stderr);
      if (code !== 0) return reject(new Error(`Python exited with code ${code}`));

      try {
        resolve(JSON.parse(stdout));
      } catch (err) {
        reject(new Error(`Invalid JSON from ML: ${stdout}`));
      }
    });

    python.stdin.write(JSON.stringify(input));
    python.stdin.end();
  });
}
