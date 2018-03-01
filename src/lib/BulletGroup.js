import Phaser from 'phaser'
// import colors from './Colors'

export default class BulletGroup {
  constructor (game, board) {
    this.game = game
    this.board = board

    const bullets = game.add.weapon(12, 'ball')
    this.bullets = bullets

    //    this._buildPoly(this.innerPoints)
  }

  fireBullet (fireFrom, trackSprite) {
    // console.log('In fireBullet', fireFrom, trackSprite)
    // this.bullets.fireFrom.x = fireFrom.x
    // this.bullets.fireFrom.y = fireFrom.y
    // this.bullets.trackSprite(trackSprite)
    this.bullets.fireAngle = this.board.angle
    this.bullets.fire(fireFrom, this.game.world.centerX, this.game.world.centerY)
  }
}
