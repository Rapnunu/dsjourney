import { AlertTriangle } from "lucide-react";
import type { DifficultTopic } from "../data";
import { DIFFICULTY_LABELS } from "../../sessions/types";

interface DifficultTopicsProps {
  topics: DifficultTopic[];
}

export function DifficultTopics({ topics }: DifficultTopicsProps) {
  return (
    <div className="rounded-[10px] border border-border-subtle bg-bg-surface p-5">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={16} className="text-brand-teal" />
        <h3 className="text-sm font-semibold text-text-primary">
          Difficult Topics
        </h3>
      </div>

      {topics.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-text-secondary">
            No difficult topics identified yet.
          </p>
          <p className="mt-1 text-xs text-text-muted">
            Difficulty insights will appear as you log study sessions.
          </p>
        </div>
      ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="text-left py-2 pr-4 text-xs font-medium text-text-muted">
                Topic
              </th>
              <th className="text-left py-2 pr-4 text-xs font-medium text-text-muted">
                Category
              </th>
              <th className="text-right py-2 text-xs font-medium text-text-muted">
                Avg Difficulty
              </th>
            </tr>
          </thead>
          <tbody>
            {topics.map((topic) => {
              const diffLevel = Math.round(topic.avgDifficulty) as 1 | 2 | 3 | 4 | 5;
              const diffConfig = DIFFICULTY_LABELS[diffLevel];

              return (
                <tr
                  key={topic.topicName}
                  className="border-b border-border-subtle/50 last:border-b-0"
                >
                  <td className="py-2.5 pr-4 font-medium text-text-primary">
                    {topic.topicName}
                  </td>
                  <td className="py-2.5 pr-4 text-text-secondary">
                    {topic.category}
                  </td>
                  <td className="py-2.5 text-right">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium ${diffConfig.bgColor} ${diffConfig.color}`}
                    >
                      {topic.avgDifficulty}
                      <span className="text-[10px] opacity-60">/ 5</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}
