import Phaser from "phaser";

export class MainScene extends Phaser.Scene {
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private keys!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };

  constructor() {
    super("MainScene");
  }

  preload() {
    this.load.spritesheet("hero", "assets/hero.png", {
      frameWidth: 372,
      frameHeight: 720,
    });
    this.load.spritesheet("ground", "assets/ground_tiles.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    this.createMap();

    // Mapping based on 8x2 grid (no gaps)
    // Row 1: Front (0-3), Back (4-7)
    // Row 2: Right (8-11), Left (12-15)

    this.anims.create({
      key: "walk-down",
      frames: this.anims.generateFrameNumbers("hero", { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-up",
      frames: this.anims.generateFrameNumbers("hero", { start: 4, end: 7 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-right",
      frames: this.anims.generateFrameNumbers("hero", { start: 8, end: 11 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-left",
      frames: this.anims.generateFrameNumbers("hero", { start: 12, end: 15 }),
      frameRate: 8,
      repeat: -1,
    });

    // Idle animations
    this.anims.create({
      key: "idle-down",
      frames: [{ key: "hero", frame: 0 }],
    });
    this.anims.create({ key: "idle-up", frames: [{ key: "hero", frame: 4 }] });
    this.anims.create({
      key: "idle-right",
      frames: [{ key: "hero", frame: 8 }],
    });
    this.anims.create({
      key: "idle-left",
      frames: [{ key: "hero", frame: 12 }],
    });

    // Create player sprite
    this.player = this.physics.add.sprite(400, 300, "hero", 0);
    this.player.setScale(0.14);

    // Apply visual crop to hide fragments of adjacent frames
    // 15px from left, 340px width (hides everything after 355px within the 372px cell)
    this.player.setCrop(15, 0, 340, 720);

    // Adjust collision box to precisely match the character's visual height
    // Character is approx 630px tall (from bow at y=50 to shoes at y=680)
    this.player.body.setSize(160, 630);
    this.player.body.setOffset(106, 50);

    this.player.setCollideWorldBounds(true);

    // Simple input - WASD
    this.keys = this.input.keyboard!.addKeys("W,A,S,D") as any;
  }

  createMap() {
    const mapWidth = 25;
    const mapHeight = 20;
    const tileSize = 32;

    const fullWidth = mapWidth * tileSize;
    const fullHeight = mapHeight * tileSize;

    // Use a TileSprite for the base background to ensure PERFECT gapless rendering
    // This will repeat frame 0 across the entire area
    const bg = this.add.tileSprite(
      fullWidth / 2,
      fullHeight / 2,
      fullWidth,
      fullHeight,
      "ground",
      0, // Base grass frame
    );

    // Add some random decorative tiles on top
    for (let i = 0; i < 30; i++) {
        const x = Phaser.Math.Between(0, mapWidth - 1);
        const y = Phaser.Math.Between(0, mapHeight - 1);
        // Frames 1-3 are usually details in our generated tileset
        const frame = Phaser.Math.Between(1, 4); 
        
        this.add.image(
          x * tileSize + tileSize / 2,
          y * tileSize + tileSize / 2,
          "ground",
          frame,
        );
    }
    
    // Set world bounds to match map
    this.physics.world.setBounds(0, 0, fullWidth, fullHeight);
  }

  update() {
    const speed = 200;
    this.player.setVelocity(0);

    let moving = false;
    let animKey = "";

    if (this.keys.A.isDown) {
      this.player.setVelocityX(-speed);
      animKey = "walk-left";
      moving = true;
    } else if (this.keys.D.isDown) {
      this.player.setVelocityX(speed);
      animKey = "walk-right";
      moving = true;
    }

    if (this.keys.W.isDown) {
      this.player.setVelocityY(-speed);
      animKey = moving ? animKey : "walk-up"; // Prefer horizontal if both down, or use animKey from before
      moving = true;
    } else if (this.keys.S.isDown) {
      this.player.setVelocityY(speed);
      animKey = moving ? animKey : "walk-down";
      moving = true;
    }

    if (moving) {
      this.player.anims.play(animKey, true);
    } else {
      // Pause animation or play idle
      const currentAnim = this.player.anims.currentAnim?.key || "walk-down";
      if (currentAnim.startsWith("walk-")) {
        const direction = currentAnim.split("-")[1];
        this.player.anims.play("idle-" + direction);
      }
    }
  }
}
