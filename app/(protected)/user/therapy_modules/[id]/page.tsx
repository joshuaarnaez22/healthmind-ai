import Module from './_components/module';

interface ModuleIdProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ModuleId({ params }: ModuleIdProps) {
  const { id } = await params;

  return <Module id={id} />;
}
