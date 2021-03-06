import { Event as ThreeEvent, EventDispatcher, PerspectiveCamera, Spherical, Vector3 } from 'three';
export declare type EventHandlingBehavior = 'prevent-all' | 'prevent-handled';
export declare type InteractionPolicy = 'always-allow' | 'allow-when-focused';
export declare type TouchMode = 'rotate' | 'zoom';
export interface SmoothControlsOptions {
    minimumRadius?: number;
    maximumRadius?: number;
    minimumPolarAngle?: number;
    maximumPolarAngle?: number;
    minimumAzimuthalAngle?: number;
    maximumAzimuthalAngle?: number;
    minimumFieldOfView?: number;
    maximumFieldOfView?: number;
    eventHandlingBehavior?: EventHandlingBehavior;
    interactionPolicy?: InteractionPolicy;
}
export declare const DEFAULT_OPTIONS: Readonly<SmoothControlsOptions>;
declare const $velocity: unique symbol;
declare const $spherical: unique symbol;
declare const $goalSpherical: unique symbol;
declare const $thetaDamper: unique symbol;
declare const $phiDamper: unique symbol;
declare const $radiusDamper: unique symbol;
declare const $logFov: unique symbol;
declare const $goalLogFov: unique symbol;
declare const $fovDamper: unique symbol;
declare const $target: unique symbol;
declare const $goalTarget: unique symbol;
declare const $targetDamperX: unique symbol;
declare const $targetDamperY: unique symbol;
declare const $targetDamperZ: unique symbol;
declare const $options: unique symbol;
declare const $touchMode: unique symbol;
declare const $canInteract: unique symbol;
declare const $interactionEnabled: unique symbol;
declare const $userAdjustOrbit: unique symbol;
declare const $isUserChange: unique symbol;
declare const $isStationary: unique symbol;
declare const $moveCamera: unique symbol;
declare const $pointerIsDown: unique symbol;
declare const $lastPointerPosition: unique symbol;
declare const $lastTouches: unique symbol;
declare const $pixelLengthToSphericalAngle: unique symbol;
declare const $twoTouchDistance: unique symbol;
declare const $wrapAngle: unique symbol;
declare const $onMouseMove: unique symbol;
declare const $onMouseDown: unique symbol;
declare const $onMouseUp: unique symbol;
declare const $onTouchStart: unique symbol;
declare const $onTouchEnd: unique symbol;
declare const $onTouchMove: unique symbol;
declare const $onWheel: unique symbol;
declare const $onKeyDown: unique symbol;
declare const $handlePointerMove: unique symbol;
declare const $handleSinglePointerMove: unique symbol;
declare const $handlePointerDown: unique symbol;
declare const $handleSinglePointerDown: unique symbol;
declare const $handlePointerUp: unique symbol;
declare const $handleWheel: unique symbol;
declare const $handleKey: unique symbol;
export declare const KeyCode: {
    PAGE_UP: number;
    PAGE_DOWN: number;
    LEFT: number;
    UP: number;
    RIGHT: number;
    DOWN: number;
};
export declare type ChangeSource = 'user-interaction' | 'none';
export declare const ChangeSource: {
    [index: string]: ChangeSource;
};
/**
 * ChangEvents are dispatched whenever the camera position or orientation has
 * changed
 */
export interface ChangeEvent extends ThreeEvent {
    /**
     * determines what was the originating reason for the change event eg user or
     * none
     */
    source: ChangeSource;
}
/**
 * The Damper class is a generic second-order critically damped system that does
 * one linear step of the desired length of time. The only parameter is
 * DECAY_MILLISECONDS, which should be adjustable: TODO(#580). This common
 * parameter makes all states converge at the same rate regardless of scale.
 * xNormalization is a number to provide the rough scale of x, such that
 * NIL_SPEED clamping also happens at roughly the same convergence for all
 * states.
 */
export declare class Damper {
    private [$velocity];
    update(x: number, xGoal: number, timeStepMilliseconds: number, xNormalization: number): number;
}
/**
 * SmoothControls is a Three.js helper for adding delightful pointer and
 * keyboard-based input to a staged Three.js scene. Its API is very similar to
 * OrbitControls, but it offers more opinionated (subjectively more delightful)
 * defaults, easy extensibility and subjectively better out-of-the-box keyboard
 * support.
 *
 * One important change compared to OrbitControls is that the `update` method
 * of SmoothControls must be invoked on every frame, otherwise the controls
 * will not have an effect.
 *
 * Another notable difference compared to OrbitControls is that SmoothControls
 * does not currently support panning (but probably will in a future revision).
 *
 * Like OrbitControls, SmoothControls assumes that the orientation of the camera
 * has been set in terms of position, rotation and scale, so it is important to
 * ensure that the camera's matrixWorld is in sync before using SmoothControls.
 */
export declare class SmoothControls extends EventDispatcher {
    readonly camera: PerspectiveCamera;
    readonly element: HTMLElement;
    private [$interactionEnabled];
    private [$options];
    private [$isUserChange];
    private [$spherical];
    private [$goalSpherical];
    private [$thetaDamper];
    private [$phiDamper];
    private [$radiusDamper];
    private [$logFov];
    private [$goalLogFov];
    private [$fovDamper];
    private [$target];
    private [$goalTarget];
    private [$targetDamperX];
    private [$targetDamperY];
    private [$targetDamperZ];
    private [$pointerIsDown];
    private [$lastPointerPosition];
    private [$lastTouches];
    private [$touchMode];
    private [$onMouseMove];
    private [$onMouseDown];
    private [$onMouseUp];
    private [$onWheel];
    private [$onKeyDown];
    private [$onTouchStart];
    private [$onTouchEnd];
    private [$onTouchMove];
    constructor(camera: PerspectiveCamera, element: HTMLElement);
    readonly interactionEnabled: boolean;
    enableInteraction(): void;
    disableInteraction(): void;
    /**
     * The options that are currently configured for the controls instance.
     */
    readonly options: SmoothControlsOptions;
    /**
     * Copy the spherical values that represent the current camera orbital
     * position relative to the configured target into a provided Spherical
     * instance. If no Spherical is provided, a new Spherical will be allocated
     * to copy the values into. The Spherical that values are copied into is
     * returned.
     */
    getCameraSpherical(target?: Spherical): Spherical;
    /**
     * Returns the camera's current vertical field of view in degrees.
     */
    getFieldOfView(): number;
    /**
     * Configure the options of the controls. Configured options will be
     * merged with whatever options have already been configured for this
     * controls instance.
     */
    applyOptions(options: SmoothControlsOptions): void;
    /**
     * Sets the near and far planes of the camera.
     */
    updateNearFar(nearPlane: number, farPlane: number): void;
    /**
     * Sets the aspect ratio of the camera
     */
    updateAspect(aspect: number): void;
    /**
     * Set the absolute orbital goal of the camera. The change will be
     * applied over a number of frames depending on configured acceleration and
     * dampening options.
     *
     * Returns true if invoking the method will result in the camera changing
     * position and/or rotation, otherwise false.
     */
    setOrbit(goalTheta?: number, goalPhi?: number, goalRadius?: number): boolean;
    /**
     * Subset of setOrbit() above, which only sets the camera's radius.
     */
    setRadius(radius: number): void;
    /**
     * Sets the goal field of view for the camera
     */
    setFieldOfView(fov: number): void;
    /**
     * Sets the target the camera is pointing toward
     */
    setTarget(x: number, y: number, z: number): void;
    /**
     * Returns a copy of the target position the camera is pointed toward
     */
    getTarget(): Vector3;
    /**
     * Adjust the orbital position of the camera relative to its current orbital
     * position. Does not let the theta goal get more than pi ahead of the current
     * theta, which ensures interpolation continues in the direction of the delta.
     */
    adjustOrbit(deltaTheta: number, deltaPhi: number, deltaRadius: number, deltaFov: number): boolean;
    /**
     * Move the camera instantly instead of accelerating toward the goal
     * parameters.
     */
    jumpToGoal(): void;
    /**
     * Update controls. In most cases, this will result in the camera
     * interpolating its position and rotation until it lines up with the
     * designated goal orbital position.
     *
     * Time and delta are measured in milliseconds.
     */
    update(_time: number, delta: number): void;
    private [$isStationary];
    private [$moveCamera];
    private readonly [$canInteract];
    private [$userAdjustOrbit];
    private [$wrapAngle];
    private [$pixelLengthToSphericalAngle];
    private [$twoTouchDistance];
    private [$handlePointerMove];
    private [$handleSinglePointerMove];
    private [$handlePointerDown];
    private [$handleSinglePointerDown];
    private [$handlePointerUp];
    private [$handleWheel];
    private [$handleKey];
}
export {};
