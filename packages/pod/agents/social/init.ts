import { InstagramGuruAgent } from './InstagramGuruAgent';
import { TikTokTacticianAgent } from './TikTokTacticianAgent';
import { PinterestCuratorAgent } from './PinterestCuratorAgent';
import { FacebookWingmanAgent } from './FacebookWingmanAgent';
import { FirebasePersistenceAgent } from '../system/FirebasePersistenceAgent';

let initialized = false;

export function initSocialAgents() {
  if (initialized) return;
  initialized = true;
  
  console.log('🚀 Inicializando listeners de Agentes Sociales y de Sistema...');
  
  // Agentes de Sistema
  new FirebasePersistenceAgent().listen();
  
  // Agentes Sociales
  new InstagramGuruAgent().listen();
  new TikTokTacticianAgent().listen();
  new PinterestCuratorAgent().listen();
  new FacebookWingmanAgent().listen();
}
