const { PrismaClient } = require('@prisma/client');
const { spawn } = require('child_process');

const prisma = new PrismaClient();

/**
 * Spawns predict.py and returns ML result
 */
async function runPythonML(jobInput: any) {
  return new Promise((resolve, reject) => {
    const python = spawn('python', ['src/ml/predict.py'], {
      cwd: process.cwd(),
    });

    let output = "";
    let errorOutput = "";

    python.stdout.on('data', (data: any) => {
      output += data.toString();
    });

    python.stderr.on('data', (data: any) => {
      errorOutput += data.toString();
    });

    python.on('close', (code: any) => {
      if (errorOutput) console.error('ML stderr:', errorOutput);
      if (code !== 0) return reject(new Error(`Python exited with code ${code}`));

      try {
        const jsonOutput = JSON.parse(output);
        resolve(jsonOutput);
      } catch (err) {
        reject(new Error(`Invalid JSON from ML: ${output}`));
      }
    });

    python.stdin.write(JSON.stringify(jobInput));
    python.stdin.end();
  });
}

/**
 * Maps Prisma job fields -> ML snake_case fields
 */
function toMLInput(job: any) {
  return {
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
}

/**
 * Batch job fraud prediction
 */
async function predictExistingJobs() {
  console.log('🤖 Running ML predictions on existing jobs...');

  const jobs = await prisma.job.findMany({
    where: {
      mlFraudProbability: null,   // Skip already predicted
    },
    take: 100, // Batch size (can increase after testing)
  });

  if (jobs.length === 0) {
    console.log('🎉 No jobs left to predict');
    await prisma.$disconnect();
    return;
  }

  console.log(`📊 Found ${jobs.length} job(s) to predict\n`);

  for (const job of jobs) {
    try {
      console.log(`🔍 Predicting job ${job.id}: ${job.title}`);

      const mlInput = toMLInput(job);
      const prediction: any = await runPythonML(mlInput);

      // Calculate trust score
      let trustScore = Math.round((1 - prediction.fraud_probability) * 100);

      // Business rule bonuses / penalties
      if (!job.description) trustScore -= 10;
      if (!job.salaryRange) trustScore -= 5;
      if (!job.requirements) trustScore -= 3;
      if (job.hasCompanyLogo === 1) trustScore += 5;
      if (job.hasQuestions === 1) trustScore += 3;

      trustScore = Math.max(0, Math.min(100, trustScore)); // clamp

        await prisma.job.update({
          where: { id: job.id },
          data: {
            mlFraudProbability: prediction.fraud_probability,
            mlModelVersion: 'v1.0-production',
            mlPredictedAt: new Date(),
            trustScore,
            trustScoreUpdatedAt: new Date(),
            status: prediction.is_fraudulent ? 'SUSPENDED' : job.status,
          },
        });

        // Save ML audit record for transparency
      await prisma.mlPrediction.create({
        data: {
          jobId: job.id,
          modelVersion: 'v1.0-production',
          modelName: 'RandomForest',
          fraudProbability: prediction.fraud_probability,
          isFraudulent: prediction.is_fraudulent,
          confidenceScore: prediction.confidence,
          topFraudIndicators: [], // placeholder for future SHAP
        },
      });

      console.log(
        `✅ Job ${job.id} → Fraud ${(prediction.fraud_probability * 100).toFixed(1)}%, Trust ${trustScore}`
      );
    } catch (err: any) {
      console.error(`❌ Error predicting job ${job.id}:`, err.message);
    }
  }

  console.log('\n🎉 Batch prediction complete!');
  await prisma.$disconnect();
}

predictExistingJobs();
