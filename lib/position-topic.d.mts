export type PositionTopicPresentation = {
  label: string;
  text: string;
};

export function positionTopicPresentation(
  title: string | null | undefined,
  summary: string | null | undefined
): PositionTopicPresentation;
