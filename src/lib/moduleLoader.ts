import fs from 'fs/promises';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ModuleLoader {
  private static instance: ModuleLoader;
  private loadedModules: Map<string, any> = new Map();
  private modulesPath = path.join(process.cwd(), 'modules');

  private constructor() {}

  static getInstance(): ModuleLoader {
    if (!ModuleLoader.instance) {
      ModuleLoader.instance = new ModuleLoader();
    }
    return ModuleLoader.instance;
  }

  async loadModules() {
    const enabledModules = await prisma.module.findMany({
      where: { enabled: true },
    });

    for (const module of enabledModules) {
      try {
        const modulePath = path.join(this.modulesPath, module.path);
        const moduleContent = await fs.readFile(modulePath, 'utf-8');
        
        // Dynamic import for ESM modules
        const moduleUrl = `data:text/javascript;base64,${Buffer.from(moduleContent).toString('base64')}`;
        const loadedModule = await import(moduleUrl);
        
        this.loadedModules.set(module.name, loadedModule.default);
        console.log(`Module ${module.name} loaded successfully`);
      } catch (error) {
        console.error(`Error loading module ${module.name}:`, error);
      }
    }
  }

  getModule(name: string) {
    return this.loadedModules.get(name);
  }

  getAllModules() {
    return Array.from(this.loadedModules.entries());
  }
}