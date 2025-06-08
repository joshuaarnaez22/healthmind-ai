import React from 'react';
// import Module from '../_components/module';

interface ModuleOverviewProps {
  params: {
    moduleId: string;
  };
}

export default async function ModuleOverView({ params }: ModuleOverviewProps) {
  return (
    <div>
      {/* <Module moduleData={moduleData} moduleId={params.moduleId} /> */}
      ModuleOverView {params.moduleId}
    </div>
  );
}
