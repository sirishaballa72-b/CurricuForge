
export interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  topics: string[];
}

export interface LearningOutcome {
  id: string;
  text: string;
  mappedModules: string[]; // IDs of modules that cover this outcome
}

export interface Curriculum {
  title: string;
  description: string;
  level: string;
  totalDuration: string;
  learningOutcomes: LearningOutcome[];
  modules: Module[];
  assessmentStrategy: string;
  recommendations: string[];
}

export interface GenerationParams {
  subject: string;
  level: string;
  duration: string;
  focus: string;
  industryAlignment: boolean;
}
