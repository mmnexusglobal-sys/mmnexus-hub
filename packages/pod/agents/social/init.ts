import { InstagramGuruAgent } from './InstagramGuruAgent';
import { TikTokTacticianAgent } from './TikTokTacticianAgent';
import { PinterestCuratorAgent } from './PinterestCuratorAgent';
import { FacebookWingmanAgent } from './FacebookWingmanAgent';

let initialized = false;

export function initSocialAgents() {
  if (initialized) return;
  initialized = true;
  
  console.log('🚀 Inicializando listeners de Agentes Sociales...');
  new InstagramGuruAgent().listen();
  new TikTokTacticianAgent().listen();
  new PinterestCuratorAgent().listen();
  new FacebookWingmanAgent().listen();
}
