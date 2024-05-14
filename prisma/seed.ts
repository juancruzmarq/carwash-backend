import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const prisma = new PrismaClient();

async function main() {
  // Read from csv file
  const brandPath = resolve(__dirname, 'global_brand.json');
  const modelPath = resolve(__dirname, 'global_model.json');
  const brandJson = readFileSync(brandPath, 'utf8');
  const modelJson = readFileSync(modelPath, 'utf8');

  // Parse JSON
  const brand = JSON.parse(brandJson);
  const model = JSON.parse(modelJson);

  // Insert data
  for (let i = 0; i < brand.length; i++) {
    const name = brand[i]['name'];
    const idBrand = brand[i]['id_global_brand'];
    const alredyExist = await prisma.brand.findFirst({
      where: {
        name,
      },
    });

    if (!alredyExist) {
      await prisma.brand.create({
        data: {
          idBrand: idBrand,
          name,
        },
      });
    }
  }

  for (let i = 0; i < model.length; i++) {
    const idModel = model[i]['id_global_model'];
    const name = model[i]['name'];
    const idBrand = model[i]['id_global_brand'];

    const alredyExist = await prisma.model.findFirst({
      where: {
        name,
        idBrand,
      },
    });

    if (!alredyExist) {
      await prisma.model.create({
        data: {
          idModel,
          name,
          idBrand,
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
