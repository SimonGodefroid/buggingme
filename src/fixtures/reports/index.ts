import { faker } from "@faker-js/faker";
import { Impact, ReportStatus, Severity } from "@prisma/client";

const MOCK_REPORT = {
  id: `${faker.database.mongodbObjectId}`,
  title: `${faker.hacker.noun()} ${faker.hacker.ingverb()}`,
  url: `${faker.internet.url().replace('https://', '')}`,
  companyId: `${faker.company.name()}`,
  steps: `1. ${faker.hacker.verb()} ${faker.hacker.noun()}\n2. ${faker.hacker.verb()} ${faker.hacker.noun()}`,
  currentBehavior: `It is currently ${faker.hacker.ingverb()} the ${faker.hacker.noun()}`,
  expectedBehavior: `It should ${faker.hacker.verb()} the ${faker.hacker.noun()}`,
  suggestions: `Try to ${faker.hacker.verb()} the ${faker.hacker.noun()}`,
  snippets: `// coucou c'est pour du js`,
  language: `javascript`,
  userId: faker.database.mongodbObjectId(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.anytime(),
  status: ReportStatus.Open,
  impact: Impact.SiteWide,
  severity: Severity.Medium,
  tags: [],
  user: {
    id: '4b380ad5-c697-4779-88d8-982b15a55ff4',
    name: 'SimonGodefroid',
    email: 'simon.godefroid@gmail.com',
    emailVerified: null,
    image: 'https://avatars.githubusercontent.com/u/17337190?v=4',
  },
  StatusHistory: [],
  company: { id: '', name: '', logo: '', domain: '' },
};