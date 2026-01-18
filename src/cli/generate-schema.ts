
import * as fs from 'fs';
import * as path from 'path';
import { domainConfig, EntityConfig } from '../config/domain.config';
import { featuresConfig } from '../config/features.config';

const PRIMSA_SCHEMA_PATH = path.join(process.cwd(), 'prisma', 'schema.prisma');

function generateBetterAuthSchema(): string {
    if (!featuresConfig.auth.enabled) return '';

    return `

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified Boolean
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sessions      Session[]
  accounts      Account[]

  @@map("users")
}

model Session {
  id        String   @id
  userId    String
  token     String   @unique
  expiresAt DateTime
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("sessions")
}

model Account {
  id                    String    @id
  accountId             String
  providerId            String
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@index([userId])
  @@map("accounts")
}

model Verification {
  id         String   @id
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@map("verifications")
}
`;
}

function generateEntitySchema(entity: EntityConfig): string {
    const fields = entity.fields.map(field => {
        let type = field.prismaType;

        if (!type) {
            switch (field.type) {
                case 'string':
                case 'text':
                case 'image':
                    type = 'String';
                    break;
                case 'number':
                    type = 'Int'; // Default to Int, could be Float based on validation
                    break;
                case 'boolean':
                    type = 'Boolean';
                    break;
                case 'date':
                    type = 'DateTime';
                    break;
                case 'array':
                    type = 'String[]';
                    break;
                case 'json':
                    type = 'Json';
                    break;
                default:
                    type = 'String';
            }

            if (!field.required && !field.prismaType?.includes('?')) {
                type += '?';
            }
        }

        return `  ${field.name} ${type}`;
    });

    return `
model ${entity.name} {
${fields.join('\n')}

  @@map("${entity.tableName || entity.name.toLowerCase()}")
}
`;
}

export function generateSchema() {
    const header = `
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
}

datasource db {
  provider = "postgresql"
}
`;

    const authSchema = generateBetterAuthSchema();
    const entitySchema = generateEntitySchema(domainConfig.entity);

    const schema = header + authSchema + entitySchema;

    fs.writeFileSync(PRIMSA_SCHEMA_PATH, schema);
    console.log('✅ Generated prisma/schema.prisma');
}

// Execute if run directly
if (require.main === module) {
    generateSchema();
}
