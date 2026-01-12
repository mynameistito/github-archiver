/**
 * Common test fixtures and data
 */

export const VALID_GITHUB_URLS = [
  "https://github.com/owner/repo",
  "https://github.com/owner/repo.git",
  "git@github.com:owner/repo.git",
  "owner/repo",
];

export const INVALID_GITHUB_URLS = [
  "not-a-url",
  "https://example.com/owner/repo",
  "https://github.com/owner",
  "",
  "github.com/owner/repo",
];

export const SAMPLE_REPOS = [
  { owner: "facebook", repo: "react" },
  { owner: "microsoft", repo: "typescript" },
  { owner: "nodejs", repo: "node" },
  { owner: "vuejs", repo: "vue" },
  { owner: "angular", repo: "angular" },
];

export const SAMPLE_URLS = SAMPLE_REPOS.map(
  (r) => `https://github.com/${r.owner}/${r.repo}`
);

export const SAMPLE_FILE_CONTENT = `https://github.com/facebook/react
https://github.com/microsoft/typescript
# This is a comment
https://github.com/nodejs/node

https://github.com/vuejs/vue
`;

export const TEST_TOKEN = "ghp_test_token_1234567890abcdefghij";
export const TEST_USERNAME = "testuser";
export const TEST_CONCURRENCY = 3;
export const TEST_TIMEOUT = 300;

export const MOCK_AUTH_RESPONSE = {
  valid: true,
  user: TEST_USERNAME,
};

export const MOCK_VALIDATION_RESPONSE = {
  exists: true,
  isArchived: false,
};

export const MOCK_ARCHIVED_RESPONSE = {
  exists: true,
  isArchived: true,
};

export const MOCK_NOT_FOUND_RESPONSE = {
  exists: false,
  isArchived: false,
};

export const MOCK_RATE_LIMIT_RESPONSE = {
  limit: 5000,
  remaining: 4999,
  reset: new Date(Date.now() + 3_600_000),
};
