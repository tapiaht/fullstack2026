import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL as string;

const adapter = new PrismaPg(new Pool({ connectionString }));

const prisma = new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  console.log('Start seeding...');

  // Upsert Pokémon to avoid creating duplicates on multiple runs
  await prisma.pokemon.upsert({
    where: { name: 'Bulbasaur' },
    update: {},
    create: {
      name: 'Bulbasaur',
      type: 'Grass / Poison',
      rarity: 'Common',
      imageUrl: 'https://placehold.co/240x330/77c958/333333?text=Bulbasaur',
    },
  });

  await prisma.pokemon.upsert({
    where: { name: 'Charmander' },
    update: {},
    create: {
      name: 'Charmander',
      type: 'Fire',
      rarity: 'Common',
      imageUrl: 'https://placehold.co/240x330/f08030/333333?text=Charmander',
    },
  });

  await prisma.pokemon.upsert({
    where: { name: 'Squirtle' },
    update: {},
    create: {
      name: 'Squirtle',
      type: 'Water',
      rarity: 'Common',
      imageUrl: 'https://placehold.co/240x330/6890f0/333333?text=Squirtle',
    },
  });
  
  await prisma.pokemon.upsert({
    where: { name: 'Pikachu' },
    update: {},
    create: {
      name: 'Pikachu',
      type: 'Electric',
      rarity: 'Rare',
      imageUrl: 'https://placehold.co/240x330/f8d030/333333?text=Pikachu',
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
