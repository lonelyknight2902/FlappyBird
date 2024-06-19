import { GameState } from '../../../types/state'
import Canvas from '../../Canvas'
import GameScene from '../../GameScene'
import GameHomeState from './GameHomeState'

class GameLoadState implements GameState {
    private _assets: string[]
    private _totalAssets: number
    private _loadedAssets: number
    handleInput(game: GameScene): GameState | null {
        return null
    }
    update(game: GameScene): void {
        if (this._loadedAssets === this._totalAssets) {
            console.log('GameLoadState: Loaded all assets')
            game.state = new GameHomeState()
            game.state.enter(game)
        }
    }
    render(game: GameScene): void {
        const canvas = Canvas.getInstance(450, 800)
        const ctx = canvas.getContext()
        if (ctx === null) {
            return
        }
        canvas.clear()
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, canvas.canvas.width, canvas.canvas.height)
        ctx.fillStyle = 'white'
        ctx.font = '30px Flappy'
        ctx.textAlign = 'center'
        ctx.fillText(
            `Loading... ${this._loadedAssets}/${this._totalAssets}`,
            canvas.canvas.width / 2,
            canvas.canvas.height / 2
        )
    }
    enter(game: GameScene): void {
        console.log('GameLoadState')
        this._assets = [
            'assets/images/background-day.png',
            'assets/images/background-night.png',
            'assets/images/base.png',
            'assets/images/pipe-green.png',
            'assets/images/gameover.png',
            'assets/images/message.png',
            'assets/images/pipe-green-flip.png',
            'assets/images/yellowbird-downflap.png',
            'assets/images/yellowbird-midflap.png',
            'assets/images/yellowbird-upflap.png',
            'assets/audio/hit.wav',
            'assets/audio/swoosh.wav',
            'assets/audio/point.wav',
            'assets/audio/wing.wav',
            'assets/fonts/Flappy.TTF',
        ]
        this._totalAssets = this._assets.length
        this._loadedAssets = 0
        for (const asset of this._assets) {
            if (asset.includes('audio')) {
                // if (asset.includes('hit')) {
                //     const audio = new Audio()
                //     audio.src = asset
                //     audio.oncanplaythrough = () => {
                //         this._loadedAssets++
                //     }
                //     audio.onerror = () => {
                //         this._loadedAssets++
                //     }
                // } else {
                const audio = new Audio()
                audio.src = asset
                audio.oncanplaythrough = () => {
                    this._loadedAssets++
                    console.log('Loaded audio:', asset)
                }
                audio.onerror = () => {
                    this._loadedAssets++
                    console.log('Failed to load audio:', asset)
                }
                audio.load()
                switch (asset) {
                  case 'assets/audio/hit.wav':
                    game.hitAudio = audio
                    break
                  case 'assets/audio/point.wav':
                    game.pointAudio = audio
                    break
                  case 'assets/audio/wing.wav':
                    game.flapAudio = audio
                    game.player.flapAudio = audio
                    break
                }
                // this._loadedAssets++
                // }
            } else if (asset.includes('images')) {
                const image = new Image()
                image.src = asset
                image.onload = () => {
                    this._loadedAssets++
                    console.log('Loaded image:', asset)
                }
                image.onerror = () => {
                    this._loadedAssets++
                    console.log('Failed to load image:', asset)
                }
            } else if (asset.includes('fonts')) {
                const font = new FontFace('Flappy Bird', `url(${asset})`)
                font.load()
                    .then(() => {
                        this._loadedAssets++
                        document.fonts.add(font)
                        console.log('Loaded font:', asset)
                    })
                    .catch((error) => {
                        this._loadedAssets++
                        console.log('Failed to load font:', error)
                    })
            }
        }
    }

    exit(game: GameScene): void {
        return
    }
}

export default GameLoadState
