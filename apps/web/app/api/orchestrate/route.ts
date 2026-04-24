import { NextResponse } from 'next/server';
import { NexusOrchestrator } from '@/lib/agents/orchestrator';
import { initSocialAgents } from '@mmnexus/pod';

// Inicializar los listeners globalmente de forma segura
initSocialAgents();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const brandRules = body.brandRules || {
      brandName: 'M&M Nexus',
      toneOfVoice: ['Futurista', 'Profesional'],
      forbiddenWords: ['barato', 'feo'],
      colorPalette: { primary: '#000000', secondary: '#ffffff', accent: '#ff003c' },
      typography: { heading: 'Inter', body: 'Roboto' }
    };

    const orchestrator = new NexusOrchestrator(brandRules);
    const result = await orchestrator.runFullPipeline();

    if (result.status === 'failed') {
      return NextResponse.json({ success: false, error: result.reason, feedback: result.feedback }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error: any) {
    console.error('Error in orchestrator API:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
