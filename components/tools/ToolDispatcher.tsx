'use client';

import type { UserProfile } from '@/types';
import type { ToolConfig } from '@/lib/toolConfig';

import TimerTool from './TimerTool';
import ListTool from './ListTool';
import PairsTool from './PairsTool';
import FormTool from './FormTool';
import ChecklistTool from './ChecklistTool';
import CoinTool from './CoinTool';
import TruthDareTool from './TruthDareTool';
import BingoTool from './BingoTool';
import BlackjackTool from './BlackjackTool';
import KanbanTool from './KanbanTool';
import MatrixTool from './MatrixTool';
import StepsTool from './StepsTool';
import PromptTool from './PromptTool';
import ProsConsTool from './ProsConsTool';
import RankTool from './RankTool';
import RewardsTool from './RewardsTool';
import ContractTool from './ContractTool';
import BreakdownTool from './BreakdownTool';
import WantedTool from './WantedTool';
import CardsTool from './CardsTool';

interface Props {
  config: ToolConfig | null;
  strategyId: string;
  profile: UserProfile;
  onProfileChange: (p: UserProfile) => void;
}

export default function ToolDispatcher({ config, strategyId, profile, onProfileChange }: Props) {
  if (!config) return null;

  switch (config.type) {
    case 'timer':
      return <TimerTool config={config as any} strategyId={strategyId} profile={profile} onProfileChange={onProfileChange} />;
    case 'list':
      return <ListTool config={config as any} strategyId={strategyId} profile={profile} onProfileChange={onProfileChange} />;
    case 'pairs':
      return <PairsTool config={config as any} strategyId={strategyId} profile={profile} onProfileChange={onProfileChange} />;
    case 'form':
      return <FormTool config={config as any} strategyId={strategyId} profile={profile} onProfileChange={onProfileChange} />;
    case 'checklist':
      return <ChecklistTool config={config as any} strategyId={strategyId} profile={profile} onProfileChange={onProfileChange} />;
    case 'coin':
      return <CoinTool config={config as any} strategyId={strategyId} profile={profile} onProfileChange={onProfileChange} />;
    case 'truthdare':
      return <TruthDareTool config={config as any} strategyId={strategyId} profile={profile} onProfileChange={onProfileChange} />;
    case 'bingo':
      return <BingoTool config={config as any} strategyId={strategyId} profile={profile} onProfileChange={onProfileChange} />;
    case 'blackjack':
      return <BlackjackTool config={config as any} strategyId={strategyId} profile={profile} onProfileChange={onProfileChange} />;
    case 'kanban':
      return <KanbanTool config={config as any} strategyId={strategyId} profile={profile} onProfileChange={onProfileChange} />;
    case 'matrix':
      return <MatrixTool config={config as any} strategyId={strategyId} profile={profile} onProfileChange={onProfileChange} />;
    case 'steps':
      return <StepsTool config={config as any} strategyId={strategyId} profile={profile} onProfileChange={onProfileChange} />;
    case 'prompt':
      return <PromptTool config={config as any} strategyId={strategyId} profile={profile} onProfileChange={onProfileChange} />;
    case 'proscons':
      return <ProsConsTool config={config as any} strategyId={strategyId} profile={profile} onProfileChange={onProfileChange} />;
    case 'rank':
      return <RankTool config={config as any} strategyId={strategyId} profile={profile} onProfileChange={onProfileChange} />;
    case 'rewards':
      return <RewardsTool config={config as any} strategyId={strategyId} profile={profile} onProfileChange={onProfileChange} />;
    case 'contract':
      return <ContractTool config={config as any} strategyId={strategyId} profile={profile} onProfileChange={onProfileChange} />;
    case 'breakdown':
      return <BreakdownTool config={config as any} strategyId={strategyId} profile={profile} onProfileChange={onProfileChange} />;
    case 'wanted':
      return <WantedTool strategyId={strategyId} profile={profile} onProfileChange={onProfileChange} />;
    case 'cards':
      return <CardsTool config={config as any} strategyId={strategyId} profile={profile} onProfileChange={onProfileChange} />;
    default:
      return null;
  }
}
