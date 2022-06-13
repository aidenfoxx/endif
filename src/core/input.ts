import { Vec2 } from './utils/math';

export enum ButtonState {
  BUTTON_UP,
  BUTTON_DOWN
}

export enum KeyState {
  KEY_UP,
  KEY_DOWN
}

export enum KeyCode {
  KEY_A = 'KeyA',
  KEY_D = 'KeyD',
  KEY_S = 'KeyS',
  KEY_W = 'KeyW'
}

interface InputState {
  mouseX: number;
  mouseY: number;
  mouseButtonStates: ButtonState[];
  keyStates: Record<string, KeyState>
}

const inputState: InputState = {
  mouseX: 0,
  mouseY: 0,
  mouseButtonStates: [],
  keyStates: {}
};

window.addEventListener('mousedown', (event: MouseEvent) => {
  inputState.mouseButtonStates[event.button] = ButtonState.BUTTON_DOWN;
});

window.addEventListener('mouseup', (event: MouseEvent) => {
  inputState.mouseButtonStates[event.button] = ButtonState.BUTTON_UP;
});

window.addEventListener('mousemove', (event: MouseEvent) => {
  inputState.mouseX = event.clientX;
  inputState.mouseY = event.clientY;
})

window.addEventListener('keydown', (event: KeyboardEvent) => {
  inputState.keyStates[event.code] = KeyState.KEY_DOWN;
});

window.addEventListener('keyup', (event: KeyboardEvent) => {
  inputState.keyStates[event.code] = KeyState.KEY_UP;
});

export function inputGetMousePosition(): Vec2 {
  return [inputState.mouseX, inputState.mouseY];
}

export function inputGetMouseButtonState(index: number): ButtonState {
  return inputState.mouseButtonStates[index] ?? ButtonState.BUTTON_UP;
}

export function inputGetKeyState(keyCode: string): KeyState {
  return inputState.keyStates[keyCode] ?? KeyState.KEY_UP;
}
