export class Milestone {
  closed_issues: number;
  open_issues: number;
  description: string;
  title: string;
  created_at: Date;
  updated_at: Date;
  html_url: string;
}

export class Release {
  tag_name: string;
  prerelease: boolean;
  body: string;
  published_at: Date;
  name: string;
  html_url: string;
}
