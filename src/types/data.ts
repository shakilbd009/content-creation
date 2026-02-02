export interface AgentData {
  name: string;
  label: string;
  toolUses: number;
  tokens: number;
  color: string;
  subTask?: string;
}

export interface SeverityRow {
  label: string;
  count: number;
  color: string;
}

export interface TaskItemData {
  id: string;
  category: string;
  label: string;
  color: string;
}

export interface CodeSnippetData {
  task: number;
  code: string;
  file: string;
}

export interface CriticalIssueData {
  validator: string;
  finding: string;
}

export interface TableColumn {
  key: string;
  label: string;
  width: number;
  color?: string;
}
