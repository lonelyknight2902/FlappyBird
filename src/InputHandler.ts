class InputHandler {
    private _keys: { [key: string]: boolean } = {}

    constructor() {
        window.addEventListener('keydown', (e) => {
            e.preventDefault()
            if (e.key === ' ') {
                this._keys['Space'] = true
            } else {
                this._keys[e.key] = true
            }
        })

        window.addEventListener('touchstart', (e) => {
            e.preventDefault()
            this._keys['Space'] = !this._keys['Space']
        })

        window.addEventListener('touchend', (e) => {
            e.preventDefault()
            this._keys['Space'] = false
        })

        window.addEventListener('keyup', (e) => {
            e.preventDefault()
            if (e.key === ' ') {
                this._keys['Space'] = false
            } else {
                this._keys[e.key] = false
            }
        })
    }

    isKeyDown(key: string): boolean {
        return this._keys[key] || false
    }
}

export default InputHandler
