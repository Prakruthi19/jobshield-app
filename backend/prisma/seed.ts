import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import csv from 'csv-parser';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create a default company first
  const defaultCompany = await prisma.company.upsert({
     where: { slug: 'default-company' },
        update: {},
        create: {
            name: 'Default Company',
            slug: 'default-company',
            isVerified: true,
            status: 'ACTIVE',
        },
        });

  // Create a default employer user
    const defaultEmployer = await prisma.user.upsert({
    where: { email: 'employer@example.com' },
    update: {},
    create: {
        email: 'employer@example.com',
        passwordHash: 'hashed_password_here', // bcrypt in real use
        firstName: 'Default',
        lastName: 'Employer',
        role: 'EMPLOYER',
    },
    });


  console.log('✅ Default company and user created');

  // Import jobs from CSV
  const jobs: any[] = [];
  
  fs.createReadStream('../backend/dataset/fake_job_postings.csv')
    .pipe(csv())
    .on('data', (row: any) => {
      jobs.push({
        title: row.title || null,
        location: row.location || null,
        department: row.department || null,
        salaryRange: row.salary_range || null,
        companyProfile: row.company_profile || null,
        description: row.description || null,
        requirements: row.requirements || null,
        benefits: row.benefits || null,
        telecommuting: parseInt(row.telecommuting) || 0,
        hasCompanyLogo: parseInt(row.has_company_logo) || 0,
        hasQuestions: parseInt(row.has_questions) || 0,
        employmentType: row.employment_type || null,
        requiredExperience: row.required_experience || null,
        requiredEducation: row.required_education || null,
        industry: row.industry || null,
        function: row.function || null,
        fraudulent: parseInt(row.fraudulent) || 0,
        companyId: defaultCompany.id,
        postedByUserId: defaultEmployer.id,
        status: 'ACTIVE',
      });
    })
    .on('end', async () => {
      console.log(`📥 Importing ${jobs.length} jobs...`);
      
      // Import in batches of 1000
      for (let i = 0; i < jobs.length; i += 1000) {
        const batch = jobs.slice(i, i + 1000);
        await prisma.job.createMany({
          data: batch,
          skipDuplicates: true,
        });
        console.log(`✅ Imported ${Math.min(i + 1000, jobs.length)} / ${jobs.length}`);
      }
      
      console.log('🎉 Seeding complete!');
    });
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });