import Phaser from 'phaser'
import Colors from './Colors'

const NUM_BULLETS = 12

function bullet(game) {
  const gphx = new Phaser.Graphics(game, 0, 0)
  gphx.lineStyle(1, Colors.CONTRAST)
  gphx.moveTo(-2, -2)
  gphx.lineTo(3, 3)
  gphx.moveTo(-2, 3)
  gphx.lineTo(3, -2)

  return {
    path: null,
    step: 0,
    shape: gphx,
    isActive: false
  }
}


export default class BulletGroup {
  constructor (game, board) {
    this.game = game
    this.board = board
    this.bullets = []
    this.fireTimer = 0
    for(let l = 0; l < NUM_BULLETS; l++) {
      let newBullet = bullet(game);
      this.bullets.push(newBullet)
      board.add(newBullet.shape)
    }

  }

  fireBullet (fireFrom, fireTo) {
    const center = this.board.centerPoint
    const FIRE_DELAY = 150;

    if (this.fireTimer + FIRE_DELAY > this.game.time.now) {
      return;
    }

    for(let l = 0; l < NUM_BULLETS; l++) {
      const bullet = this.bullets[l]
      if ( !bullet.isActive ) {
        const path = []
        const numPathSteps = center.x/8 // controls the bullet speed
        let pointsX = [fireFrom.x, fireTo.x]
        let pointsY = [fireFrom.y, fireTo.y]
        for (var r = 0; r <= 1; r += 1 / numPathSteps) {
          path.push({
            x: Phaser.Math.linearInterpolation(pointsX, r),
            y: Phaser.Math.linearInterpolation(pointsY, r)
          })
        }
        bullet.path = path
        bullet.step = 0;
        bullet.isActive = true
        this.fireTimer = this.game.time.now;
        console.log(this)
        return
      }
    }
  }

  update() {

    for(let l = 0; l < NUM_BULLETS; l++) {
      let bullet = this.bullets[l]

      bullet.step += 1;
      if ( bullet.isActive ) {
        if (bullet.step < bullet.path.length) {
          bullet.shape.x = bullet.path[bullet.step].x
          bullet.shape.y = bullet.path[bullet.step].y
        } else {
          bullet.isActive = false

        }
      }
    }
  }
}
