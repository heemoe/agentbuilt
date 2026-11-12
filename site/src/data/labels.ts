import type { Locale } from "../site.config";

const harness: Record<string, { en: string; zh: string }> = {
  "claude-code": { en: "Claude Code", zh: "Claude Code" },
  codex: { en: "Codex", zh: "Codex" },
  cursor: { en: "Cursor", zh: "Cursor" },
  opencode: { en: "OpenCode", zh: "OpenCode" },
  "gemini-cli": { en: "Gemini CLI", zh: "Gemini CLI" },
  antigravity: { en: "Google Antigravity", zh: "Google Antigravity" },
  "deepseek-harness": { en: "DeepSeek Harness", zh: "DeepSeek Harness" },
  loom: { en: "Loom", zh: "Loom" },
  custom: { en: "Custom harness", zh: "自研 Harness" },
  unknown: { en: "Unknown harness", zh: "Harness 未知" },
};

const category: Record<string, { en: string; zh: string }> = {
  compiler: { en: "Compiler", zh: "编译器" },
  kernel: { en: "Kernel", zh: "内核" },
  os: { en: "Operating system", zh: "操作系统" },
  database: { en: "Database", zh: "数据库" },
  emulator: { en: "Emulator", zh: "模拟器" },
  "browser-engine": { en: "Browser engine", zh: "浏览器引擎" },
  "js-engine": { en: "JavaScript engine", zh: "JavaScript 引擎" },
  "gpu-kernel": { en: "GPU kernel", zh: "GPU kernel" },
  "tpu-kernel": { en: "TPU kernel", zh: "TPU kernel" },
  migration: { en: "Migration / rewrite", zh: "迁移 / 重写" },
  other: { en: "Other", zh: "其他" },
};

const difficulty: Record<string, { en: string; zh: string }> = {
  medium: { en: "Medium", zh: "中等" },
  high: { en: "High", zh: "高" },
  "very-high": { en: "Very high", zh: "极高" },
};

const verified: Record<string, { en: string; zh: string }> = {
  verified: { en: "Verified artifact", zh: "已核实工件" },
  official_claim_no_source: { en: "Official claim, no source", zh: "官方声明，无源码" },
  author_claimed: { en: "Author claimed", zh: "作者声明" },
  commit_attribution: { en: "Commit attribution", zh: "Commit 归因" },
  paper_claimed_release_not_found: { en: "Paper release not found", zh: "论文声称发布但未找到仓库" },
  unverified: { en: "Unverified", zh: "未验证" },
};

const human: Record<string, { en: string; zh: string }> = {
  autonomous_multi_agent: { en: "Autonomous multi-agent", zh: "多 Agent 自主运行" },
  steered_agent: { en: "Steered agent", zh: "人类引导的 Agent" },
  pair: { en: "Human–agent pair", zh: "人机结对" },
  unknown: { en: "Unknown", zh: "未知" },
};

const status: Record<string, { en: string; zh: string }> = {
  active: { en: "Active", zh: "活跃" },
  research: { en: "Research", zh: "研究" },
  no_public_source: { en: "No public source", zh: "无公开源码" },
  preserved_branch: { en: "Preserved branch", zh: "分支留存" },
};

const evidenceType: Record<string, { en: string; zh: string }> = {
  official_blog: { en: "Official blog", zh: "官方博客" },
  official_repo: { en: "Official repository", zh: "官方仓库" },
  author_readme: { en: "Author README", zh: "作者 README" },
  author_blog: { en: "Author blog", zh: "作者博客" },
  paper: { en: "Paper", zh: "论文" },
  commit_trailer: { en: "Commit trailer", zh: "Commit trailer" },
  benchmark: { en: "Benchmark / dashboard", zh: "基准 / 看板" },
  official_social: { en: "Official social post", zh: "官方社交帖" },
};


export const unverifiedStatuses = [
  "official_claim_no_source",
  "paper_claimed_release_not_found",
  "unverified",
] as const;

export function isUnverifiedStatus(id: string): boolean {
  return (unverifiedStatuses as readonly string[]).includes(id);
}

export function verifiedBadgeLabel(id: string, locale: Locale): string {
  if (isUnverifiedStatus(id)) return locale === "zh" ? "未验证" : "Unverified";
  return pick(verified, id, locale);
}

export const verifiedFilterValues = [
  "verified",
  "author_claimed",
  "commit_attribution",
  "unverified",
] as const;

export const harnessOrder = [
  "claude-code",
  "codex",
  "cursor",
  "opencode",
  "gemini-cli",
  "antigravity",
  "deepseek-harness",
  "loom",
  "custom",
  "unknown",
];

function pick(table: Record<string, { en: string; zh: string }>, id: string, locale: Locale): string {
  const row = table[id];
  if (!row) return id;
  return locale === "zh" ? row.zh : row.en;
}

export const labels = {
  harness: (id: string, locale: Locale) => pick(harness, id, locale),
  category: (id: string, locale: Locale) => pick(category, id, locale),
  difficulty: (id: string, locale: Locale) => pick(difficulty, id, locale),
  verified: (id: string, locale: Locale) => pick(verified, id, locale),
  human: (id: string, locale: Locale) => pick(human, id, locale),
  status: (id: string, locale: Locale) => pick(status, id, locale),
  evidenceType: (id: string, locale: Locale) => pick(evidenceType, id, locale),
  model: (id: string) => (id === "unknown" ? id : id),
};
