export type CommitResult = {
  commitSha: string;
  commitUrl: string;
  filePath: string;
};

export async function commitNewFile(args: {
  path: string;
  content: string;
  commitMessage: string;
}): Promise<CommitResult> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!token) throw new Error('GITHUB_TOKEN missing');
  if (!repo) throw new Error('GITHUB_REPO missing (es. owner/name)');

  const url = `https://api.github.com/repos/${repo}/contents/${encodeURIComponent(args.path)}`;
  const body = {
    message: args.commitMessage,
    content: Buffer.from(args.content, 'utf8').toString('base64'),
    branch,
  };

  const r = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`GitHub commit failed: ${r.status} ${txt.slice(0, 300)}`);
  }
  const data = (await r.json()) as {
    commit: { sha: string; html_url: string };
    content: { path: string };
  };
  return {
    commitSha: data.commit.sha,
    commitUrl: data.commit.html_url,
    filePath: data.content.path,
  };
}
