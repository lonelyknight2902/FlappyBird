class InputHandler {
    private _keys: { [key: string]: boolean } = {}

    constructor() {
        window.addEventListener('keydown', (e) => {
            e.preventDefault()
            console.log(e.key)
            if (e.key === ' ') {
                this._keys['Space'] = true
            } else {
                this._keys[e.key] = true
            }
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
