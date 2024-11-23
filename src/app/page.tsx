import { ModuleLoader } from '@/lib/moduleLoader';

export default async function Home() {
  const moduleLoader = ModuleLoader.getInstance();
  await moduleLoader.loadModules();
  const modules = moduleLoader.getAllModules();

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Dynamic Modules System</h1>
      
      <div className="grid gap-4">
        <h2 className="text-xl font-semibold">Loaded Modules:</h2>
        {modules.map(([name, module]) => (
          <div key={name} className="p-4 border rounded-lg">
            <h3 className="font-medium">{name}</h3>
          </div>
        ))}
      </div>
    </main>
  );
}