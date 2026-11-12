# What AI Built 调研与方案（初版）

> 调研日期：2026-11-12（Asia/Shanghai）。所有项目、链接与指标均来自当时可公开访问的页面、仓库或论文；未编造任何条目。GitHub star 数为同日通过 GitHub API 取得的快照，会随时间变化。
>
> 本仓库对应的站点已定名为 **What AI Built**，代码仓库为 [https://github.com/heemoe/agentbuilt](https://github.com/heemoe/agentbuilt)，部署在 Cloudflare Pages，规范站点 URL 为 `https://whataibuilt.com`（`base` 为根路径 `/`）。`www.whataibuilt.com` 与 `agentbuilt.pages.dev` 会 301 到该主机的同一路径；`*.agentbuilt.pages.dev` 预览域名不跳转。站点名、域名与仓库地址集中在 `site/src/site.config.ts`。

## 1. 结论（先看这里）

现有「vibe coding / AI 产物」目录几乎都在收录**已上线的消费级应用、游戏和 SaaS**，按品类或工具浏览，用营收、投票或链接存活做排序。它们很少覆盖 kernel、编译器、数据库引擎、模拟器、浏览器引擎、GPU/TPU kernel 这类中高难度系统软件，也很少把 **harness 与底层模型分开建模**，开源协作（PR 提交 + schema 校验 + 证据链接）更不是主流。

**What AI Built 的定位**应明确互补，而不是再做一个 MissumAI：

- 收录对象：主要由 LLM / Agent harness 产出的、可公开核查的系统级或高难度项目；
- 分类轴：harness（Claude Code、Codex、Cursor、OpenCode、Gemini CLI、Antigravity、DeepSeek Harness 等）**和**底层模型，二者分开；
- 核心资产：可验证性（作者声明、官方博客、论文、commit trailer、benchmark），而不是营收榜；
- 协作方式：开源仓库 + YAML/JSON 数据 + PR 模板 + CI 校验 schema。

技术选型建议用 **Astro 静态站 + YAML 数据源**，部署到 Cloudflare Pages。理由见第 7 节：目录站以内容与筛选为主，静态生成足够快、够便宜、也方便后续接 PR 预览。

本轮共整理 **17 条**可公开核查的种子项目（见 `seed-projects.yaml`），另将 **Qwenputer** 明确排除（它不是「用 agent 写出来的软件」，而是把 RISC-V CPU 编译进模型权重的研究）。**未找到**可验证的、由 DeepSeek Harness 或 Gemini CLI **作为主要产出工具**完成的系统级项目；Google 侧的系统级演示目前能核实的是 **Antigravity + Gemini 3.5 Flash** 的 OS 实验，但没有公开源码仓库。

---

## 2. MissumAI 调研

- **网址**：[https://missumai.com/](https://missumai.com/)（2026-11-12 访问返回 HTTP 200）
- **定位**：自称 “The leaderboard of the best things shipped with AI”——给用 Cursor、Claude Code、Codex、Lovable、Replit 等工具上线的真实产品做公开排行，并把营收、证据链到来源。
- **规模（页面当时陈述，不同子页数字略有出入）**：首页约 149–150 个项目、约 40 个有核实营收、约 18 种 AI 工具、21 篇故事。分类页（约 11 月 5 日构建）写的是 128 个产品；按工具浏览页（约 11 月 10 日构建）写的是 140 个。这些是站点自己的目录计数，不是全市场统计。
- **收录标准**（[About](https://missumai.com/about)）：
  1. 产品今天必须可访问，站点会加载并定期复查链接；
  2. 须有公开陈述（作者、具名媒体或工具厂商）说明该产品主要用 AI 编程工具 / agent 构建；
  3. 数字只引用公开来源，不估算、不四舍五入、不编造；无法核实的数字直接省略。
- **分类方式**：
  - 按产品品类：Consumer apps、Marketing & growth、Creator tools、Business & B2B、Health & fitness、Productivity、Developer tools、Finance、Games、AI agents、Marketplaces & data 等；每个项目只落在一个品类。
  - 按 AI 工具：Claude Code、Cursor、OpenAI Codex、Claude、Lovable、Replit、ChatGPT、Rork、Base44、Bolt、Windsurf 等；一个项目可出现在多个工具下。
- **排名公式**（每日构建重算，公开且声明不可付费改排名）：
  `score = revenue + proof + freshness + evidence + notability + editor`
  - 营收 0–50：按折算后的月收入分档；
  - 证明 0–20：支付服务商核实 / 仪表盘截图 / 媒体 / 自评；
  - 新鲜度 0–15；
  - AI 构建证据 6–10：作者或媒体 10 分，工具厂商案例 6 分；
  - 知名度 0–40：编辑分，用于开源或高关注但非营收型项目；
  - 编辑微调 −10 到 +10，声明不出售。
- **提交流程**：[https://missumai.com/submit](https://missumai.com/submit) 或邮件 `hello@missumai.com`。必填：名称、上线 URL、AI 如何被使用；需要一条「作者公开说明 AI 构建过程」的链接。提交进收件箱，编辑审核，不保证收录。另有纠错/下架入口。Listing 免费且编辑制，不能花钱买排名；站点另有赞助/精选广告位，声明与排名分离（[Advertise](https://missumai.com/advertise)）。
- **是否开源**：按站点名称、域名在 GitHub 检索，**未找到**与 missumai.com 对应的公开源代码仓库。Analytics 使用 Vercel Web Analytics。从形态看是闭源编辑型产品，不是社区 PR 目录。
- **对「系统级开源目录」的不足**：
  1. 以直播商业产品和营收为中心，研究型 OS/编译器/kernel 很难进入（往往没有「live product URL」和 MRR）；
  2. 闭源 + 邮件/表单投稿，不利于开源协作和可复现的数据修订；
  3. 工具维度有，但几乎不建模「同一 harness 下的不同模型」；
  4. 品类是 SaaS/消费应用，不是 compiler / kernel / emulator 这类系统软件分类；
  5. 开源项目只通过 notability 加分，不是一等公民；
  6. 证据强调「有公开说法」，较少落到 commit trailer、论文、可复现 benchmark。

---

## 3. 同类站点与 Awesome 列表

### 3.1 vibecodedapps.dev + levz0r/awesome-vibecoded-apps（重点）

- 站点：[https://vibecodedapps.dev/](https://vibecodedapps.dev/)（200）
- 仓库：[https://github.com/levz0r/awesome-vibecoded-apps](https://github.com/levz0r/awesome-vibecoded-apps)（200；2026-11-12 API 快照 54 stars，CC0-1.0）
- **做法**：人工精选「用自然语言描述、与 AI 协作写成」的真实应用；站点是可浏览索引，声明每周自动检查链接，失效则修复或删除。2026-11-09 检查时 81 个条目全部 live。按平台/形态分类：macOS、iOS、Android、Windows、Linux、跨平台、Web、CLI、Games、浏览器扩展。
- **数据结构**：以 Markdown 列表为主，字段很轻——名称、一句话简介、链接，部分条目在简介里提到 Claude Code / Cursor / Codex / Copilot / Gemini。没有统一的 harness、model、evidence、human_involvement、verified 字段。
- **优点**：开源；链接检查认真；标准透明；自己也收录进列表并声明「维护者项目按同一标准评审」。
- **缺点**：偏应用和游戏，几乎没有系统软件；结构化数据弱，难以按模型筛选或做对比；可验证性停留在「简介里提到某工具」，没有证据分级。

### 3.2 ClaudeFolio（重点）

- 站点：[https://claudefolio.com/](https://claudefolio.com/)（200）
- About：[https://claudefolio.com/about](https://claudefolio.com/about)（页面写明最后更新 2026-10-29）
- **做法**：Claude Code 项目的作品集/社区目录。每名作者有 profile，每项作品有页面；人工审批（通常 24 小时内），之后社区投票和评论。有 Folio of the Week。运营方为 7H Ventures LLC（Paul Han），声明与 Anthropic 无隶属关系。
- **数据字段（About 所述）**：live URL、截图、技术栈、品类、构建指标（hours to build、从想法到上线的天数、使用的 Claude sessions）、可选 proof link；作者有头像、社交链接、认证和非开发者徽章。
- **优点**：构建过程指标比一般目录细；有 proof link；对非开发者作者友好；审核有「写清页面上看不到的故事」这一要求。
- **缺点**：只覆盖 Claude Code，无法按其他 harness / 模型对照；闭源商业社区，不是 Git 协作；对象仍是上线作品集，不是系统软件；sessions/hours 多为自报，缺少 commit 或论文级证据。

### 3.3 其他相关列表与目录（简述）

| 名称 | 链接 | 做法与要点 |
| --- | --- | --- |
| vibcod.dev | [https://vibcod.dev/](https://vibcod.dev/) | 「vibe-coded software」人工策展库（当时约 68 个项目）。用自研 vibe-index（点击、vibe-check、新鲜度等）排序。偏应用/工具/游戏。 |
| YourAIProject | [https://youraiproject.com/](https://youraiproject.com/) | 可提交上线的 vibe 项目（URL、截图、栈、故事），并展示 GitHub Trending History。偏发现，结构化证据弱。 |
| VibeAtlas | [https://getvibeatlas.com/](https://getvibeatlas.com/) | 人工编辑，要求可访问产品、真实截图、披露构建工具；按品类或工具（Bolt、Lovable、Cursor、Windsurf、Claude Code 等）浏览。 |
| Vibe Hackers | [https://www.vibehackers.ai/](https://www.vibehackers.ai/) | 策展目录，强调 maker story 与 traction；可见游戏 jam 作品较多。 |
| vibedprojects.com | [https://vibedprojects.com/](https://vibedprojects.com/) | 按项目/作者/工具浏览；可用投票、收藏、点击排序；允许提交他人项目后再由作者认领。 |
| Showcase.md | [https://showcase.md/](https://showcase.md/) | 较大的 vibe 项目发现站，约每 6 小时更新，部分来源为 X 帖文；体量大但策展与证据深度一般。 |
| JefferyLee/awesome-vibe-coded-apps | [https://github.com/JefferyLee/awesome-vibe-coded-apps](https://github.com/JefferyLee/awesome-vibe-coded-apps) | 由 One's Vibe 生成的超大列表（页面曾写 21,857 个应用，约 3 天轮询存活）。规模大，但是机器存活检查，不是系统软件目录，也不是深度证据库。 |
| awesome-vibe-coding | [https://github.com/awesome-vibe-coding/awesome-vibe-coding](https://github.com/awesome-vibe-coding/awesome-vibe-coding) | 收的是 **工具和资源**（Bolt、Lovable、v0 等），不是「agent 写出的项目」。 |
| awesome-ai-built-games | [https://github.com/lappemic/awesome-ai-built-games](https://github.com/lappemic/awesome-ai-built-games) | 可玩的 AI 编写游戏，按类型分组，部分标注工具与引擎。 |
| shipped-with-ai / vibeking.fun | [https://github.com/0xvibly/awesome-vibe-coded-apps](https://github.com/0xvibly/awesome-vibe-coded-apps) | 从 vibeking.fun API 每日生成的快照，社区 upvote，体量大、字段浅。 |
| BitsExplorer（OpenCode） | [https://bitsexplorer.com/built-with/opencode](https://bitsexplorer.com/built-with/opencode) | 用 OpenCode 写入 commit 的 `Co-Authored-By: opencode` trailer 做证据，而不是自评徽章。这对 What AI Built 的可验证性设计有参考价值。 |

**共同缺口**：消费级产品多、系统软件少；harness 与模型不分；开源 PR 工作流少；证据分级弱。这正是 What AI Built 要补的位置。

---

## 4. 种子项目调研

每条的完整字段见 `seed-projects.yaml`。下面只记要点、证据和需要标明的限制。所有列出的 URL 均用 `curl -L` 确认过 HTTP 状态（除另行说明外为 200）。Star 数为 2026-11-12 的 GitHub API 快照。

### 4.1 收录的 17 个项目（亮点在前）

1. **Ginux**（非 Claude，OS/kernel，亮点）  
   Codex + GPT-5.6 Sol。Gregory Kurtzer（Rocky Linux 作者）用 Human-Directed Agentic Engineering，在约 11 天内做出可引导的 Rust 研究内核，并跑过部分未修改的 Alpine / Rocky Linux userspace。主仓库现已转向 userspace kernel；可引导内核研究阶段保留在 `bootable-kernel` 分支。论文仍可在该分支读到。主仓库 583 stars。
2. **MaxKernel**（非 Claude，TPU kernel，亮点）  
   论文 [arXiv:2609.04523](https://arxiv.org/abs/2609.04523) 描述面向 TPU 的多 agent kernel 生成系统，实验使用 **Gemini 3.1 Pro**，代码在 [AI-Hypercomputer/accelerator-agents](https://github.com/AI-Hypercomputer/accelerator-agents) 的 `maxkernel/`（103 stars）。有 JaxBench 等评估陈述。
3. **Google Antigravity OS 实验**（非 Claude，OS，亮点，但无公开源码）  
   [官方博客 2026-05-19](https://antigravity.google/blog/google-antigravity-built-an-os) 称 93 个 subagent、Gemini 3.5 Flash、单条 prompt 做出能跑 FreeDoom 的内核/驱动/文件系统，并给出 token 与成本数字。官方明确列出能力限制。**未找到**该 OS 的公开仓库，故 `verified` 标为 `official_claim_no_source`。
4. **Rabbit**（OpenCode，kernel，亮点）  
   Linux ABI 兼容的 Rust 内核。README 写明「代码由 AI agent 按人类设定的里程碑编写」。抽查近期 commit 带有 `Co-Authored-By: opencode <noreply@opencode.ai>` trailer，与 BitsExplorer 的说法一致。仓库目前仅 1 star，仍值得收录，因为 harness 证据链相对硬。
5. **MiniSQLite**（Cursor，数据库）  
   官方仓库 [cursor/minisqlite](https://github.com/cursor/minisqlite)（292 stars）：用 Rust 重写 SQLite 方言、执行器、事务与磁盘格式，约 20 万行、5,650 测试。仓库 README 本身几乎不谈作者是 agent。Cursor 官方账号的 LinkedIn 帖声明「用一轮 agent 团队根据 835 页手册重写 SQLite」。证据层级记为官方声明 + 官方仓库，但 README 未自证。
6. **FastRender**（Cursor，浏览器引擎）  
   [wilsonzlin/fastrender](https://github.com/wilsonzlin/fastrender)（1,579 stars）。README 写明该引擎是 [Cursor《Scaling Agents》研究](https://cursor.com/blog/scaling-agents) 的一部分。从零实现 HTML/CSS/layout/paint，并嵌入 JS 引擎。
7. **Cursor × NVIDIA GPU kernels**（Cursor，GPU kernel）  
   [官方博客 2026-04-14](https://cursor.com/blog/multi-agent-kernels) 称多 agent 系统在 3 周内为 Blackwell 优化 235 个 CUDA kernel，几何平均加速 38%。结果仓库 [anysphere/kernel-optimization-results](https://github.com/anysphere/kernel-optimization-results)（10 stars，已确认 200）。
8. **one-agent-one-browser**（Codex，浏览器）  
   [embedding-shapes/one-agent-one-browser](https://github.com/embedding-shapes/one-agent-one-browser)（228 stars；默认分支为 `master`，`main` 上的 raw README 会 404）。作者文章 [emsh.cat，2026-01-27](https://emsh.cat/en/one-human-one-agent-one-browser/) 写明与 **Codex** 一起在约三天内做成无第三方 Rust crate 的 HTML/CSS 浏览器。仓库 README 本身未写工具名。
9. **CCC（Claude’s C Compiler）**（Claude，编译器，标杆）  
   [anthropics/claudes-c-compiler](https://github.com/anthropics/claudes-c-compiler)（2,828 stars）与 [Anthropic 研究博文](https://www.anthropic.com/research/building-c-compiler)。16 个并行 Claude Code（Opus 4.6）从零写 Rust C 编译器，能编 Linux 6.9 等。人类只写测试、不结对调试。这是证据最完整的 Claude 标杆，尽管本轮种子更偏向非 Claude。
10. **JSSE**（Claude Code，JS 引擎）  
    [pmatos/jsse](https://github.com/pmatos/jsse)（74 stars）与[作者博文 2026-03-17](https://p.ocmatos.com/blog/jsse-a-javascript-engine-built-by-an-agent.html)。作者称零行手写 Rust，Claude Code YOLO 模式，42 天通过全部非 staging 的 test262（98,426 项），约 17 万行，人类上手约 4 小时。
11. **VibeSQL**（Claude Code + Loom，数据库）  
    [rjwalters/vibesql](https://github.com/rjwalters/vibesql)（34 stars）。README 写 “100% AI-generated”，由 Claude Code 与 Loom 编排；自称 SQL:1999 core 739/739 及大规模 sqllogictest。有符合性页面 [vibesql.org](https://vibesql.org/)。
12. **vibix**（Claude Code + Cursor，kernel）  
    [dburkart/vibix](https://github.com/dburkart/vibix)（5 stars）。README 写几乎完全由 Claude 与 Cursor agent 按 issue→PR→review→merge 循环编写的 Rust x86_64 内核，仓库内有 `.claude/skills` 与 Cursor Cloud skill。
13. **ZeroWeb**（harness 未具名，浏览器）  
    [leizongmin/ZeroWeb](https://github.com/leizongmin/ZeroWeb)（9 stars）与 [zeroweb.leizm.com](https://zeroweb.leizm.com/)（站点当时写 15,100+ 次 AI 自主提交，全量 WPT 子测试通过率 78.85%，统计日期 2026-11-11）。明确「人只做设计、决策和验证，代码几乎全由 AI 写」，**首页与 README 均未写出具体 harness/模型**。因此 harness/model 记为 `unknown`，不要猜测。
14. **ForgeKernel**（自有 harness，可用 Claude Code 启动；产出为 GPU kernel）  
    [OpenBMB/ForgeKernel](https://github.com/OpenBMB/ForgeKernel)（312 stars）与 [arXiv:2611.04998](https://arxiv.org/abs/2611.04998)（2026-11-03）。自演化 GPU kernel agent，论文称在 Hopper/Blackwell 上 27 个算子中达到或超过多数专家库实现。README 写论文实验用 Claude Fable 5.1 做 arch agent、Claude Opus 5 做 coding agent；生成的 kernel 发布在 `kernels/`。它既是 agent 系统，也是「agent 写出的 kernel」集合。
15. **KernelSeek**（Claude Code + Cursor，GPU kernel；**公开仓库 URL 未找到**）  
    论文 [arXiv:2611.03517](https://arxiv.org/abs/2611.03517)《Ask, Don't Equip》。问题驱动的 CUDA 优化 agent，报告 dependency-free 的 FlashAttention 前向 kernel：Hopper 上相对 FA3 几何平均 1.16×，Blackwell 上相对 FA4 1.46×（论文表格，须按原文理解场景集合）。文中写 kernel 全部由 agent 编写，会话使用 Claude Code（claude-opus-4-8 / claude-opus-5）与 Cursor。论文声称将发布 kernel、harness、question bank 与全部 traces，但在 arXiv / Hugging Face Papers 上**没有找到**可访问的 GitHub 仓库 URL。条目保留，`repo_url` 为空，`verified: paper_claimed_release_not_found`。
16. **Machina**（Claude + Codex，模拟器）  
    规范化仓库取 [gevico/machina](https://github.com/gevico/machina)（38 stars，README 中的 clone URL；`mvanhorn/machina` 同样 200 且内容同类，但 API 显示 0 stars，更像是镜像/个人拷贝）。自称 Rust RISC-V 全系统模拟器（含 JIT），「主要由人类与 AI agents（Claude、Codex）协作开发」。人类参与度高于「几乎全自动」的项目，应标为协作而非全自主。
17. **Claude Fable 5.2 OS 实验**（Claude，OS，无公开源码）  
    [Anthropic 官方 Fable/Mythos 5.2 介绍页](https://www.anthropic.com/claude-fable-and-mythos-5-2) 写：一名工程师从空目录出发，Fable 5.2 协调超过 1,000 个 subagent、约八天，做出可在笔记本上引导的原型 OS（含内核/核心、磁盘/键盘/网络驱动、持久存储、窗口、登录、安装器及内置 Claude）。**未找到**官方源码仓库。`robiot/fable-os` 名称相近，检索中不能将其等同于该实验，故不收录为同一项目。

### 4.2 专门检索但排除或未找到的对象

- **Qwenputer**（[divagr18/qwenputer](https://github.com/divagr18/qwenputer)，800 stars，200）  
  作者博客与 README 说明：这是把 32-bit RISC-V CPU **编译进** Qwen3.5-4B 权重的实验模型，用 Gated DeltaNet 状态当 RAM，能在前向中跑 C / MicroPython。它不是「某个 harness 写出来的 OS/编译器」，因此**不纳入种子目录**。相关的 qwenGPU 同样是「把 GPU 电路编进权重」，也不符合本目录定义。
- **DeepSeek Harness 产出的系统级项目**：找到了 harness 本身 [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)，但**没有找到**作者或官方声明「主要用 dsh 写出」的 kernel / 编译器 / OS / 数据库 / 模拟器。
- **Gemini CLI 产出的系统级项目**：没有找到足够干净的作者声明。Google 侧能核实的系统级演示是 **Antigravity**（不是 Gemini CLI）的 OS 实验。检索中遇到的 linuxos-ai、muchovha-agentic-os 等更像「用 Gemini 做运维/代理层」，不是「用 Gemini CLI 从零写出内核」，本轮不收。
- **Symphony**（[openai/symphony](https://github.com/openai/symphony)，28,012 stars）：这是 OpenAI 的 agent 工作编排系统。官方 README 让读者「用喜欢的 coding agent 按 SPEC.md 实现」，并提供 Elixir 参考实现；**官方 README 并未清楚宣称该参考实现本身是 Codex 一次性生成的系统软件**。第三方博客有类似说法，但作为种子证据不够硬，且项目类别是 harness 而非 OS/编译器。本轮不收入种子，只在调研中注明。
- **公开的 Antigravity / Fable OS 源码**、**KernelSeek 的 GitHub 仓库**：查不到，已在对应条目标注。

---

## 5. 分类体系与可验证性分级

### 5.1 Harness（工具层，可多选）

`claude-code`、`codex`、`cursor`、`opencode`、`gemini-cli`、`antigravity`、`deepseek-harness`、`loom`、`custom`（论文/机构自研 harness，如 ForgeKernel、MaxKernel、KernelSeek）、`unknown`。

允许一个项目挂多个 harness。不要把「Claude 网页聊天」和「Claude Code」混成一个值；无法区分时用更粗的值并在 notes 说明。

### 5.2 Model（模型层，可多选，与 harness 分开）

例如 `claude-opus-4.6`、`claude-opus-5`、`claude-fable-5.1`、`claude-fable-5.2`、`gpt-5.6-sol`、`gemini-3.1-pro`、`gemini-3.5-flash`。未知则 `unknown`。站点应能「只看 Codex 的项目」或「只看 Gemini 3.5 Flash 的项目」。

### 5.3 Category

`compiler`、`kernel`、`os`、`database`、`emulator`、`browser-engine`、`js-engine`、`gpu-kernel`、`tpu-kernel`、`migration`、`other`。

`os` 与 `kernel` 可同时出现（例如既是内核又声称完整 OS）。本轮未收入足够干净的「大仓库迁移/重写」种子（有传闻级例子但证据不足）。

### 5.4 Difficulty

`medium` / `high` / `very-high`。判断依据是问题领域（从零写编译器/内核/引擎通常为 very-high）、公开的测试或 benchmark、以及作者自己的范围声明。这是编辑判断，不是分数。

### 5.5 Human involvement

- `autonomous_multi_agent`：多 agent 长时间运行，人类很少改代码（CCC、Antigravity OS 声明、Cursor kernel 实验等）。
- `steered_agent`：人类提方向、验收、提问，但基本不写实现（JSSE、KernelSeek、Ginux 的 HDAE、ZeroWeb 声明）。
- `pair`：人类与 agent 结对，双方都深度参与（Machina、one-agent-one-browser）。
- `unknown`。

### 5.6 Verified 分级（可验证性，核心设计）

| 值 | 含义 |
| --- | --- |
| `verified` | 官方或作者第一方声明，并且有可打开的仓库或可核对的工件（代码、kernel 文件、benchmark 说明）。 |
| `official_claim_no_source` | 官方博客/公告描述了实验，但没有公开源码。前台卡片与详情页统一显示「未验证 / Unverified」徽章，并可用验证状态筛选；侧栏仍展示本分级。 |
| `author_claimed` | 作者 README/博客有明确声明，仓库可访问，但缺少官方机构背书或独立复现。 |
| `commit_attribution` | 除作者声明外，还有 commit trailer / Co-Authored-By 等机械证据。 |
| `paper_claimed_release_not_found` | 论文声称会发布代码，公开仓库 URL 尚未找到。 |
| `unverified` | 只有二手转述，没有第一方证据。本轮种子不收录这一档。 |

证据对象本身再按 `type` 记录：`official_blog`、`official_repo`、`author_readme`、`author_blog`、`paper`、`commit_trailer`、`benchmark`。

---

## 6. 数据 Schema 要点

权威数据文件是仓库根目录的 `seed-projects.yaml`（也作为站点构建时的数据源）。JSON Schema 在 `schema/project.schema.json`。关键字段：

- `id`、`name`、`summary.{en,zh}`、`description.{en,zh}`（缺 zh 时回退到 en）
- `repo_url`、`homepage_url`、`article_urls[]`
- `harnesses[]`、`models[]`、`categories[]`、`difficulty`
- `evidence[]`：`type`、`url`、`quote`、`accessed`
- `human_involvement`、`human_involvement_notes.{en,zh}`
- `verified`、`stars`、`stars_checked_at`、`license`、`languages[]`
- `status`（`active` / `research` / `no_public_source` / `preserved_branch`）
- `listed_at`、`first_public_at`（若确定）、`notes.{en,zh}`

设计选择：harness 与 model 都是数组；不把「营收」当作一等字段（与 MissumAI 刻意区别）；`stars` 必须带抓取时间；允许 `repo_url: null`（官方实验但未开源）。

---

## 7. 技术选型

**推荐并已采用 Astro（静态输出）+ YAML + Cloudflare Pages。**

理由：

1. 目录站几乎全是只读内容、筛选和 SEO，不需要默认的服务端运行时；
2. Astro 自带 i18n 路由（英文在根路径，简体中文在 `/zh/`），符合本轮需求；
3. Markdown/YAML 天然适合 PR 贡献，CI 只须校验 schema 和链接；
4. 构建产物是静态文件，预览、缓存和部署都简单；
5. 以后若要做登录、提交表单或自动拉 stars，可以再加一个轻量 endpoint 或 GitHub Action 回写 YAML，不必一开始就上 Next.js。

**不优先选 Next.js 的原因**：也能做，但对当前信息架构偏重；需要额外处理 SSG/i18n/sitemap。若未来要做账户体系或复杂交互，可以再评估迁移或在同一 monorepo 加应用。

部署已定为 **Cloudflare Pages**，规范站点 URL 为 `https://whataibuilt.com`，`base` 为 `/`。`www.whataibuilt.com` 与 `agentbuilt.pages.dev` 301 到该主机；预览子域不跳转。构建设置：根目录 `site`，命令 `npm run build`，输出 `dist`；详见 `site/wrangler.toml` 与 README。

---

## 8. 贡献流程（详见 CONTRIBUTING.md）

1. Fork / 开分支，在 `seed-projects.yaml` 追加一条（或提交修正）；
2. `summary` 至少提供英文；中文可选，缺则回退英文；
3. 必须给出至少一条第一方证据 URL（README、官方博客、论文、可查询的 commit）；
4. 打开 PR，使用模板填写 harness、model、category、verified 建议值；
5. CI：用 JSON Schema 校验；可选检查 URL 非 404；可选用 GitHub API 刷新 stars（Action 写回或构建时读取，需讨论，见决策点）；
6. 维护者核对证据分级后再合并。

---

## 9. 原型说明

最小可运行站点在 `site/`：

- 首页：按 harness、模型、难度、类别筛选；
- `/harness/[id]`、`/zh/harness/[id]`：按 harness 分类；
- `/project/[slug]`、`/zh/project/[slug]`：项目详情（含 JSON-LD `SoftwareSourceCode`）；
- `/compare`、`/zh/compare`：勾选 2–3 个项目并排对比；
- 英文为默认语言（根路径），简体中文在 `/zh/`；UI 文案在字典文件；语言切换器保留当前页面；
- SEO：每页独立 title/description、canonical、hreflang、Open Graph、Twitter Card、默认 1200×630 OG 图、首页 `WebSite` JSON-LD、`@astrojs/sitemap`（含 i18n）、robots.txt、新收录 RSS；
- 品牌：`assets/` 与 `site/public/` 中的 SVG Logo、favicon（SVG + 32/180 PNG）。预览图见 `/workspace/llm-showcase/logo-preview.png`。

本地运行（在 `site/` 目录）：

```bash
npm install
npm run build    # 生产构建，用于验证
npm run dev      # 开发
npm run preview  # 预览构建结果
```

因 `base` 为根路径 `/`，本地预览路径是 `http://localhost:<port>/` 与 `http://localhost:<port>/zh/`。

---

## 10. 需要用户拍板的决策点

1. **正式名称与域名**：**名称已定为 What AI Built**，仓库 `heemoe/agentbuilt`。**部署已定为 Cloudflare Pages**，规范站点 URL 为 `https://whataibuilt.com`，`base` 为 `/`。
2. **是否收录「官方实验但无源码」的条目**（Antigravity OS、Fable OS 等）：**已决定保留收录**。列表卡片与详情页统一显示「未验证 / Unverified」徽章；首页可按验证状态筛选（已核实工件 / 作者声明 / Commit 归因 / 未验证）。详情侧栏与对比表仍保留精确分级（如 `official_claim_no_source`）。同类无公开工件的 `paper_claimed_release_not_found`（如 KernelSeek）同样使用该徽章，并归入「未验证」筛选项。
3. **ZeroWeb、MiniSQLite 这类「第一方声明不完整」的条目如何展示**：ZeroWeb 未写 harness/模型；MiniSQLite 官方 README 不谈 agent，声明在公司社交媒体。是否要求「仓库内必须自述」才能标 `verified`。
4. **Stars 更新策略**：构建时拉取、每日 Action 回写，还是只保留提交时的快照。
5. **是否接受二手证据**（BitsExplorer trailer、媒体报道）作为主要依据。本轮仅把 trailer 作为 Rabbit 的补充，不单独靠媒体收项目。
6. **语言范围**：现在只有 en + zh。是否需要繁体或其他语言，只是加字典，但要有人维护译文。
7. **部署目标**：**已定为 Cloudflare Pages**，规范 URL 为 `https://whataibuilt.com`。

---

## 11. 查不到或存疑的地方（请勿把下列内容当成既成事实）

- MissumAI、ClaudeFolio、多数 vibe 目录：**没有找到公开源代码**。
- KernelSeek：论文承诺发布代码与 traces，**未找到仓库 URL**。
- Antigravity OS 与 Fable 5.2 OS：**官方有文字（及 Fable 页称有视频），无公开源码**。不要把名称相近的第三方仓库当成官方产物。
- Qwenputer：**查到了，但不符合「agent 产出项目」定义**，已排除。
- DeepSeek Harness、Gemini CLI：作为 **harness 分类预留了**，但本轮没有合格的系统级种子。
- MiniSQLite 的「从手册重写」细节主要来自 Cursor 官方 LinkedIn 帖与二手报道，仓库 README 未复述；若该帖不可访问，证据会变弱。
- FastRender / Cursor kernel 实验的「代码有多少是人类写的」没有逐行比例，只有研究博文与仓库声明。
- ZeroWeb 的具体模型与 harness **未知**，不要补写成 Claude 或 Cursor。
- 部分 GitHub 页面的 star 数在 WebFetch 摘要里显示为 0，与 API 快照不一致；**以 API 快照为准**，并注明日期。
- `mvanhorn/machina` 与 `gevico/machina` 内容同类，本目录以 README 中的 clone URL `gevico/machina` 为准。
- Ginux 论文从 `main` 上移除（`blob/main/docs/paper/...` 现为 404），但仍可在 `bootable-kernel` 分支打开。
- 检索中出现过「Claude Fable 5.2 写出 OS」的媒体转述；事实来源以 Anthropic 官网为准，不引用媒体自行发挥的数字。

---

## 12. 下一步计划

1. 部署与无源码条目展示均已按决定落地（Cloudflare Pages +「未验证」徽章与筛选）；
2. 给 ZeroWeb 等 `unknown` 条目继续找第一方 harness/模型说明（若作者后续补充）；
3. 周期性复查 KernelSeek 是否公开仓库；
4. 增加 CI：schema 校验、链接检查、可选 stars 刷新；
5. 补充 PR 模板与 `good first issue` 级的数据贡献指南；
6. 若要更强的可验证性，可学习 BitsExplorer，对支持 trailer 的 harness（如 OpenCode）做 commit 扫描；
7. 再寻 OpenCode / Gemini CLI / DeepSeek Harness 的系统级案例，避免目录过度偏向 Claude/Cursor。
