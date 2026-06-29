import GoalCheckIn from './_components/goal-checkIn';

export default async function CheckInPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <GoalCheckIn id={id} />;
}
