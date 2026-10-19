import { SignJWT, jwtVerify } from 'jose';

const key = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

export async function encrypt(payload: any) {
  return await new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('12h').sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, { algorithms: ['HS256'] });
  return payload;
}

export async function getDatabase() {
  const res = await fetch(`https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/database.json?ref=${process.env.GITHUB_BRANCH}`, {
    headers: { Authorization: `Bearer ${process.env.GITHUB_PAT}`, Accept: 'application/vnd.github.v3+json' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch from GitHub');
  const data = await res.json();
  return { sha: data.sha, content: JSON.parse(Buffer.from(data.content, 'base64').toString('utf-8')) };
}

export async function updateDatabase(newContent: any, sha: string, commitMessage: string) {
  const res = await fetch(`https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/database.json`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${process.env.GITHUB_PAT}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: commitMessage,
      content: Buffer.from(JSON.stringify(newContent, null, 2), 'utf-8').toString('base64'),
      sha,
      branch: process.env.GITHUB_BRANCH,
    }),
  });
  if (!res.ok) throw new Error('Failed to update GitHub');
  return await res.json();
}
