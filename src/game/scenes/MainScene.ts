import Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Rectangle;
  private keys!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key; };

  constructor() {
    super('MainScene');
  }

  create() {
    this.createMap();
    
    // Simple player rectangle
    this.player = this.add.rectangle(400, 300, 32, 32, 0xff0000);
    this.physics.add.existing(this.player);
    
    // Simple input - WASD
    this.keys = this.input.keyboard!.addKeys('W,A,S,D') as any;
  }

  createMap() {
    const mapWidth = 25;
    const mapHeight = 20;
    const tileSize = 32;
    
    for (let y = 0; y < mapHeight; y++) {
      for (let x = 0; x < mapWidth; x++) {
        // Procedural grass-like pattern
        const color = (x + y) % 2 === 0 ? 0x228B22 : 0x32CD32; // ForestGreen / LimeGreen
        this.add.rectangle(x * tileSize + tileSize/2, y * tileSize + tileSize/2, tileSize, tileSize, color);
      }
    }
  }

  update() {
    const speed = 200;
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);

    if (this.keys.A.isDown) body.setVelocityX(-speed);
    else if (this.keys.D.isDown) body.setVelocityX(speed);
    if (this.keys.W.isDown) body.setVelocityY(-speed);
    else if (this.keys.S.isDown) body.setVelocityY(speed);
  }
}
