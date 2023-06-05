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
  "需求池": "💼"
} as const;

export type statusKeys = keyof typeof zhEmojiMap | keyof typeof enEmojiMap;