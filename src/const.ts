/* eslint-disable @typescript-eslint/naming-convention */
export const enEmojiMap = {
  Open: "🆕",
  "In Progress": "🕐",
  Doing: "🕐",
  Resolved: "👍",
  Done: "✅",
  Closed: "🚪",
  Reopened: "🔙",
  "To Do": "📝",
  Verity: "✔️",
  "BACKLOG": "📝",
} as const;

export const zhEmojiMap = {
  待办: "🆕",
  处理中: "🕐",
  已解决: "👍",
  完成: "✅",
  已关闭: "🚪",
  重新打开: "🔙",
  待验证: "✔️",
  "需求池": "💼",
  修复中: '🛠️',
  待确认: '🕵️'
} as const;

export type statusKeys = keyof typeof zhEmojiMap | keyof typeof enEmojiMap;

export const CommitType = [
  {
    label: "cancel",
    detail: "取消"
  },
  {
    label: "feat",
    detail: "添加新特性"
  },
  {
    label: "fix",
    detail: "修复bug"
  },
  {
    label: "docs",
    detail: "仅仅修改文档"
  },
  {
    label: "style",
    detail: "仅仅修改了空格、格式缩进、逗号等等，不改变代码逻辑"
  },
  {
    label: "refactor",
    detail: "代码重构，没有加新功能或者修复bug"
  },
  {
    label: "pref",
    detail: "优化相关，比如提升性能、体验"
  },
  {
    label: "test",
    detail: "增加测试用例"
  },
  {
    label: "build",
    detail: "依赖相关的内容"
  },
  {
    label: "ci",
    detail: "ci 配置相关 例如对 k8s, docker的配置文件的修改"
  },
  {
    label: "chore",
    detail: "改变构建流程、或者增加依赖库、工具等"
  },
  {
    label: "revert",
    detail: "回滚到上一个版本"
  }
];