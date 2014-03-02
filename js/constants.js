// enable debug logging
DEBUG_MODE = true;

// enable input debug logging
DEBUG_INPUT = false;

// input constants -
// make sure to name these after their
// intended purpose, NOT which keys they
// are on the keyboard; that info
// goes in a comment!
KEYS_UP = [38,87]; // W, UpArrow
KEYS_DOWN = [40, 83]; // S, DownArrow
KEYS_LEFT = [37, 65]; // A, LeftArrow
KEYS_RIGHT = [39, 68]; // D, RightArrow
KEYS_INTERACT = [32]; // Space
KEYS_EXIT = [27]; // Escape

// how quickly the player moves
PLAYER_ACCELERATION = 400;
PLAYER_MAX_SPEED = 75;
PLAYER_MIN_SPEED = 0;
PLAYER_MIN_ROTATION_SPEED = 10;
DIAG = Math.sqrt(2);

// enemy stuff
ENEMY_MIN_SPEED = 75;
ENEMY_MAX_SPEED = 125;
ENEMY_START_OFFSET = 100;

LEVEL_COUNT = 7;

// asset info
ASSET_PATH = "assets/";
IMAGE_PATH = ASSET_PATH+"img/";
SOUND_PATH = ASSET_PATH+"snd/";

// size of game
STAGE_W = 800;
STAGE_H = 600;
STAGE_RECT = {
	x: 0,
	y: 0,
	width: STAGE_W,
	height: STAGE_H
}

// maximum time per frame
MAX_DELTA = 1.0/30;

// default screen bg color
DEFAULT_BACKGROUND_COLOR = 0xBEEFEE;