# skill-optimizer

A Claude Code skill that audits how well an agent followed a skill by analyzing the session JSONL transcript.

## What It Does

After any skill-driven agent run, point this at the transcript and the skill file. It:

1. Parses the JSONL transcript to extract what the agent actually did
2. Reads the SKILL.md to understand what the agent was supposed to do
3. Scores 5 dimensions (1–10 each): trigger accuracy, step coverage, reference accuracy, execution quality, output match
4. Writes a findings report with the root cause of any gaps
5. Generates an exact diff patch to improve the skill for next time
6. Tracks scores over time in a history file so you can see if the skill is improving

## Installation

Already included in this agent, in `.claude/skills/skill-optimizer/`.

## Usage

In Claude Code:

```
Run skill-optimizer on <transcript from logs/activity.ndjson> against .claude/skills/<skill-name>/SKILL.md
```

## Output

```
skill-improvement/
  <skill-name>/
    YYYY-MM-DD-HH-analysis.md    ← scores + findings
    YYYY-MM-DD-HH-diff.patch     ← exact suggested changes to SKILL.md
    history.json                 ← trend data across all runs
```

## Requirements

None. The agent reads the transcript and applies approved changes with its own tools, on Mac and Windows.

## License

MIT
