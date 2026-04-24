import {
  AmazonScout,
  CreativeDirector,
  DesignMaker,
  BrandGuardian,
  BrandGuidelines,
  SocialPublisher
} from './index';

import { InstagramGuruAgent, TechnicalFormatterAgent } from '@mmnexus/pod';
import { globalEventBus } from '@mmnexus/core';

export class NexusOrchestrator {
  private amazonScout: AmazonScout;
  private creativeDirector: CreativeDirector;
  private designMaker: DesignMaker;
  private brandGuardian: BrandGuardian;
  private instagramGuru: InstagramGuruAgent;
  private technicalFormatter: TechnicalFormatterAgent;
  private socialPublisher: SocialPublisher;

  constructor(brandRules: BrandGuidelines) {
    this.amazonScout = new AmazonScout();
    this.creativeDirector = new CreativeDirector();
    this.designMaker = new DesignMaker();
    this.brandGuardian = new BrandGuardian(brandRules);
    this.instagramGuru = new InstagramGuruAgent();
    this.technicalFormatter = new TechnicalFormatterAgent();
    this.socialPublisher = new SocialPublisher();
  }

  public async runFullPipeline() {
    console.log('🚀 Iniciando pipeline completo de M&M Nexus...');

    // 1. Inteligencia (Tendencias)
    console.log('🔍 Paso 1: Buscando tendencias...');
    const trendData = await this.amazonScout.analyzeTrends();
    
    // 2. Creación Visual
    console.log('🎨 Paso 2: Generando diseño y copy creativo...');
    const brief = await this.creativeDirector.orchestrateVision(trendData);
    const designAssets = await this.designMaker.generateAssets(brief);

    // 3. Revisión de Marca
    console.log('🛡️ Paso 3: Revisión de Brand Guardian...');
    const copyValidation = this.brandGuardian.evaluateCopy(brief.suggestedPhrases.join(' '));
    if (!copyValidation.approved) {
      console.warn('⚠️ El copy fue rechazado por Brand Guardian:', copyValidation.feedback);
      return { status: 'failed', reason: 'Brand Guardian rejected copy', feedback: copyValidation.feedback };
    }

    // 4. Emisión del Evento (Fase A)
    console.log('📡 Emitiendo evento design.approved al EventBus...');
    const designApprovedEvent = {
      eventType: 'design.approved',
      designId: `design-${Date.now()}`,
      imageUrl: designAssets.originalImageUri,
      copyVariants: {
        instagram: brief.suggestedPhrases[0] || '',
        tiktok: brief.suggestedPhrases[1] || '',
        pinterest: brief.suggestedPhrases[2] || '',
        facebook: brief.suggestedPhrases[3] || ''
      },
      niche: trendData.topNiches[0],
      timestamp: new Date().toISOString()
    };
    
    globalEventBus.emit('design.approved', designApprovedEvent);

    // 4b. Adaptación a Redes (Fallback Lineal - Fase A)
    console.log('📸 Paso 4: Adaptando para Instagram (Llamada lineal de seguridad)...');
    const formattedImage = await this.technicalFormatter.execute({ imageUri: designAssets.originalImageUri, platform: 'Instagram' });
    const instagramPost = await this.instagramGuru.execute({
      baseImageUri: formattedImage,
      concept: brief.conceptName,
      targetAudience: 'Entusiastas del Streetwear'
    });

    // 5. Publicación / Mock (paso 1 en el futuro)
    console.log('🚀 Paso 5: Preparando publicación...');
    const pubSuccess = await this.socialPublisher.publish({
      platform: 'Instagram',
      content: instagramPost
    });

    console.log('✅ Pipeline completado con éxito!');
    return {
      status: 'success',
      data: {
        trend: trendData,
        brief,
        assets: designAssets,
        instagramPost
      }
    };
  }
}
