export const GRAVITAIONAL_ACCELERATION = 2000
export const FLAP_FORCE = 500
export enum BodyType {
    RIGID_BODY = 'RIGID_BODY',
    STATIC_BODY = 'STATIC_BODY',
}
export const CANVAS_WIDTH = 450
export const CANVAS_HEIGHT = 800
export const FLAP_RATE = 50
export const BASE_SPEED = 200
export const PIPE_STARTING_OFFSET = 900
export const PIPE_DISTANCE = 400
export const PIPE_GAP = 200
export const PIPE_SOURCE = 'assets/images/pipe-green.png'
export const PIPE_FLIP_SOURCE = 'assets/images/pipe-green-flip.png'
export const FLAP_AUDIO = 'assets/audio/wing.wav'
export const POINT_AUDIO = 'assets/audio/point.wav'
export const BACKGROUND_DAY = 'assets/images/background-day.png'
export const BACKGROUND_NIGHT = 'assets/images/background-night.png'
export enum TriggerState {
    ENTER = 'ENTER',
    EXIT = 'EXIT',
    STAY = 'STAY',
    OUT = 'OUT',
}
export const FADE_OUT_TIME = 1000
export const ROTATION_ACCERATION = 500
export const FLAP_ROTATION_TIME = 100
export const FLASH_IN_OUT_TIME = 100