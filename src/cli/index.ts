
import { generateSchema } from './generate-schema';
import { generatePages } from './generate-pages';

const command = process.argv[2];

switch (command) {
    case 'schema':
        console.log('Generating Prisma Schema...');
        generateSchema();
        break;
    case 'pages':
        console.log('Generating Dashboard Pages...');
        generatePages();
        break;
    default:
        console.log('Available commands:');
        console.log('  schema  - Generate prisma/schema.prisma');
        console.log('  pages   - Generate src/app/dashboard pages');
        process.exit(1);
}
