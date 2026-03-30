import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { MainScene } from '../game/scenes/MainScene';

export const Game = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: 800,
      height: 600,
      scene: [MainScene],
      physics: {
        default: 'arcade',
        arcade: { debug: true }
      }
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      gameRef.current?.destroy(true);
    };
  }, []);

  return <div ref={containerRef} className="border-4 border-white" />;
};
