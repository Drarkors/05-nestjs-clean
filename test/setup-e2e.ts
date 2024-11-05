import 'dotenv/config'

import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'
import { execSync } from 'child_process'

const prisma = new PrismaClient()

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL)
    throw new Error('Plese provide a DATABASE_URL environment variable.')

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schemma', schemaId)

  return url.toString()
}

const schemaId = randomUUID()

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId)

  process.env.DATABASE_URL = databaseURL

  execSync('npx prisma migrate deploy')
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})
