export type VisionModelStatus = 'Architecture Ready' | 'Simulated Analysis' | 'Live Gemini Vision Active';

export interface DesignToken {
  name: string;
  category: 'color' | 'typography' | 'spacing' | 'border' | 'shadow';
  value: string;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  accent: string;
  border: string;
  extractedColors: string[];
}

export interface TypographyAnalysis {
  headingFont: string;
  bodyFont: string;
  monoFont: string;
  headingScaleRatio: number;
}

export interface SpacingAnalysis {
  containerPadding: string;
  sectionGap: string;
  cardPadding: string;
  bentoGap: string;
}

export interface LayoutBlueprint {
  layoutPattern: string; // e.g. "Bento Grid + Hero Split"
  desktopColumns: number;
  tabletColumns: number;
  mobileColumns: number;
}

export interface ComponentBlueprint {
  componentName: string;
  category: 'Navbar' | 'Hero' | 'BentoGrid' | 'Pricing' | 'Footer' | 'CTA';
  subElements: string[];
  stylingTokens: string[];
}

export interface AnimationBlueprint {
  engine: 'Framer Motion' | 'GSAP' | 'Three.js / React Three Fiber';
  pageTransitions: string;
  microInteractions: string;
}

export interface WebsiteStructure {
  navigationRoutes: string[];
  sections: string[];
  components: ComponentBlueprint[];
}

export interface VisionAnalysisResult {
  analysisId: string;
  timestamp: string;
  status: VisionModelStatus;
  palette: ColorPalette;
  typography: TypographyAnalysis;
  spacing: SpacingAnalysis;
  layout: LayoutBlueprint;
  components: ComponentBlueprint[];
  animations: AnimationBlueprint;
  transparencyNote: string;
}
